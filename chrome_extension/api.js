
import { API_BASE_URL } from "./config.js";

import {
    getAccessToken,
    getRefreshToken,
    saveAccessToken,
    clearStorage
} from "./storage.js";

// Parse JSON safely, including Cloudflare HTML error pages.
async function parseResponse(response) {
    const text = await response.text();

    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = null;
        }
    }

    if (!response.ok) {
        const detail =
            data?.detail ||
            data?.message ||
            (text && !data
                ? `Server returned a non-JSON response (${response.status}).`
                : `HTTP ${response.status}`);

        const error = new Error(
            `${response.status}: ${detail}`
        );

        error.status = response.status;
        throw error;
    }

    if (text && data === null) {
        throw new Error("Server returned invalid JSON.");
    }

    return data;
}

// Refresh access token.
async function refreshAccessToken() {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
        throw new Error("NOT_LOGGED_IN");
    }

    const response = await fetch(
        `${API_BASE_URL}/auth/refresh-token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh_token: refreshToken
            })
        }
    );

    const data = await parseResponse(response);

    if (!data?.access_token) {
        throw new Error("Refresh response has no access token.");
    }

    await saveAccessToken(data.access_token);

    console.log("Access token refreshed.");

    return data.access_token;
}

// Authenticated request with one refresh attempt after 401.
async function authenticatedFetch(url, options = {}) {
    let token = await getAccessToken();

    if (!token) {
        throw new Error("NOT_LOGGED_IN");
    }

    const makeRequest = (accessToken) =>
        fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`
            }
        });

    let response = await makeRequest(token);

    if (response.status === 401) {
        try {
            token = await refreshAccessToken();
        } catch (error) {
            await clearStorage();
            throw error;
        }

        response = await makeRequest(token);
    }

    return response;
}

// Shared request helper.
async function apiRequest(url, options = {}) {
    const response = await authenticatedFetch(url, options);
    return parseResponse(response);
}

// Short, readable reason shown in the popup when tracking cannot start.
function describeError(error) {
    if (error?.message === "NOT_LOGGED_IN") {
        return "Please sign in first.";
    }

    if (error instanceof TypeError) {
        return `Cannot reach the server at ${API_BASE_URL}. Is the backend running?`;
    }

    return error?.message || "Unknown error.";
}

export async function startActivity(activity) {
    try {
        return await apiRequest(`${API_BASE_URL}/activity/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(activity)
        });
    } catch (error) {
        console.error("startActivity failed:", error);
        return { error: describeError(error) };
    }
}

export async function endActivity(activityId) {
    try {
        return await apiRequest(
            `${API_BASE_URL}/activity/end/${activityId}`,
            { method: "PUT" }
        );
    } catch (error) {
        console.error("endActivity failed:", error);
        return null;
    }
}

export async function saveTabSwitch(fromWebsite, toWebsite) {
    try {
        return await apiRequest(`${API_BASE_URL}/activity/tab-switch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                from_website: fromWebsite,
                to_website: toWebsite
            })
        });
    } catch (error) {
        console.error("saveTabSwitch failed:", error);
        return null;
    }
}

export async function updateUserStatus(status) {
    try {
        return await apiRequest(`${API_BASE_URL}/activity/status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });
    } catch (error) {
        console.error("updateUserStatus failed:", error);
        return null;
    }
}

export async function getLatestNotification() {
    try {
        return await apiRequest(
            `${API_BASE_URL}/notifications/latest`,
            { method: "GET" }
        );
    } catch (error) {
        console.error("getLatestNotification failed:", error);
        return null;
    }
}

export async function markNotificationRead(notificationId) {
    try {
        return await apiRequest(
            `${API_BASE_URL}/notifications/${notificationId}/read`,
            { method: "PATCH" }
        );
    } catch (error) {
        console.error("markNotificationRead failed:", error);
        return null;
    }
}

export async function checkPlannerFocus() {
    try {
        return await apiRequest(
            `${API_BASE_URL}/planner/check-focus`,
            { method: "POST" }
        );
    } catch (error) {
        console.error("checkPlannerFocus failed:", error);
        return null;
    }
}
