"""End-to-end test of the RAG pipeline (embeddings -> pgvector -> retrieval -> AI endpoints -> scheduler).

Run from the project root:  HF_HUB_OFFLINE=1 ./venv/bin/python qa/rag_tests.py
Uses the demo accounts from qa/seed_demo.py; throw-away data is prefixed qa-tmp and removed at the end.
Writes qa/rag_results.json.
"""
import io
import json
import os
import re
import subprocess
import sys
import time
from contextlib import redirect_stdout
from datetime import date, datetime, timedelta
from pathlib import Path

os.environ.setdefault("HF_HUB_OFFLINE", "1")          # prove the embedding model is local
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import numpy as np          # noqa: E402
import requests             # noqa: E402
from sqlalchemy import func, text   # noqa: E402

from app.database import SessionLocal, engine                      # noqa: E402
from app.models import ActivityLog, Organization, RAGDocument, User   # noqa: E402
from app.security import hash_password                              # noqa: E402
from app.services.analytics_service import get_dashboard_metrics_for_date  # noqa: E402
from app.services.rag import embeddings                             # noqa: E402
from app.services.rag.context_builder import build_rag_context      # noqa: E402
from app.services.rag.daily_ingestion import (ingest_organization_daily_rag, ingest_user_daily_rag,  # noqa: E402
                                              run_daily_rag_ingestion)
from app.services.rag.documents import build_daily_summary_document, _format_seconds  # noqa: E402
from app.services.rag.rag_service import rag_service                # noqa: E402
from app.services.rag.retriever import retrieve_relevant_context    # noqa: E402
from app.services.rag import scheduler as sched                     # noqa: E402
from app.services.rag.vector_store import (delete_user_documents, search_similar_documents,  # noqa: E402
                                           store_document)

API = "http://127.0.0.1:8010"
PW = "Demo@12345"
RUN = str(int(time.time()))[-6:]
results = []
db = SessionLocal()
TODAY = date.today()


def rec(tid, area, title, expected, actual, ok, note="", status=None):
    st = status or ("PASS" if ok else "FAIL")
    results.append({"id": tid, "area": area, "title": title, "expected": str(expected), "actual": str(actual)[:240], "status": st, "note": note, "shot": None})
    print(f"{st:7} {tid}  {title}  [expected {expected}; got {str(actual)[:120]}]")


def uid(email):
    return db.query(User).filter(User.email == email).one().id


U_A1, U_A2, U_B1, U_SOLO = (uid(e) for e in ("demo.employee@example.com", "demo.employee2@example.com",
                                             "demo.employee.beta@example.com", "demo.user@example.com"))
ORG_A, ORG_B = (db.query(Organization).filter(Organization.organization_name == n).one().id for n in ("Demo Corp Alpha", "Demo Corp Beta"))
DEMO_USERS = [U_A1, U_A2, U_B1, U_SOLO]


def docs(**flt):
    q = db.query(RAGDocument)
    for k, v in flt.items():
        q = q.filter(getattr(RAGDocument, k) == v)
    return q.all()


def dated(doc):
    return (doc.document_metadata or {}).get("date")


# ======================================================================================
# A. INFRASTRUCTURE
# ======================================================================================
A = "Infrastructure"
with engine.connect() as c:
    ext = c.execute(text("select extversion from pg_extension where extname='vector'")).scalar()
    coltype = c.execute(text("select format_type(a.atttypid,a.atttypmod) from pg_attribute a join pg_class t on t.oid=a.attrelid "
                             "where t.relname='rag_documents' and a.attname='embedding'")).scalar()
    ann = c.execute(text("select indexname from pg_indexes where tablename='rag_documents' and (indexdef ilike '%hnsw%' or indexdef ilike '%ivfflat%')")).fetchall()
rec("RAG-01", A, "pgvector extension is installed in the database", "vector extension", ext, ext is not None)
rec("RAG-02", A, "rag_documents.embedding column is vector(384)", "vector(384)", coltype, coltype == "vector(384)")
rec("RAG-03", A, "Approximate-nearest-neighbour index (HNSW / IVFFlat) on the embedding column", "index present", "none - every search scans the table",
    bool(ann), "Fine for a few thousand documents; add an HNSW index (vector_cosine_ops) before the table grows large", status="PASS" if ann else "NOTE")

t0 = time.time()
try:
    model = embeddings.get_embedding_model()
    dim = embeddings.get_embedding_dimension()
    load = time.time() - t0
    rec("RAG-04", A, "Embedding model all-MiniLM-L6-v2 loads from the local cache with no internet (HF_HUB_OFFLINE=1)", "384 dims", f"{dim} dims in {load:.1f}s", dim == 384)
except Exception as e:                                   # pragma: no cover
    rec("RAG-04", A, "Embedding model loads offline", "384 dims", repr(e)[:160], False)
    raise SystemExit("cannot continue without the embedding model")

