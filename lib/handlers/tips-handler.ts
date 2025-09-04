const TIPS_STORAGE_KEY = "aequitally_tips_preferences";

export type TipsPreferences = {
	showCreateTallyTips: boolean;
};

export const defaultTipsPreferences: TipsPreferences = {
	showCreateTallyTips: true,
};

export const loadTipsPreferences = (): TipsPreferences => {
	try {
		if (typeof window === "undefined") return defaultTipsPreferences;

		const raw = localStorage.getItem(TIPS_STORAGE_KEY);
		if (!raw) return defaultTipsPreferences;

		const parsed = JSON.parse(raw);
		return {
			showCreateTallyTips:
				parsed.showCreateTallyTips ??
				defaultTipsPreferences.showCreateTallyTips,
		};
	} catch (error) {
		console.error("Failed to load tips preferences:", error);
		return defaultTipsPreferences;
	}
};

export const saveTipsPreferences = (preferences: TipsPreferences): void => {
	try {
		if (typeof window === "undefined") return;

		localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(preferences));
	} catch (error) {
		console.error("Failed to save tips preferences:", error);
	}
};

export const clearTipsPreferences = (): void => {
	try {
		if (typeof window === "undefined") return;

		localStorage.removeItem(TIPS_STORAGE_KEY);
	} catch (error) {
		console.error("Failed to clear tips preferences:", error);
	}
};
