// What the extension answers to the popup right after login (FOCUSGUARD_START_TRACKING).
// Usage: node qa/extension_popup_test.mjs <access_token> <refresh_token>
import { pathToFileURL } from "node:url";
import path from "node:path";
import { writeFileSync } from "node:fs";

const [, , accessToken, refreshToken] = process.argv;
const root = path.resolve(new URL("..", import.meta.url).pathname, "chrome_extension");
const store = {};
let tabs = [];
let handler;

globalThis.chrome = {
  storage: { local: {
    get: async (k) => (typeof k === "string" ? { [k]: store[k] } : { ...store }),
    set: async (o) => { Object.assign(store, JSON.parse(JSON.stringify(o))); },
    clear: async () => { for (const k of Object.keys(store)) delete store[k]; },
  } },
  tabs: { query: async () => tabs, get: async () => tabs[0], onActivated: { addListener() {} }, onUpdated: { addListener() {} }, onRemoved: { addListener() {} } },
  windows: { WINDOW_ID_NONE: -1, onFocusChanged: { addListener() {} } },
  idle: { setDetectionInterval() {}, onStateChanged: { addListener() {} } },
  alarms: { create() {}, onAlarm: { addListener() {} } },
  notifications: { create: async () => {} },
  runtime: { onMessage: { addListener: (fn) => { handler = fn; } }, onInstalled: { addListener() {} }, onStartup: { addListener() {} }, getURL: (p) => p },
};
await import(pathToFileURL(path.join(root, "background.js")).href);

const ask = () => new Promise((resolve) => handler({ type: "FOCUSGUARD_START_TRACKING" }, {}, resolve));
const realFetch = globalThis.fetch;
const report = [];
let failures = 0;
async function check(title, setup, expect) {
  store.access_token = accessToken; store.refresh_token = refreshToken; delete store.trackingState; delete store.activityId;
  globalThis.fetch = realFetch;
  setup();
  const r = await ask();
  const ok = expect(r);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${title}  ->  ${JSON.stringify(r)}`);
  report.push({ id: `POPUP-${String(report.length + 1).padStart(2, "0")}`, title, expected: "see test", actual: JSON.stringify(r), status: ok ? "PASS" : "FAIL", note: "", shot: null });
}

await check("Signed in on the New Tab page: success, tracking waits for a website",
  () => { tabs = [{ id: 1, url: "chrome://newtab/", title: "New Tab", active: true }]; },
  (r) => r.ok === true && r.tracking === false && r.reason === "internal_page" && r.error === null);
await check("Signed in on a chrome:// page: success, tracking waits for a website",
  () => { tabs = [{ id: 1, url: "chrome://extensions/", title: "Extensions", active: true }]; },
  (r) => r.ok === true && r.tracking === false);
await check("No tab found at all: success, tracking waits for a website",
  () => { tabs = []; },
  (r) => r.ok === true && r.tracking === false && r.reason === "no_tab");
await check("Signed in on a normal website: tracking starts",
  () => { tabs = [{ id: 2, url: "https://github.com/x", title: "GitHub", active: true }]; },
  (r) => r.ok === true && r.tracking === true);
await check("Backend not running: clear message naming the address",
  () => { tabs = [{ id: 2, url: "https://github.com/x", title: "GitHub", active: true }]; globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); }; },
  (r) => r.ok === false && /Cannot reach the server at http:\/\/127\.0\.0\.1:8000/.test(r.error));
await check("Rejected token: error shows the server's reason",
  () => { tabs = [{ id: 2, url: "https://github.com/x", title: "GitHub", active: true }]; store.access_token = "bad"; store.refresh_token = "bad"; },
  (r) => r.ok === false && /40[0-9]/.test(r.error));
await check("Not signed in: asks to sign in",
  () => { tabs = [{ id: 2, url: "https://github.com/x", title: "GitHub", active: true }]; delete store.access_token; },
  (r) => r.ok === false && /sign in/i.test(r.error));

writeFileSync(new URL("./extension_popup_results.json", import.meta.url), JSON.stringify({ total: report.length, passed: report.length - failures, results: report }, null, 2));
console.log(failures ? `\n${failures} FAILED` : "\nall popup checks passed");
process.exit(failures ? 1 : 0);