v1 = np.array(embeddings.embed_text("Deep coding session with high focus on GitHub"))
v2 = np.array(embeddings.embed_text("Deep coding session with high focus on GitHub"))
rec("RAG-05", A, "Embeddings are unit length and deterministic", "norm 1.0, identical twice", f"norm {np.linalg.norm(v1):.4f}, equal={np.allclose(v1, v2)}",
    abs(np.linalg.norm(v1) - 1) < 1e-3 and np.allclose(v1, v2, atol=1e-5))
a = np.array(embeddings.embed_text("I spent the afternoon programming in Python and reading developer docs"))
b = np.array(embeddings.embed_text("The best banana bread recipe uses very ripe bananas"))
rec("RAG-06", A, "Semantic sanity: related sentences are closer than unrelated ones", "sim(coding, programming) > sim(coding, banana bread)",
    f"{float(v1 @ a):.2f} vs {float(v1 @ b):.2f}", float(v1 @ a) > float(v1 @ b) + 0.2)
try:
    embeddings.embed_text("   ")
    raised = False
except ValueError:
    raised = True
batch = embeddings.embed_texts(["alpha", "beta", "gamma"])
single = embeddings.embed_text("beta")
rec("RAG-07", A, "Empty text is rejected; batch embedding equals single embedding; empty batch returns []", "ValueError, batch==single, []",
    f"raised={raised}, batch_ok={np.allclose(batch[1], single, atol=1e-5)}, empty={embeddings.embed_texts([])}",
    raised and np.allclose(batch[1], single, atol=1e-5) and embeddings.embed_texts([]) == [])

# ======================================================================================
# B. DOCUMENT BUILDERS
# ======================================================================================
B = "Document building"
txt = build_daily_summary_document(date="2026-10-01", focus_score=71.5, browser_time=7320, active_time=5400, idle_time=900, productive_time=4200,
                                   non_productive_time=1800, tab_switches=12, top_websites=["github.com", "youtube.com"])
rec("RAG-08", B, "Daily summary text contains the date, formatted times, tab switches and websites", "all present",
    txt.replace("\n", " | ")[:150], all(s in txt for s in ("Date: 2026-10-01", "Browser time: 2h 2m", "Active time: 1h 30m", "Tab switches: 12", "github.com, youtube.com", "Distracting websites: None recorded")))
rec("RAG-09", B, "Time formatter handles 0 / None / minutes / hours", "0m, 0m, 5m, 1h, 1h 1m", ", ".join(_format_seconds(x) for x in (0, None, 300, 3600, 3660)),
    [_format_seconds(x) for x in (0, None, 300, 3600, 3660)] == ["0m", "0m", "5m", "1h", "1h 1m"])
docs_in = [{"content": "x" * 5000, "document_type": "daily_summary", "similarity": .9, "metadata": {"date": "2026-10-01"}}] * 8
ctx = build_rag_context(docs_in)
rec("RAG-10", B, "Context builder keeps at most 5 documents, truncates to 3000 chars, shows dates & similarity, returns '' when empty",
    "5 sections, <=3000 chars each, '' for none", f"{ctx.count('[Historical Context')} sections; empty={build_rag_context([])!r}",
    ctx.count("[Historical Context") == 5 and "Historical Date: 2026-10-01" in ctx and "Similarity: 0.900" in ctx and build_rag_context([]) == "" and ("x" * 3001) not in ctx)

# ======================================================================================
# C. INGESTION (real activity data of the demo accounts)
# ======================================================================================
C = "Ingestion"
db.query(RAGDocument).filter(RAGDocument.user_id.in_(DEMO_USERS)).delete(synchronize_session=False)
db.query(RAGDocument).filter(RAGDocument.organization_id.in_([ORG_A, ORG_B])).delete(synchronize_session=False)
db.commit()

counts = {}
for d in range(1, 7):      # the demo accounts have 7 days of history: today + the 6 days before
    counts[d] = ingest_user_daily_rag(TODAY - timedelta(days=d))
    ingest_organization_daily_rag(TODAY - timedelta(days=d))
ok = all(counts[d] >= 4 for d in counts)
rec("RAG-11", C, "Ingestion creates a daily summary for every active user with activity (6 past days x demo users)", ">=4 users per day for 6 days", counts, ok)
per_user = {u: sorted(dated(x) for x in docs(user_id=u, document_type="daily_summary")) for u in DEMO_USERS}
rec("RAG-12", C, "Each demo user has exactly one document per day (6 distinct dates, no duplicates)", "6 docs, 6 dates each",
    {u: (len(v), len(set(v))) for u, v in per_user.items()}, all(len(v) == 6 and len(set(v)) == 6 for v in per_user.values()))
before = db.query(func.count(RAGDocument.id)).scalar()
again = ingest_user_daily_rag(TODAY - timedelta(days=1))
ingest_organization_daily_rag(TODAY - timedelta(days=1))
after = db.query(func.count(RAGDocument.id)).scalar()
rec("RAG-13", C, "Re-running ingestion for the same day updates in place (idempotent)", f"count stays {before}", f"{before} -> {after}", before == after)

