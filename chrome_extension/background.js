
import {
  startActivity,
  endActivity,
  saveTabSwitch,
  updateUserStatus,
  getLatestNotification,
  markNotificationRead,
  checkPlannerFocus,
} from "./api.js";

import {
  getAccessToken,
  getActivityId,
  saveActivityId,
  getTrackingState,
  saveTrackingState,
} from "./storage.js";

// ----------------------------------------------------
// State
//
// What is being tracked (tab id, url, website) lives in
// chrome.storage, see storage.js. A Manifest V3 service
// worker is stopped by Chrome after ~30 s of inactivity,
// so plain variables are lost and the next tab switch
// would not be recorded.
// ----------------------------------------------------

let currentStatus = "ACTIVE";

const STATUS_ALARM = "focusguard-status-heartbeat";
const NOTIFICATION_ALARM = "focusguard-notifications";
const PLANNER_ALARM = "focusguard-planner-focus";

// ----------------------------------------------------
// Ignore Internal Browser Pages
// ----------------------------------------------------

function isValidUrl(url) {
  if (!url) return false;

  return (
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
}

// ----------------------------------------------------
// Website name used for tab-switch records
//
// "github.com", not the page title: titles change while
// a page loads ("(3) Inbox", video names ...), which used
// to create switches that never happened.
// ----------------------------------------------------

function websiteName(url, fallback) {
  let name = fallback;

  try {
    name = new URL(url).hostname.replace(/^www\./, "") || fallback;
  } catch {
    // keep the fallback
  }

  // The API accepts at most 255 characters per website name.
  return String(name).slice(0, 255);
}

// ----------------------------------------------------
// Run tracking work one event at a time
//
// onActivated, onUpdated and window-focus events often
// fire together for the same tab change; handling them
// in parallel started duplicate activities and lost or
// duplicated tab-switch records.
// ----------------------------------------------------

let queue = Promise.resolve();

function enqueue(task) {
  const run = queue.then(task, task);

  queue = run.catch(() => {});

  return run;
}

// ----------------------------------------------------
// Stop timing the current activity
// ----------------------------------------------------

async function endCurrentActivity() {
  const activityId = await getActivityId();

  if (activityId) {
    await endActivity(activityId);
    await saveActivityId(null);
  }
}

// ----------------------------------------------------
// Start Tracking New Activity
// ----------------------------------------------------

function trackNewActivity(tab) {
  return enqueue(() => trackTab(tab));
}

async function trackTab(tab) {
  const token = await getAccessToken();

  if (!token) {
    console.log("No access token. Tracking not started.");
    return { ok: false, tracking: false, reason: "not_logged_in", error: "Please sign in first." };
  }

  const state = await getTrackingState();

  // Browser pages (chrome://, new tab, ...) are not tracked:
  // stop the timer so that time is not credited to the
  // previous website, and remember that no tab is active.
  if (!tab?.id || !isValidUrl(tab.url)) {
    console.log("Ignored tab:", tab?.url);

    if (state?.tabId !== null && state?.tabId !== undefined) {
      await endCurrentActivity();

      await saveTrackingState({
        tabId: null,
        url: null,
        website: state.website,
      });
    }

    return { ok: true, tracking: false, reason: "internal_page" };
  }

  // Avoid restarting the same activity unnecessarily.
  if (
    state?.tabId === tab.id &&
    state?.url === tab.url &&
    (await getActivityId())
  ) {
    return { ok: true, tracking: true, reason: "already_tracking" };
  }

  const website = websiteName(
    tab.url,
    tab.title || tab.url
  );

  // End the previous activity before starting another.
  await endCurrentActivity();

  // A tab switch is a change of tab, or of website inside
  // the same tab. Moving between pages of one site in one
  // tab is not a switch.
  const changedTab =
    state?.tabId !== null &&
    state?.tabId !== undefined &&
    state.tabId !== tab.id;

  const changedWebsite =
    !!state?.website &&
    state.website !== website;

  if (state?.website && (changedTab || changedWebsite)) {
    await saveTabSwitch(state.website, website);
  }

  // Remember the tab before the network call, so that a
  // retry after a failed start does not log the switch twice.
  await saveTrackingState({
    tabId: tab.id,
    url: null,
    website,
  });

  const response = await startActivity({
    url: tab.url,
    tab_title: tab.title || tab.url,
    application: "Chrome",
  });

  if (!response?.activity_id) {
    console.error(
      "Activity was not started:",
      response?.error
    );

    return {
      ok: false,
      tracking: false,
      reason: "start_failed",
      error:
        response?.error ||
        "The server did not accept the activity.",
    };
  }

  await saveActivityId(response.activity_id);

  await saveTrackingState({
    tabId: tab.id,
    url: tab.url,
    website,
  });

  console.log("Tracking started:", tab.url);
  console.log("Activity ID:", response.activity_id);

  return { ok: true, tracking: true, reason: "tracking" };
}

// ----------------------------------------------------
// Start Tracking the Currently Active Tab
// ----------------------------------------------------

async function trackActiveTab(windowId) {
  try {
    const token = await getAccessToken();

    if (!token) {
      console.log("No access token; waiting for login.");
      return { ok: false, tracking: false, reason: "not_logged_in", error: "Please sign in first." };
    }

    const tabs = await chrome.tabs.query(
      windowId === undefined
        ? { active: true, lastFocusedWindow: true }
        : { active: true, windowId }
    );

    const activeTab = tabs[0];

    if (!activeTab) {
      console.log("No active tab found.");
      return { ok: true, tracking: false, reason: "no_tab" };
    }

    return await trackNewActivity(activeTab);
  } catch (error) {
    console.error(
      "Could not track the active tab:",
      error
    );

    return {
      ok: false,
      tracking: false,
      reason: "error",
      error: error.message || "Tracking failed.",
    };
  }
}

// ----------------------------------------------------
// Login Success Message from popup.js
// ----------------------------------------------------

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (
      message?.type !== "FOCUSGUARD_START_TRACKING"
    ) {
      return;
    }

    // Having no website tab open right now (new-tab page, chrome:// page,
    // no window) is not a failure: the user is signed in and tracking
    // starts with the first website they open.
    trackActiveTab()
      .then((result) => {
        sendResponse({
          ok: result.ok,
          tracking: result.tracking,
          reason: result.reason,
          error: result.ok
            ? null
            : result.error || "Tracking could not start.",
        });
      })
      .catch((error) => {
        console.error(
          "Login tracking initialization failed:",
          error
        );

        sendResponse({
          ok: false,
          tracking: false,
          reason: "error",
          error: error.message || "Tracking initialization failed.",
        });
      });

    // Keep the message channel open for the async response.
    return true;
  }
);

