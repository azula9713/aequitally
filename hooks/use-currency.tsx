"use client";

import type { Currency } from "global-currency-list/dist/types";
import { useContext } from "react";

import { CurrencyContext } from "@/providers/currency-provider";

export interface UseCurrencyReturn {
	currencyCode: string;
	currencyFormatter: Intl.NumberFormat;
	availableCurrencies: Currency[];
	maximumFractionDigits: number;
	updateCurrency: (currencyCode: string) => void;
	formatCurrency: (amount: number) => string;
}

export const useCurrency = (): UseCurrencyReturn => {
	const context = useContext(CurrencyContext);

	if (!context) {
		throw new Error("useCurrency must be used within CurrencyProvider");
	}

	return context;
};