yday = TODAY - timedelta(days=1)
m = get_dashboard_metrics_for_date(db, user_id=U_A1, target_date=yday)
doc = next(x for x in docs(user_id=U_A1, document_type="daily_summary") if dated(x) == yday.isoformat())
fs = re.search(r"Focus score: ([\d.]+)", doc.content)
rec("RAG-14", C, "Stored document numbers match the analytics for that day", f"focus {m['focus_score']}, browser {_format_seconds(m['browser_time'])}",
    doc.content.replace("\n", " | ")[:130], fs and abs(float(fs.group(1)) - float(m["focus_score"])) < 0.01 and f"Browser time: {_format_seconds(m['browser_time'])}" in doc.content)
rec("RAG-15", C, "User documents carry the right organisation (Alpha / Beta / none) and 384-dim embeddings", "orgs match, 384 dims",
    {u: db.query(RAGDocument.organization_id).filter(RAGDocument.user_id == u).distinct().all() for u in (U_A1, U_B1, U_SOLO)},
    all(x.organization_id == ORG_A for x in docs(user_id=U_A1)) and all(x.organization_id == ORG_B for x in docs(user_id=U_B1))
    and all(x.organization_id is None for x in docs(user_id=U_SOLO)) and all(len(x.embedding) == 384 for x in docs(user_id=U_A1)))
odocs = docs(document_type="organization_daily_summary")
orgs = {x.organization_id for x in odocs if x.organization_id in (ORG_A, ORG_B)}
rec("RAG-16", C, "Organisation summaries exist per organisation and day, with no user id attached", "Alpha & Beta, 6 each, user_id null",
    {o: sum(1 for x in odocs if x.organization_id == o) for o in (ORG_A, ORG_B)},
    orgs == {ORG_A, ORG_B} and all(sum(1 for x in odocs if x.organization_id == o) == 6 for o in (ORG_A, ORG_B)) and all(x.user_id is None for x in odocs if x.organization_id in (ORG_A, ORG_B)))

tmp = User(full_name="QA Tmp RAG", email=f"qa-tmp-rag-{RUN}@example.com", hashed_password=hash_password(PW), age=20, occupation="t", role="USER", organization_id=ORG_A, is_active=True)
db.add(tmp); db.commit()
ingest_user_daily_rag(yday)
rec("RAG-17", C, "A user with no activity on the day gets no document", "0 documents", len(docs(user_id=tmp.id)), len(docs(user_id=tmp.id)) == 0)
n_old = ingest_user_daily_rag(TODAY - timedelta(days=30))
rec("RAG-18", C, "A day without any activity (30 days ago) creates no documents for the demo users", "0 for demo users",
    db.query(func.count(RAGDocument.id)).filter(RAGDocument.user_id.in_(DEMO_USERS), RAGDocument.document_metadata["date"].as_string() == (TODAY - timedelta(days=30)).isoformat()).scalar(),
    db.query(func.count(RAGDocument.id)).filter(RAGDocument.user_id.in_(DEMO_USERS), RAGDocument.document_metadata["date"].as_string() == (TODAY - timedelta(days=30)).isoformat()).scalar() == 0)
buf = io.StringIO()
with redirect_stdout(buf):
    try:
        run_daily_rag_ingestion()
        err = None
    except Exception as e:
        err = repr(e)
out = buf.getvalue()
rec("RAG-19", C, "The scheduled job function run_daily_rag_ingestion() runs end to end", "completes, prints 'DAILY RAG INGESTION COMPLETE'",
    err or ("complete" if "COMPLETE" in out else out[-80:]), err is None and "DAILY RAG INGESTION COMPLETE" in out)
n_after = db.query(func.count(RAGDocument.id)).scalar()
rec("RAG-20", C, "...and it is also idempotent (no new rows on a repeat)", f"{after} rows", n_after, n_after == after)

# ======================================================================================
# D. RETRIEVAL
# ======================================================================================
D = "Retrieval & isolation"
q = "Which websites distracted me and how was my focus score?"
ctx_a = rag_service.retrieve_context(db, query=q, user_id=U_A1, document_type="daily_summary", limit=5, min_similarity=0.25)
rec("RAG-21", D, "Retrieval returns a formatted historical context for a user", "context with header and dates",
    ctx_a[:70].replace("\n", " ") + "...", ctx_a.startswith("RELEVANT HISTORICAL FOCUSGUARD CONTEXT") and ctx_a.count("[Historical Context") == 5 and "Historical Date: 20" in ctx_a)
