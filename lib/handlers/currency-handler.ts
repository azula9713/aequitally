const STORAGE_KEY = "aequitally_currency_preference";

export interface CurrencyPreferences {
	currencyCode: string;
}

export const defaultCurrencyPreferences: CurrencyPreferences = {
	currencyCode: "USD",
};

export const loadCurrencyPreferences = (): CurrencyPreferences => {
	try {
		if (typeof window === "undefined") return defaultCurrencyPreferences;

		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return defaultCurrencyPreferences;

		const parsed = JSON.parse(raw);
		return {
			currencyCode:
				parsed.currencyCode ?? defaultCurrencyPreferences.currencyCode,
		};
	} catch (error) {
		console.error("Failed to load currency preferences:", error);
		return defaultCurrencyPreferences;
	}
};

export const saveCurrencyPreferences = (
	preferences: CurrencyPreferences,
): void => {
	try {
		if (typeof window === "undefined") return;

		localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
	} catch (error) {
		console.error("Failed to save currency preferences:", error);
	}
};

export const clearCurrencyPreferences = (): void => {
	try {
		if (typeof window === "undefined") return;

		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error("Failed to clear currency preferences:", error);
	}
};

export const createCurrencyFormatter = (
	currencyCode: string,
): Intl.NumberFormat => {
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: currencyCode,
	});
};

export const getDecimalPlaces = (currencyCode: string): number => {
	try {
		const formatter = new Intl.NumberFormat(undefined, {
			style: "currency",
			currency: currencyCode,
		});

		// Use formatToParts to determine the number of decimal places
		const parts = formatter.formatToParts(1);
		const fractionPart = parts.find((part) => part.type === "fraction");

		return fractionPart?.value.length ?? 0;
	} catch (_error) {
		// Fallback to 2 decimal places for invalid currency codes
		console.warn(
			`Invalid currency code: ${currencyCode}, using 2 decimal places`,
		);
		return 2;
	}
};
