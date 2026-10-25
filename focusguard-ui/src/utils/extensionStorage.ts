const isChromeExtension =
  typeof chrome !== "undefined" &&
  !!chrome.storage?.local;


// ===========================================
// Get Storage Item
// ===========================================

export async function getStorageItem(
  key: string
): Promise<string | null> {
  if (!isChromeExtension) {
    return localStorage.getItem(key);
  }

  const data =
    await chrome.storage.local.get(key);

  const value = data[key];

  return typeof value === "string"
    ? value
    : null;
}


// ===========================================
// Set Storage Item
// ===========================================

export async function setStorageItem(
  key: string,
  value: string
): Promise<void> {
  if (!isChromeExtension) {
    localStorage.setItem(key, value);
    return;
  }

  await chrome.storage.local.set({
    [key]: value,
  });
}


// ===========================================
// Remove Storage Item
// ===========================================

export async function removeStorageItem(
  key: string
): Promise<void> {
  if (!isChromeExtension) {
    localStorage.removeItem(key);
    return;
  }

  await chrome.storage.local.remove(key);
}


// ===========================================
// Clear Application Storage
// ===========================================

export async function clearAppStorage(): Promise<void> {
  if (!isChromeExtension) {
    localStorage.clear();
    return;
  }

  await chrome.storage.local.clear();
}