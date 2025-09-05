"use client";

import { getAllCurrencies } from "global-currency-list";
import type { Currency } from "global-currency-list/dist/types";
import {
	createContext,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

import {
	type CurrencyPreferences,
	createCurrencyFormatter,
	defaultCurrencyPreferences,
	getDecimalPlaces,
	loadCurrencyPreferences,
	saveCurrencyPreferences,
} from "@/lib/handlers/currency-handler";

interface CurrencyContextValue {
	currencyCode: string;
	currencyFormatter: Intl.NumberFormat;
	availableCurrencies: Currency[];
	maximumFractionDigits: number;
	updateCurrency: (currencyCode: string) => void;
	formatCurrency: (amount: number) => string;
}

export const CurrencyContext = createContext<CurrencyContextValue | null>(null);

interface CurrencyProviderProps {
	children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
	const [currencyCode, setCurrencyCode] = useState(
		defaultCurrencyPreferences.currencyCode,
	);

	useEffect(() => {
		const preferences = loadCurrencyPreferences();
		setCurrencyCode(preferences.currencyCode);
	}, []);

	// Deduplicated currencies (remove duplicates based on currency code)
	const availableCurrencies = useMemo(() => {
		const seenCodes = new Set<string>();
		return getAllCurrencies().filter((c) => {
			if (seenCodes.has(c.code)) {
				return false;
			}
			seenCodes.add(c.code);
			return true;
		});
	}, []);

	const currencyFormatter = useMemo(() => {
		return createCurrencyFormatter(currencyCode);
	}, [currencyCode]);

	const maximumFractionDigits = useMemo(() => {
		return getDecimalPlaces(currencyCode);
	}, [currencyCode]);

	const formatCurrency = useCallback(
		(amount: number): string => {
			return currencyFormatter.format(amount);
		},
		[currencyFormatter],
	);

	const updateCurrency = useCallback((newCurrencyCode: string) => {
		const isValidCurrency = getAllCurrencies().some(
			(c) => c.code === newCurrencyCode,
		);

		if (!isValidCurrency) {
			console.warn(
				`Invalid currency code: ${newCurrencyCode}, falling back to USD`,
			);
			newCurrencyCode = "USD";
		}

		setCurrencyCode(newCurrencyCode);

		const preferences: CurrencyPreferences = {
			currencyCode: newCurrencyCode,
		};
		saveCurrencyPreferences(preferences);
	}, []);

	const contextValue = useMemo(
		() => ({
			currencyCode,
			currencyFormatter,
			availableCurrencies,
			maximumFractionDigits,
			updateCurrency,
			formatCurrency,
		}),
		[
			currencyCode,
			currencyFormatter,
			availableCurrencies,
			maximumFractionDigits,
			updateCurrency,
			formatCurrency,
		],
	);

	return (
		<CurrencyContext.Provider value={contextValue}>
			{children}
		</CurrencyContext.Provider>
	);
}