// ----------------------------------------------------
// Tab Activated
// ----------------------------------------------------

chrome.tabs.onActivated.addListener(
  async (activeInfo) => {
    try {
      const tab = await chrome.tabs.get(
        activeInfo.tabId
      );

      await trackNewActivity(tab);
    } catch (error) {
      console.error(
        "Tab activation tracking error:",
        error
      );
    }
  }
);

// ----------------------------------------------------
// URL Changed in the Current Tab
// ----------------------------------------------------

chrome.tabs.onUpdated.addListener(
  async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete") {
      return;
    }

    if (!tab.active) {
      return;
    }

    try {
      // trackTab ignores a tab/url it is already tracking.
      await trackNewActivity(tab);
    } catch (error) {
      console.error(
        "Tab update tracking error:",
        error
      );
    }
  }
);

// ----------------------------------------------------
// Switching Between Chrome Windows
// ----------------------------------------------------

chrome.windows.onFocusChanged.addListener(
  async (windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      return;
    }

    await trackActiveTab(windowId);
  }
);

// ----------------------------------------------------
// Tab Closed
// ----------------------------------------------------

chrome.tabs.onRemoved.addListener(
  (tabId) =>
    enqueue(async () => {
      try {
        const state = await getTrackingState();

        if (state?.tabId !== tabId) {
          return;
        }

        const token = await getAccessToken();

        if (token) {
          await endCurrentActivity();
        }

        // Keep the website so the next tab counts as a switch.
        await saveTrackingState({
          tabId: null,
          url: null,
          website: state.website,
        });
      } catch (error) {
        console.error(
          "Tab close tracking error:",
          error
        );
      }
    })
);

// ----------------------------------------------------
// Idle Detection
// ----------------------------------------------------

chrome.idle.setDetectionInterval(60);

chrome.idle.onStateChanged.addListener(
  async (state) => {
    try {
      const token = await getAccessToken();

      if (!token) return;

      const newStatus =
        state === "active" ? "ACTIVE" : "IDLE";

      if (currentStatus === newStatus) {
        return;
      }

      currentStatus = newStatus;

      await updateUserStatus(currentStatus);

      console.log("User status:", currentStatus);
    } catch (error) {
      console.error(
        "Idle status update failed:",
        error
      );
    }
  }
);

// ----------------------------------------------------
// Status Heartbeat
// ----------------------------------------------------

async function sendStatusHeartbeat() {
  try {
    const token = await getAccessToken();

    if (!token) return;

    await updateUserStatus(currentStatus);

    console.log(
      "Status heartbeat:",
      currentStatus
    );
  } catch (error) {
    console.error(
      "Status heartbeat error:",
      error
    );
  }
}

// ----------------------------------------------------
// Browser Notifications
// ----------------------------------------------------

async function checkNotifications() {
  try {
    const token = await getAccessToken();

    if (!token) return;

    const notification = await getLatestNotification();

    if (!notification?.id) return;

    await chrome.notifications.create(
      `focusguard-${notification.id}`,
      {
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon.png"),
        title: notification.title || "FocusGuard AI",
        message: notification.message || "You have a new notification.",
        requireInteraction: true,
        priority: 2,
      }
    );

    await markNotificationRead(notification.id);
  } catch (error) {
    console.error(
      "Notification check failed:",
      error
    );
  }
}

// ----------------------------------------------------
// Planner Focus Check
// ----------------------------------------------------

async function checkFocus() {
  try {
    const token = await getAccessToken();

    if (!token) return;

    const data = await checkPlannerFocus();

    if (data) {
      console.log("Planner focus:", data.status, data);
    }
  } catch (error) {
    console.error(
      "Planner focus check failed:",
      error
    );
  }
}

// ----------------------------------------------------
// Chrome Alarms
// ----------------------------------------------------

function configureAlarms() {
  chrome.alarms.create(STATUS_ALARM, {
    periodInMinutes: 5,
  });

  chrome.alarms.create(NOTIFICATION_ALARM, {
    periodInMinutes: 0.5,
  });

  chrome.alarms.create(PLANNER_ALARM, {
    periodInMinutes: 1,
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === STATUS_ALARM) {
    sendStatusHeartbeat();
  } else if (alarm.name === NOTIFICATION_ALARM) {
    checkNotifications();
  } else if (alarm.name === PLANNER_ALARM) {
    checkFocus();
  }
});

// ----------------------------------------------------
// Extension Lifecycle
// ----------------------------------------------------

chrome.runtime.onInstalled.addListener(() => {
  configureAlarms();
  trackActiveTab();
});

chrome.runtime.onStartup.addListener(() => {
  configureAlarms();
  trackActiveTab();
});

// Restore alarms and tracking when the service worker starts.
configureAlarms();
trackActiveTab();
checkNotifications();
checkFocus();