res = retrieve_relevant_context(db, query=q, user_id=U_A1, limit=4, min_similarity=0.0)
sims = [r["similarity"] for r in res]
rec("RAG-22", D, "Results are ordered by similarity and respect the limit", "<=4, descending", [round(s, 3) for s in sims], len(res) <= 4 and sims == sorted(sims, reverse=True) and len(res) > 0)
rec("RAG-23", D, "min_similarity=0.99 returns nothing (threshold works)", "[]", len(retrieve_relevant_context(db, query=q, user_id=U_A1, min_similarity=0.99)),
    retrieve_relevant_context(db, query=q, user_id=U_A1, min_similarity=0.99) == [])
s, e = (TODAY - timedelta(days=5)).isoformat(), (TODAY - timedelta(days=3)).isoformat()
win = retrieve_relevant_context(db, query=q, user_id=U_A1, document_type="daily_summary", start_date=s, end_date=e, limit=20, min_similarity=0.0)
rec("RAG-24", D, "Date window (start/end) returns only documents inside the window", f"3 docs between {s} and {e}", sorted(r["metadata"]["date"] for r in win),
    len(win) == 3 and all(s <= r["metadata"]["date"] <= e for r in win))
ex = retrieve_relevant_context(db, query=q, user_id=U_A1, document_type="daily_summary", exclude_date=yday.isoformat(), limit=20, min_similarity=0.0)
rec("RAG-25", D, "exclude_date removes that day (used to skip today)", f"no {yday}", len(ex), len(ex) == 5 and all(r["metadata"]["date"] != yday.isoformat() for r in ex))
ids_a = {r["document_id"] for r in retrieve_relevant_context(db, query=q, user_id=U_A1, limit=50, min_similarity=0.0)}
ids_b = {r["document_id"] for r in retrieve_relevant_context(db, query=q, user_id=U_B1, limit=50, min_similarity=0.0)}
owners_a = {x.user_id for x in db.query(RAGDocument).filter(RAGDocument.id.in_(ids_a))}
rec("RAG-26", D, "User isolation: an employee's retrieval only ever returns their own documents", "only own user id, no overlap with another org's user",
    f"A owners={owners_a}, overlap={ids_a & ids_b}", owners_a == {U_A1} and not (ids_a & ids_b))
org_res = retrieve_relevant_context(db, query=q, organization_id=ORG_A, document_type="organization_daily_summary", limit=50, min_similarity=0.0)
owners_o = {x.organization_id for x in db.query(RAGDocument).filter(RAGDocument.id.in_([r["document_id"] for r in org_res]))}
rec("RAG-27", D, "Organisation isolation: org retrieval (as the AI endpoint calls it) returns only that organisation's summaries", "only org A, only org-level docs",
    f"orgs={owners_o}, types={ {r['document_type'] for r in org_res} }", owners_o == {ORG_A} and {r["document_type"] for r in org_res} == {"organization_daily_summary"} and len(org_res) == 6)
raw = retrieve_relevant_context(db, query=q, organization_id=ORG_A, limit=50, min_similarity=0.0)
rec("RAG-28", D, "Design check: org-scoped retrieval WITHOUT a document type would also return individual employees' documents", "only matters if a caller forgets document_type",
    {r["document_type"] for r in raw}, True, "The AI endpoint always passes document_type='organization_daily_summary', so employees' personal summaries stay private; make the type mandatory for org scope to be safe",
    status="NOTE" if "daily_summary" in {r["document_type"] for r in raw} else "PASS")


def raises(fn, exc=ValueError):
    try:
        fn()
    except exc:
        return True
    except Exception:
        return False
    return False


rec("RAG-29", D, "Unscoped search (no user and no organisation) is refused", "ValueError", raises(lambda: retrieve_relevant_context(db, query=q)), raises(lambda: retrieve_relevant_context(db, query=q)))
rec("RAG-30", D, "start_date later than end_date is refused", "ValueError", True, raises(lambda: retrieve_relevant_context(db, query=q, user_id=U_A1, start_date="2026-10-10", end_date="2026-10-01")))
rec("RAG-31", D, "Empty query returns an empty list; wrong-size vector or limit < 1 is refused", "[], ValueError, ValueError",
    retrieve_relevant_context(db, query="  ", user_id=U_A1), retrieve_relevant_context(db, query="  ", user_id=U_A1) == []
    and raises(lambda: search_similar_documents(db, query_embedding=[0.1] * 10, user_id=U_A1)) and raises(lambda: search_similar_documents(db, query_embedding=[0.1] * 384, user_id=U_A1, limit=0)))
rec("RAG-32", D, "Storing a document with empty text or a wrong-size embedding is refused", "ValueError x2", True,
    raises(lambda: store_document(db, user_id=U_A1, organization_id=None, document_type="x", content=" ", embedding=[0.0] * 384))
    and raises(lambda: store_document(db, user_id=U_A1, organization_id=None, document_type="x", content="ok", embedding=[0.0] * 5)))

