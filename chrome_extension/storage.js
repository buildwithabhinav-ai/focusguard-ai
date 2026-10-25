// -------------------------------------------
// Activity ID
// -------------------------------------------

export async function saveActivityId(activityId) {
    await chrome.storage.local.set({
        activityId
    });
}

export async function getActivityId() {
    const data = await chrome.storage.local.get(
        "activityId"
    );

    return data.activityId;
}


// -------------------------------------------
// Tracking State
//
// {tabId, url, website} of the tab being tracked.
// Kept in storage (not in memory) because Chrome
// stops the extension's service worker after about
// 30 seconds of inactivity, which wipes variables.
// -------------------------------------------

export async function saveTrackingState(state) {
    await chrome.storage.local.set({
        trackingState: state
    });
}

export async function getTrackingState() {
    const data = await chrome.storage.local.get(
        "trackingState"
    );

    return data.trackingState || null;
}


// -------------------------------------------
// Access Token
// -------------------------------------------

export async function saveAccessToken(token) {
    await chrome.storage.local.set({
        access_token: token
    });
}

export async function getAccessToken() {
    const data = await chrome.storage.local.get(
        "access_token"
    );

    return data.access_token;
}


// -------------------------------------------
// Refresh Token
// -------------------------------------------

export async function saveRefreshToken(token) {
    await chrome.storage.local.set({
        refresh_token: token
    });
}

export async function getRefreshToken() {
    const data = await chrome.storage.local.get(
        "refresh_token"
    );

    return data.refresh_token;
}


// -------------------------------------------
// Clear All Stored Data
// -------------------------------------------

export async function clearStorage() {
    await chrome.storage.local.clear();
}