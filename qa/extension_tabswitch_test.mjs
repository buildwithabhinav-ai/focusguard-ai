// Drives chrome_extension/background.js with a fake `chrome` object against the real local backend.
// Usage: node qa/extension_tabswitch_test.mjs <access_token> <refresh_token>
import { pathToFileURL } from "node:url";
import path from "node:path";
import { writeFileSync } from "node:fs";

const [, , accessToken, refreshToken] = process.argv;
const root = path.resolve(new URL("..", import.meta.url).pathname, "chrome_extension");

const store = { access_token: accessToken, refresh_token: refreshToken }; // survives "worker restarts"
let listeners;
let tabsById;
let activeTabId;

function resetListeners() {
  listeners = { activated: [], updated: [], removed: [], focus: [], message: [], alarm: [], idle: [], installed: [], startup: [] };
}
const ev = (name) => ({ addListener: (fn) => listeners[name].push(fn) });

globalThis.chrome = {
  storage: { local: {
    get: async (key) => (typeof key === "string" ? { [key]: store[key] } : { ...store }),
    set: async (obj) => { Object.assign(store, JSON.parse(JSON.stringify(obj))); },
    clear: async () => { for (const k of Object.keys(store)) delete store[k]; },
    remove: async (k) => { delete store[k]; },
  } },
  tabs: {
    query: async () => (tabsById[activeTabId] ? [tabsById[activeTabId]] : []),
    get: async (id) => tabsById[id],
    onActivated: ev("activated"), onUpdated: ev("updated"), onRemoved: ev("removed"),
  },
  windows: { WINDOW_ID_NONE: -1, onFocusChanged: ev("focus") },
  idle: { setDetectionInterval() {}, onStateChanged: ev("idle") },
  alarms: { create() {}, onAlarm: ev("alarm") },
  notifications: { create: async () => {} },
  runtime: { onMessage: ev("message"), onInstalled: ev("installed"), onStartup: ev("startup"), getURL: (p) => p },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const API = "http://127.0.0.1:8000";
const H = { Authorization: `Bearer ${accessToken}` };
const switches = async () => (await (await fetch(`${API}/analytics/tab-switches`, { headers: H })).json());

async function startWorker(version) {          // = Chrome (re)starting the service worker
  resetListeners();
  await import(pathToFileURL(path.join(root, "background.js")).href + `?v=${version}`);
  await sleep(1500);
}
const fire = async (name, ...args) => { await Promise.all(listeners[name].map((fn) => fn(...args))); await sleep(700); };
const tab = (id, url, title = "t") => (tabsById[id] = { id, url, title, active: true });

let failures = 0;
const report = [];
async function expectTotal(label, expected) {
  const got = (await switches()).total_switches;
  const ok = got === expected;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: expected ${expected} switches, got ${got}`);
  report.push({ id: `EXT-${String(report.length + 1).padStart(2, "0")}`, title: label, expected: `${expected} switches`, actual: `${got} switches`, status: ok ? "PASS" : "FAIL", note: "", shot: null });
}

tabsById = {};
tab(1, "https://github.com/a", "GitHub");
activeTabId = 1;
await startWorker(1);
await expectTotal("worker starts on github.com (first tracked tab is not a switch)", 0);

tab(2, "https://stackoverflow.com/q/1", "SO");
activeTabId = 2;
await fire("activated", { tabId: 2 });
await expectTotal("github -> stackoverflow", 1);

// Chrome stops the idle service worker; next event starts a fresh one with empty memory
// (the user has already switched tabs when Chrome wakes the worker for the event)
tab(3, "https://www.youtube.com/watch?v=1", "(1) Video");
activeTabId = 3;
await startWorker(2);
await fire("activated", { tabId: 3 });
await expectTotal("stackoverflow -> youtube AFTER worker restart (was lost before the fix)", 2);

// onActivated and onUpdated fire together for one real switch
tab(4, "https://gmail.com/", "Inbox");
activeTabId = 4;
await Promise.all([fire("activated", { tabId: 4 }), fire("updated", 4, { status: "complete" }, tabsById[4])]);
await expectTotal("youtube -> gmail with activated+updated firing together counts once", 3);

// page title changes while loading, same tab, same url: not a switch
tabsById[4].title = "(5) Inbox - Gmail";
await fire("updated", 4, { status: "complete" }, tabsById[4]);
await expectTotal("title change on the same page is not a switch", 3);

// navigation inside the same site and tab: not a switch
tabsById[4].url = "https://gmail.com/mail/u/0/#sent";
await fire("updated", 4, { status: "complete" }, tabsById[4]);
await expectTotal("moving between pages of one site in one tab is not a switch", 3);

// navigating the same tab to another site is a switch
tabsById[4].url = "https://docs.python.org/3/";
await fire("updated", 4, { status: "complete" }, tabsById[4]);
await expectTotal("same tab navigates to another website", 4);

// two tabs of the same site
tab(5, "https://docs.python.org/3/library/", "Docs 2");
activeTabId = 5;
await fire("activated", { tabId: 5 });
await expectTotal("switching between two tabs of the same site counts", 5);

// internal browser page does not count; returning to the same tab after it does not invent a switch
tab(6, "chrome://newtab/", "New Tab");
activeTabId = 6;
await fire("activated", { tabId: 6 });
await expectTotal("opening chrome://newtab is ignored", 5);
activeTabId = 5;
await fire("activated", { tabId: 5 });
await expectTotal("coming back from chrome://newtab to the same site adds no fake switch", 5);

// focus another window
tab(7, "https://github.com/b", "GitHub 2");
activeTabId = 7;
await fire("focus", 99);
await expectTotal("focusing another Chrome window with another site counts", 6);

// closing the tracked tab, then landing on another site
await fire("removed", 7);
tab(8, "https://kaggle.com/", "Kaggle");
activeTabId = 8;
await fire("activated", { tabId: 8 });
await expectTotal("close tab, land on another site counts", 7);

const recent = (await switches()).recent_switches.slice(0, 3).map((s) => `${s.from} -> ${s.to}`);
console.log("latest:", recent.join(" | "));
writeFileSync(new URL("./extension_results.json", import.meta.url), JSON.stringify({ total: report.length, passed: report.length - failures, results: report }, null, 2));
console.log(failures ? `\n${failures} FAILED` : "\nall extension checks passed");
process.exit(failures ? 1 : 0);