# semantic ranking on throw-away documents
docs_sem = {
    "gaming": "Daily summary. Focus score 12. Spent four hours on YouTube, Instagram and online games. Very distracted, mostly entertainment and social media.",
    "coding": "Daily summary. Focus score 94. Long uninterrupted coding sessions on GitHub and Stack Overflow, productive development work, few tab switches.",
    "idle": "Daily summary. Focus score 40. The computer was idle for most of the day, long breaks, almost no browsing activity.",
}
for k, v in docs_sem.items():
    store_document(db, user_id=tmp.id, organization_id=None, document_type="semantic_test", content=v, embedding=embeddings.embed_text(v), metadata={"date": f"2026-01-0{list(docs_sem).index(k)+1}", "k": k})
def top(query):
    r = retrieve_relevant_context(db, query=query, user_id=tmp.id, document_type="semantic_test", limit=3, min_similarity=0.0)
    return r[0]["metadata"]["k"], [round(x["similarity"], 2) for x in r]
t1, t2, t3 = top("When was I most distracted by entertainment and social media?"), top("Which day did I do deep programming work?"), top("Show the day the computer was mostly inactive")
rec("RAG-33", D, "Semantic ranking: the right document is retrieved first for three different questions", "gaming, coding, idle",
    f"{t1[0]}, {t2[0]}, {t3[0]}", (t1[0], t2[0], t3[0]) == ("gaming", "coding", "idle"))
n_del = delete_user_documents(db, user_id=tmp.id, document_type="semantic_test")
rec("RAG-34", D, "Delete helper removes exactly the documents of that user and type", "3 deleted", n_del, n_del == 3 and len(docs(user_id=tmp.id)) == 0)

# ======================================================================================
# E. SCHEDULER
# ======================================================================================
E = "Scheduler"
sched.start_rag_scheduler(); sched.start_rag_scheduler()
jobs = sched.scheduler.get_jobs()
job = jobs[0] if jobs else None
nxt = job.next_run_time if job else None
rec("RAG-35", E, "Scheduler registers one daily job at 00:10 Asia/Kolkata (calling start twice does not duplicate it)", "1 job, cron 00:10 IST",
    f"{len(jobs)} job, {job.trigger if job else None}, next {nxt}", len(jobs) == 1 and job.id == "daily_rag_ingestion" and "hour='0'" in str(job.trigger) and "minute='10'" in str(job.trigger) and nxt is not None and nxt.tzinfo is not None)
sched.stop_rag_scheduler()
rec("RAG-36", E, "Scheduler stops cleanly", "not running", sched.scheduler.running, not sched.scheduler.running)

