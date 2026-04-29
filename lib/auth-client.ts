// Client-side auth utilities (localStorage session persistence)
// This file does NOT import from 'next/headers' to avoid SSR issues

export function saveSessionToStorage(user: any, remember: boolean): void {
  if (typeof window === "undefined") return; // SSR guard
  try {
    const sessionData = {
      user,
      timestamp: Date.now(),
    };
    localStorage.setItem("bagdarai_user", JSON.stringify(sessionData));
    if (remember) {
      localStorage.setItem("bagdarai_remember", "true");
    }
  } catch (e) {
    console.error("Failed to save session to storage:", e);
  }
}

export function getSessionFromStorage(): { user: any; timestamp: number } | null {
  if (typeof window === "undefined") return null; // SSR guard
  try {
    const data = localStorage.getItem("bagdarai_user");
    if (!data) return null;

    const sessionData = JSON.parse(data);
    const { user, timestamp } = sessionData;

    // Check if session is expired
    const remember = localStorage.getItem("bagdarai_remember") === "true";
    const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 24 hours

    if (Date.now() - timestamp > maxAge) {
      clearSessionStorage();
      return null;
    }

    return { user, timestamp };
  } catch (e) {
    console.error("Failed to get session from storage:", e);
    return null;
  }
}

export function clearSessionStorage(): void {
  if (typeof window === "undefined") return; // SSR guard
  try {
    localStorage.removeItem("bagdarai_user");
    localStorage.removeItem("bagdarai_remember");
  } catch (e) {
    console.error("Failed to clear session storage:", e);
  }
}
