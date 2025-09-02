import { defaultCookiePreferences } from "../data/cookie-pref";

const STORAGE_KEY = "cookiePreferences";

type CookiePreferences = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

export const loadCookiePreferences = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCookiePreferences;

    const parsed = JSON.parse(raw);
    return {
      essential: parsed.essential ?? defaultCookiePreferences.essential,
      analytics: parsed.analytics ?? defaultCookiePreferences.analytics,
      marketing: parsed.marketing ?? defaultCookiePreferences.marketing,
      preferences: parsed.preferences ?? defaultCookiePreferences.preferences
    } as CookiePreferences;
  } catch (error) {
    console.error("Failed to load cookie preferences:", error);
    return defaultCookiePreferences;
  }
};

export const saveCookiePreferences = (preferences: CookiePreferences) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save cookie preferences:", error);
  }
};

export const clearCookiePreferences = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear cookie preferences:", error);
  }
};