# ======================================================================================
# F. API END TO END (own backend instance with captured log)
# ======================================================================================
F = "AI endpoints"
LOG = ROOT / "qa" / "rag_backend.log"
env = {**os.environ, "PYTHONUNBUFFERED": "1", "HF_HUB_OFFLINE": "1"}
proc = subprocess.Popen([str(ROOT / "venv/bin/uvicorn"), "app.main:app", "--port", "8010"], cwd=str(ROOT), env=env, stdout=open(LOG, "w"), stderr=subprocess.STDOUT)
try:
    for _ in range(90):
        try:
            requests.get(API + "/", timeout=1); break
        except Exception:
            time.sleep(1)
    def login(email):
        r = requests.post(API + "/auth/login", json={"email": email, "password": PW}); r.raise_for_status()
        return {"Authorization": "Bearer " + r.json()["access_token"]}
    def call(method, path, h, **kw):
        pos = LOG.stat().st_size
        r = requests.request(method, API + path, headers=h, timeout=240, **kw)
        time.sleep(0.8)
        with open(LOG) as f:
            f.seek(pos); seg = f.read()
        return r, seg
    def dates_in(seg):
        return sorted(set(re.findall(r"Historical Date: (\d{4}-\d{2}-\d{2})", seg)))
    log0 = LOG.read_text()
    rec("RAG-37", F, "Backend start-up starts the RAG scheduler", "'[RAG Scheduler] Started' in the log", "found" if "[RAG Scheduler] Started" in log0 else "missing", "[RAG Scheduler] Started" in log0)

    h_emp = login("demo.employee@example.com")
    # synthetic older history so the week / month windows have something to find (removed at the end)
    for off in list(range(8, 15)) + [31, 35, 40, 50, 60]:
        d = TODAY - timedelta(days=off)
        rag_service.create_daily_summary(db, user_id=U_A1, organization_id=ORG_A, date=d.isoformat(),
                                         metrics={"focus_score": 60 + off % 7, "browser_time": 20000, "active_time": 15000, "idle_time": 2000, "productive_time": 12000,
                                                  "non_productive_time": 5000, "tab_switches": off, "top_websites": ["github.com"]})
    for off in list(range(8, 15)) + [31, 35, 40, 50, 60]:
        rag_service.create_organization_daily_summary(db, organization_id=ORG_A, date=(TODAY - timedelta(days=off)).isoformat(),
                                                      metrics={"focus_score": 70, "browser_time": 40000, "active_time": 30000, "idle_time": 3000, "productive_time": 25000, "non_productive_time": 9000, "tab_switches": 30})

    r, seg = call("GET", "/ai/recommendation?period=today", h_emp)
    ok_status = r.status_code == 200
    llm_blocked = r.status_code >= 500
    dts = dates_in(seg)
    rec("RAG-38", F, "GET /ai/recommendation (today): returns a recommendation", "200 + text", f"{r.status_code} {str(r.text)[:80]}", ok_status and len(r.text) > 50, status="BLOCKED" if llm_blocked else None,
        note="LLM call failed (check GROQ_API_KEY / internet)" if llm_blocked else "")
    rec("RAG-39", F, "...and the prompt contained historical context from past days only (window today-30 .. yesterday)", f"dates between {(TODAY - timedelta(days=30))} and {yday}",
        dts, bool(dts) and all((TODAY - timedelta(days=30)).isoformat() <= d <= yday.isoformat() for d in dts))
    t_docs_1 = [x for x in docs(user_id=U_A1, document_type="daily_summary") if dated(x) == TODAY.isoformat()]
    call("GET", "/ai/recommendation?period=today", h_emp)
    t_docs_2 = [x for x in docs(user_id=U_A1, document_type="daily_summary") if dated(x) == TODAY.isoformat()]
    rec("RAG-40", F, "Today's own summary is stored once and updated (not duplicated) by repeated calls", "1 document for today", f"{len(t_docs_1)} then {len(t_docs_2)}", len(t_docs_1) == 1 and len(t_docs_2) == 1)
    rec("RAG-41", F, "Today's document is NOT fed back as 'history' (exclude_date)", "today absent from context dates", sorted(dts), TODAY.isoformat() not in dts)

    r, seg = call("GET", "/ai/recommendation?period=week", h_emp)
    dts = dates_in(seg); lo, hi = (TODAY - timedelta(days=14)).isoformat(), (TODAY - timedelta(days=8)).isoformat()
    rec("RAG-42", F, "Week recommendation uses the previous-week window (today-14 .. today-8)", f"{lo}..{hi}", dts, r.status_code == 200 and bool(dts) and all(lo <= d <= hi for d in dts),
        status="BLOCKED" if r.status_code >= 500 else None)
    r, seg = call("GET", "/ai/recommendation?period=month", h_emp)
    dts = dates_in(seg); lo, hi = (TODAY - timedelta(days=60)).isoformat(), (TODAY - timedelta(days=31)).isoformat()
    rec("RAG-43", F, "Month recommendation uses the previous-month window (today-60 .. today-31)", f"{lo}..{hi}", dts, r.status_code == 200 and bool(dts) and all(lo <= d <= hi for d in dts),
        status="BLOCKED" if r.status_code >= 500 else None)

    r, seg = call("POST", "/ai/chat", h_emp, json={"message": "How does my focus today compare with my earlier days?"})
    dts = dates_in(seg)
    rec("RAG-44", F, "AI chat answers a question and includes historical context in the prompt", "200, reply text, context dates before today", f"{r.status_code} {r.text[:80]}",
        r.status_code == 200 and len(r.text) > 20 and bool(dts) and all(d < TODAY.isoformat() for d in dts), status="BLOCKED" if r.status_code >= 500 else None)
    h_solo = login("demo.user@example.com")
    r, seg = call("POST", "/ai/chat", h_solo, json={"message": "Summarise my recent productivity"})
    rec("RAG-45", F, "A user without an organisation can use chat + RAG (own documents only)", "200", r.status_code, r.status_code == 200, status="BLOCKED" if r.status_code >= 500 else None)

    h_sa = login("demo.superadmin@example.com")
    r, seg = call("GET", f"/ai/organization-recommendation?organization_id={ORG_A}&period=today", h_sa)
    o_dates = dates_in(seg)
    rec("RAG-46", F, "Super Admin organisation recommendation returns a result built with organisation history", "200, history dates before today", f"{r.status_code}, {o_dates}",
        r.status_code == 200 and bool(o_dates) and all(d < TODAY.isoformat() for d in o_dates), status="BLOCKED" if r.status_code >= 500 else None)
    o_today = [x for x in docs(organization_id=ORG_A, document_type="organization_daily_summary") if dated(x) == TODAY.isoformat()]
    rec("RAG-47", F, "...and stored/updated today's organisation summary exactly once", "1", len(o_today), len(o_today) == 1)
    h_sub = login("demo.subadmin@example.com")
    r1, _ = call("GET", f"/ai/organization-recommendation?organization_id={ORG_A}", h_sub)
    r2, _ = call("GET", f"/ai/organization-recommendation?organization_id={ORG_A}", h_emp)
    rec("RAG-48", F, "Organisation AI insights stay Super-Admin only (Sub Admin and Employee are refused)", "403, 403", f"{r1.status_code}, {r2.status_code}", r1.status_code == 403 and r2.status_code == 403)
