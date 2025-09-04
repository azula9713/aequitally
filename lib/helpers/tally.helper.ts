import type { FunctionReturnType } from "convex/server";

import type { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

export const getParticipantName = (
	id: string,
	tally: FunctionReturnType<typeof api.tally.getTally>,
) => {
	return tally.participants.find((p) => p.userId === id)?.name || "Unknown";
};

export const getParticipantExpenses = (
	participantId: string,
	tally: FunctionReturnType<typeof api.tally.getTally>,
) => {
	return tally.expenses.filter((exp) => exp.paidBy === participantId) || [];
};

export const getParticipantBalance = (
	participantId: string,
	tally: Doc<"tallies">,
) => {
	const expenses = getParticipantExpenses(participantId, tally);

	const totalPaid = expenses.reduce((sum, exp) => sum + exp.amount, 0);

	// Calculate total owed based on shareBetween
	const totalOwed = tally.expenses.reduce((sum, exp) => {
		const share = exp.shareBetween.find(
			(s) => s.participantId === participantId,
		);
		return sum + (share ? share.amount : 0);
	}, 0);

	const balance = totalPaid - totalOwed;

	return { balance, totalPaid };
};

export type SettlementTransfer = {
	fromParticipantId: string;
	toParticipantId: string;
	amount: number;
};

function roundToCents(n: number) {
	return Math.round(n * 100) / 100;
}

export function computeSettlements(
	tally: Doc<"tallies">,
	epsilon: number = 0.01,
): SettlementTransfer[] {
	// Build balances for all participants
	const balances = tally.participants.map((p) => ({
		userId: p.userId,
		balance: getParticipantBalance(p.userId, tally).balance,
	}));

	// Split into creditors (positive) and debtors (negative)
	const creditors = balances
		.filter((b) => b.balance > epsilon)
		.map((b) => ({ userId: b.userId, amount: roundToCents(b.balance) }))
		.sort((a, b) => b.amount - a.amount);

	const debtors = balances
		.filter((b) => b.balance < -epsilon)
		.map((b) => ({ userId: b.userId, amount: roundToCents(-b.balance) }))
		.sort((a, b) => b.amount - a.amount);

	const transfers: SettlementTransfer[] = [];

	let i = 0; // debtor index
	let j = 0; // creditor index

	while (i < debtors.length && j < creditors.length) {
		const payAmount = Math.min(debtors[i].amount, creditors[j].amount);
		const amount = roundToCents(payAmount);
		if (amount <= epsilon) break;

		transfers.push({
			fromParticipantId: debtors[i].userId,
			toParticipantId: creditors[j].userId,
			amount,
		});

		debtors[i].amount = roundToCents(debtors[i].amount - amount);
		creditors[j].amount = roundToCents(creditors[j].amount - amount);

		if (debtors[i].amount <= epsilon) i++;
		if (creditors[j].amount <= epsilon) j++;
	}

	return transfers;
}
