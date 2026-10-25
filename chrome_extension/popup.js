
import { API_BASE_URL } from "./config.js";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginButton.disabled = true;
  loginButton.textContent = "Signing in...";
  showMessage("", "");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.detail || `Login failed (${response.status}).`
      );
    }

    if (!data.access_token || !data.refresh_token) {
      throw new Error("The server did not return both login tokens.");
    }

    // Store tokens using the same keys as storage.js.
    await chrome.storage.local.set({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    // Ask the background worker to start tracking the active tab.
    const result = await chrome.runtime.sendMessage({
      type: "FOCUSGUARD_START_TRACKING",
    });

    if (!result?.ok) {
      showMessage(
        "Login succeeded, but tracking could not start: " +
          (result?.error || "no answer from the extension.") +
          " (Details: the extension's service worker console.)",
        "error"
      );
      return;
    }

    // Signed in, but the current tab is not a website (new-tab page,
    // chrome:// page ...). Tracking starts with the first website opened.
    if (!result.tracking) {
      showMessage(
        "Login successful. FocusGuard will start tracking as soon as you open a website.",
        "success"
      );
      return;
    }

    showMessage("Login successful. FocusGuard is now tracking.", "success");

    // Close only after successful authentication and tracking initialization.
    window.close();
  } catch (error) {
    console.error("FocusGuard login error:", error);

    showMessage(
      error instanceof Error
        ? error.message
        : "Unable to log in. Please try again.",
      "error"
    );
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }
});