finally:
    proc.terminate()
    try:
        proc.wait(timeout=10)
    except Exception:
        proc.kill()

# ======================================================================================
# G. SAME ENDPOINTS WITH A STAND-IN LLM (deterministic: checks the exact prompt each endpoint builds)
# ======================================================================================
G = "Prompt assembly (stand-in LLM)"
from fastapi.testclient import TestClient      # noqa: E402
from app.main import app as fastapi_app        # noqa: E402
from app.services.llm import llm_service       # noqa: E402

client = TestClient(fastapi_app)
prompts = []
real_ask = llm_service.ask_llm


def fake_ask(prompt, *a, **k):
    prompts.append(prompt)
    return "STUB-LLM-REPLY complete sentence."


llm_service.ask_llm = fake_ask
MARK = f"ALPHA-ONLY-MARKER-{RUN}"
MARK_ORG = f"ALPHA-ORG-MARKER-{RUN}"
db2 = SessionLocal()
for off in range(8, 15):
    d = (TODAY - timedelta(days=off)).isoformat()
    rag_service.create_daily_summary(db2, user_id=U_A1, organization_id=ORG_A, date=d,
        metrics={"focus_score": 61, "browser_time": 20000, "active_time": 15000, "idle_time": 2000, "productive_time": 12000, "non_productive_time": 5000, "tab_switches": 9, "top_websites": [MARK]})
    rag_service.create_daily_summary(db2, user_id=U_B1, organization_id=ORG_B, date=d,
        metrics={"focus_score": 55, "browser_time": 18000, "active_time": 12000, "idle_time": 3000, "productive_time": 9000, "non_productive_time": 6000, "tab_switches": 7, "top_websites": ["beta-site.example"]})
    rag_service.create_organization_daily_summary(db2, organization_id=ORG_A, date=d,
        metrics={"focus_score": 70, "browser_time": 40000, "active_time": 30000, "idle_time": 3000, "productive_time": 25000, "non_productive_time": 9000, "tab_switches": 30, "top_websites": [MARK_ORG]})
    rag_service.create_organization_daily_summary(db2, organization_id=ORG_B, date=d,
        metrics={"focus_score": 52, "browser_time": 30000, "active_time": 20000, "idle_time": 4000, "productive_time": 14000, "non_productive_time": 9000, "tab_switches": 20, "top_websites": ["beta-org-site.example"]})


def tok(email):
    r = client.post("/auth/login", json={"email": email, "password": PW}); r.raise_for_status()
    return {"Authorization": "Bearer " + r.json()["access_token"]}


def hist_dates(prompt):
    return sorted(set(re.findall(r"Historical Date: (\d{4}-\d{2}-\d{2})", prompt)))


h_a, h_b, h_sa = tok("demo.employee@example.com"), tok("demo.employee.beta@example.com"), tok("demo.superadmin@example.com")
prompts.clear()
r = client.get("/ai/recommendation?period=today", headers=h_a); p_today = prompts[-1] if prompts else ""
rec("RAG-49", G, "Recommendation (today): endpoint returns 200 with the LLM's text and the prompt carries a RAG block", "200, STUB reply, 'RELEVANT HISTORICAL' in prompt",
    f"{r.status_code}, reply={'STUB-LLM-REPLY' in r.text}, rag={'RELEVANT HISTORICAL FOCUSGUARD CONTEXT' in p_today}", r.status_code == 200 and "STUB-LLM-REPLY" in r.text and "RELEVANT HISTORICAL FOCUSGUARD CONTEXT" in p_today)
dts = hist_dates(p_today)
rec("RAG-50", G, "...history dates all lie in [today-30, yesterday]", f"{TODAY - timedelta(days=30)}..{yday}", dts, bool(dts) and all((TODAY - timedelta(days=30)).isoformat() <= d <= yday.isoformat() for d in dts))
prompts.clear()
r = client.get("/ai/recommendation?period=week", headers=h_a); p_a = prompts[-1] if prompts else ""
prompts.clear()
r2 = client.get("/ai/recommendation?period=week", headers=h_b); p_b = prompts[-1] if prompts else ""
lo, hi = (TODAY - timedelta(days=14)).isoformat(), (TODAY - timedelta(days=8)).isoformat()
rec("RAG-51", G, "Week recommendation: the previous-week window is used (today-14 .. today-8)", f"{lo}..{hi}", hist_dates(p_a), bool(hist_dates(p_a)) and all(lo <= d <= hi for d in hist_dates(p_a)))
rec("RAG-52", G, "Employee A's own history reaches A's prompt (marker present) ...", "marker in A's prompt", MARK in p_a, MARK in p_a)
rec("RAG-53", G, "... and never leaks into employee B's prompt in another organisation (B only sees B's data)", "marker absent from B, beta-site present",
    f"marker_in_B={MARK in p_b}, B_own={'beta-site.example' in p_b}", MARK not in p_b and "beta-site.example" in p_b and r2.status_code == 200)
