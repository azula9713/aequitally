import * as v from "valibot";

import { expenseSchema } from "../schemas/expense.schema";

export interface Participant {
	userId: string;
	name: string;
}

export type ShareMethod = "equal" | "exact-amounts" | "shares" | "percentage";

export interface CustomValuesProps {
	customShares: Record<string, number>;
	customPercentages: Record<string, number>;
	customAmounts: Record<string, number>;
}

export interface CustomValueHandlers {
	onCustomSharesChange: (participantId: string, value: number) => void;
	onCustomPercentagesChange: (participantId: string, value: number) => void;
	onCustomAmountsChange: (participantId: string, value: number) => void;
}

export interface ShareMethodProps {
	shareMethod: ShareMethod;
	showAdvanced: boolean;
}

export type ExpenseFormValues = v.InferInput<typeof expenseSchema>;