prompts.clear()
r = client.get("/ai/recommendation?period=month", headers=h_a); p_m = prompts[-1] if prompts else ""
lo, hi = (TODAY - timedelta(days=60)).isoformat(), (TODAY - timedelta(days=31)).isoformat()
rec("RAG-54", G, "Month recommendation: the previous-month window is used (today-60 .. today-31)", f"{lo}..{hi}", hist_dates(p_m), bool(hist_dates(p_m)) and all(lo <= d <= hi for d in hist_dates(p_m)))
prompts.clear()
r = client.post("/ai/chat", headers=h_a, json={"message": "Why was my focus lower last week?"}); p_c = prompts[-1] if prompts else ""
rec("RAG-55", G, "Chat: the question and the retrieved history are both in the prompt; reply returned", "question + 'RELEVANT HISTORICAL' + STUB reply",
    f"{r.status_code}, q={'Why was my focus lower last week?' in p_c}, rag={'RELEVANT HISTORICAL FOCUSGUARD CONTEXT' in p_c}", r.status_code == 200 and "Why was my focus lower last week?" in p_c
    and "RELEVANT HISTORICAL FOCUSGUARD CONTEXT" in p_c and "STUB-LLM-REPLY" in r.text)
prompts.clear()
r = client.get(f"/ai/organization-recommendation?organization_id={ORG_A}&period=week", headers=h_sa); p_oa = prompts[-1] if prompts else ""
prompts.clear()
r2 = client.get(f"/ai/organization-recommendation?organization_id={ORG_B}&period=week", headers=h_sa); p_ob = prompts[-1] if prompts else ""
rec("RAG-56", G, "Organisation recommendation: org history reaches the prompt, only org-level documents (no employee documents)", "org marker, type organization_daily_summary only",
    f"{r.status_code}, marker={MARK_ORG in p_oa}, types={set(re.findall(r'Document Type: (\w+)', p_oa))}", r.status_code == 200 and MARK_ORG in p_oa
    and set(re.findall(r"Document Type: (\w+)", p_oa)) == {"organization_daily_summary"} and MARK not in p_oa)
rec("RAG-57", G, "Organisation isolation: Alpha's history never appears in Beta's organisation prompt", "no Alpha markers in Beta prompt, Beta's present",
    f"alpha_org={MARK_ORG in p_ob}, alpha_user={MARK in p_ob}, beta={'beta-org-site.example' in p_ob}", MARK_ORG not in p_ob and MARK not in p_ob and "beta-org-site.example" in p_ob)

# what the user sees when no LLM provider works (today's situation)
def boom(prompt, *a, **k):
    raise Exception("All LLM providers failed.")
llm_service.ask_llm = boom
try:
    r_rec = client.get("/ai/recommendation?period=week", headers=h_a)
except Exception as e:
    r_rec = type("R", (), {"status_code": 500, "text": repr(e)})()
r_chat = client.post("/ai/chat", headers=h_a, json={"message": "hello"})
try:
    r_org = client.get(f"/ai/organization-recommendation?organization_id={ORG_A}&period=week", headers=h_sa)
except Exception as e:
    r_org = type("R", (), {"status_code": 500, "text": repr(e)})()
rec("RAG-58", G, "When every LLM provider fails, the endpoints answer with a clean error (like chat does), not a crash", "chat 503 and recommendation/org 503",
    f"chat {r_chat.status_code}, recommendation {r_rec.status_code}, organisation {r_org.status_code}", r_chat.status_code == 503 and r_rec.status_code == 503 and r_org.status_code == 503,
    "Only the chat endpoint catches the failure. /ai/recommendation and /ai/organization-recommendation raise an unhandled exception (HTTP 500), so the UI shows a generic server error instead of 'AI temporarily unavailable'")
llm_service.ask_llm = real_ask
db2.close()

# ======================================================================================
# cleanup
# ======================================================================================
db.query(RAGDocument).filter(RAGDocument.user_id.in_(DEMO_USERS + [tmp.id])).delete(synchronize_session=False)
db.query(RAGDocument).filter(RAGDocument.organization_id.in_([ORG_A, ORG_B])).delete(synchronize_session=False)
db.delete(tmp)
db.commit()
db.close()

summary = {"total": len(results), "passed": sum(r["status"] == "PASS" for r in results), "failed": sum(r["status"] == "FAIL" for r in results),
           "notes": sum(r["status"] == "NOTE" for r in results), "blocked": sum(r["status"] == "BLOCKED" for r in results), "results": results}
(ROOT / "qa" / "rag_results.json").write_text(json.dumps(summary, indent=2))
print(f"\n{summary['passed']}/{summary['total']} passed, {summary['failed']} failed, {summary['notes']} notes, {summary['blocked']} blocked")
