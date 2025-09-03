import { v } from "convex/values";

import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { shareMethod } from "./tally.schema";

// -----------------------------
// Validation helpers
// -----------------------------
const EPSILON = 1e-6;

function ensureParticipantExists(tally: Doc<"tallies">, participantId: string) {
	const exists = tally.participants.some(
		(p: any) => String(p.userId) === String(participantId),
	);
	if (!exists)
		throw new Error(`Participant ${participantId} is not part of this tally`);
}

function validateExpenseShare(expense: any) {
	const { shareBetween, shareMethod: method, amount } = expense;
	if (!Array.isArray(shareBetween) || shareBetween.length === 0) {
		throw new Error("shareBetween must include at least one participant");
	}

	// Non-negative checks
	if (!(amount > 0)) throw new Error("Expense amount must be > 0");
	["tax", "tip", "serviceFee"].forEach((k) => {
		if (expense[k] != null && !(expense[k] >= 0)) {
			throw new Error(`${k} must be >= 0`);
		}
	});

	if (method === "exact-amounts") {
		const total = shareBetween.reduce(
			(acc: number, s: any) => acc + (s.amount || 0),
			0,
		);
		if (Math.abs(total - amount) > EPSILON) {
			throw new Error("Sum of exact amounts must equal the expense amount");
		}
		shareBetween.forEach((s: any) => {
			if (!(s.amount >= 0)) throw new Error("Exact amounts must be >= 0");
		});
	} else if (method === "shares") {
		const totalShares = shareBetween.reduce(
			(acc: number, s: any) => acc + (s.shares || 0),
			0,
		);
		if (!(totalShares > 0))
			throw new Error("Total shares must be > 0 for shares method");
		shareBetween.forEach((s: any) => {
			if (s.shares != null && !(s.shares >= 0)) {
				throw new Error("Shares must be >= 0");
			}
		});
	} else if (method === "percentage") {
		const totalPct = shareBetween.reduce(
			(acc: number, s: any) => acc + (s.percentage || 0),
			0,
		);
		if (Math.abs(totalPct - 100) > EPSILON) {
			throw new Error("Sum of percentages must equal 100");
		}
		shareBetween.forEach((s: any) => {
			if (s.percentage != null && (s.percentage < 0 || s.percentage > 100)) {
				throw new Error("Percentages must be between 0 and 100");
			}
		});
	}
}

function validateExpenseReferential(expense: any, tally: any) {
	// paidBy must be a participant
	ensureParticipantExists(tally, expense.paidBy);
	// All shareBetween participantIds must be participants
	const seen = new Set<string>();
	for (const s of expense.shareBetween) {
		ensureParticipantExists(tally, s.participantId);
		const key = String(s.participantId);
		if (seen.has(key)) throw new Error("Duplicate participant in shareBetween");
		seen.add(key);
	}
}

export const createTally = mutation({
	args: {
		createData: v.object({
			name: v.string(),
			description: v.optional(v.string()),
			date: v.optional(v.string()),
			participants: v.array(
				v.object({
					userId: v.string(),
					name: v.string(),
				}),
			),
			expenses: v.array(
				v.object({
					id: v.string(),
					title: v.string(),
					description: v.optional(v.string()),
					amount: v.number(),
					date: v.optional(v.string()),
					// Expense richness (optional)
					category: v.optional(v.string()),
					tags: v.optional(v.array(v.string())),
					merchant: v.optional(v.string()),
					location: v.optional(v.string()),
					receiptUrl: v.optional(v.string()),
					paymentMethod: v.optional(v.string()),
					notes: v.optional(v.string()),
					tax: v.optional(v.number()),
					tip: v.optional(v.number()),
					serviceFee: v.optional(v.number()),
					paidBy: v.string(),
					shareBetween: v.array(
						v.object({
							participantId: v.string(),
							amount: v.number(),
							shares: v.optional(v.number()), // Optional shares for shares method
							percentage: v.optional(v.number()), // Optional percentage for percentage method
						}),
					),
					shareMethod: shareMethod,
				}),
			),
		}),
	},
	handler: async (ctx, args) => {
		const createData = args.createData;

		const tally = {
			name: createData.name,
			description: createData.description,
			date: createData.date,
			participants: createData.participants,
			expenses: createData.expenses,
			createdAt: Date.now(),
		};

		// Validate referential integrity and shares for initial expenses
		for (const exp of tally.expenses) {
			validateExpenseReferential(exp, tally);
			validateExpenseShare(exp);
		}
		return ctx.db.insert("tallies", tally);
	},
});

export const updateTally = mutation({
	args: {
		tallyId: v.id("tallies"),
		patchData: v.optional(
			v.object({
				name: v.optional(v.string()),
				category: v.optional(v.string()),
				description: v.optional(v.string()),
				date: v.optional(v.string()),
				participants: v.optional(
					v.array(
						v.object({
							userId: v.string(),
							name: v.string(),
						}),
					),
				),
				expenses: v.optional(
					v.array(
						v.object({
							id: v.string(),
							title: v.string(),
							description: v.optional(v.string()),
							amount: v.number(),
							date: v.optional(v.string()),
							// Expense richness (optional)
							category: v.optional(v.string()),
							tags: v.optional(v.array(v.string())),
							merchant: v.optional(v.string()),
							location: v.optional(v.string()),
							receiptUrl: v.optional(v.string()),
							paymentMethod: v.optional(v.string()),
							notes: v.optional(v.string()),
							tax: v.optional(v.number()),
							tip: v.optional(v.number()),
							serviceFee: v.optional(v.number()),
							paidBy: v.string(),
							shareBetween: v.array(
								v.object({
									participantId: v.string(),
									amount: v.number(),
									shares: v.optional(v.number()), // Optional shares for shares method
									percentage: v.optional(v.number()), // Optional percentage for percentage method
								}),
							),
							shareMethod: shareMethod,
						}),
					),
				),
			}),
		),
	},
	handler: async (ctx, args) => {
		const id = args.tallyId;

		const { ...updates } = args.patchData;

		const tally = await ctx.db.get(id);

		if (!tally) {
			throw new Error("Tally not found");
		}

		const nextParticipants = updates.participants ?? tally.participants;
		if (updates.expenses) {
			for (const exp of updates.expenses) {
				validateExpenseReferential(exp, { participants: nextParticipants });
				validateExpenseShare(exp);
			}
		}

		// Handle status transitions
		const now = Date.now();

		const updatedTally = {
			...tally,
			...updates,
			updatedAt: Date.now(),
		};

		return await ctx.db.patch(id, updatedTally);
	},
});

export const addParticipant = mutation({
	args: {
		tallyId: v.id("tallies"),
		participant: v.object({
			userId: v.string(),
			name: v.string(),
		}),
	},
	handler: async (ctx, args) => {
		const tally = await ctx.db.get(args.tallyId);
		if (!tally) {
			throw new Error("Tally not found");
		}

		//check if participant already exists
		const existingParticipant = tally.participants.find(
			(p) => p.userId === args.participant.userId,
		);
		if (existingParticipant) {
			throw new Error("Participant already exists in this tally");
		}

		const updatedTally = {
			...tally,
			participants: [...tally.participants, args.participant],
			updatedAt: Date.now(),
		};
		return await ctx.db.patch(args.tallyId, updatedTally);
	},
});

export const removeParticipant = mutation({
	args: {
		tallyId: v.id("tallies"),
		participantId: v.string(),
	},
	handler: async (ctx, args) => {
		const tally = await ctx.db.get(args.tallyId);
		if (!tally) {
			throw new Error("Tally not found");
		}
		// Frontend should not allow removing the participant if they are part of any expenses.
		// But we ensure here that if they are, we remove their shares from all expenses.

		const updatedExpenses = tally.expenses.map((expense) => {
			const updatedShareBetween = expense.shareBetween.filter(
				(share) => share.participantId !== args.participantId,
			);
			return {
				...expense,
				shareBetween: updatedShareBetween,
			};
		});

		// Remove participant from tally
		ensureParticipantExists(tally, args.participantId);
		if (tally.participants.length <= 1) {
			throw new Error("Cannot remove the last participant from a tally");
		}

		const updatedTally = {
			...tally,
			participants: tally.participants.filter(
				(p) => p.userId !== args.participantId,
			),
			expenses: updatedExpenses,
			updatedAt: Date.now(),
		};
		return await ctx.db.patch(args.tallyId, updatedTally);
	},
});

export const addExpense = mutation({
	args: {
		tallyId: v.id("tallies"),
		expense: v.object({
			id: v.string(),
			title: v.string(),
			description: v.optional(v.string()),
			amount: v.number(),
			date: v.optional(v.string()),
			// Expense richness (optional)
			category: v.optional(v.string()),
			tags: v.optional(v.array(v.string())),
			merchant: v.optional(v.string()),
			location: v.optional(v.string()),
			receiptUrl: v.optional(v.string()),
			paymentMethod: v.optional(v.string()),
			notes: v.optional(v.string()),
			tax: v.optional(v.number()),
			tip: v.optional(v.number()),
			serviceFee: v.optional(v.number()),
			paidBy: v.string(),
			shareBetween: v.array(
				v.object({
					participantId: v.string(),
					amount: v.number(),
					shares: v.optional(v.number()), // Optional shares for shares method
					percentage: v.optional(v.number()), // Optional percentage for percentage method
				}),
			),
			shareMethod: shareMethod,
		}),
	},
	handler: async (ctx, args) => {
		const tally = await ctx.db.get(args.tallyId);

		if (!tally) {
			throw new Error("Tally not found");
		}
		// Validate expense against current tally
		validateExpenseReferential(args.expense, tally);
		validateExpenseShare(args.expense);

		const updatedTally = {
			...tally,
			expenses: [...tally.expenses, args.expense],
			updatedAt: Date.now(),
		};

		return await ctx.db.patch(args.tallyId, updatedTally);
	},
});

export const editExpense = mutation({
	args: {
		tallyId: v.id("tallies"),
		expenseId: v.string(),
		updatedExpense: v.object({
			title: v.string(),
			description: v.optional(v.string()),
			amount: v.number(),
			date: v.optional(v.string()),
			// Expense richness (optional)
			category: v.optional(v.string()),
			tags: v.optional(v.array(v.string())),
			merchant: v.optional(v.string()),
			location: v.optional(v.string()),
			receiptUrl: v.optional(v.string()),
			paymentMethod: v.optional(v.string()),
			notes: v.optional(v.string()),
			tax: v.optional(v.number()),
			tip: v.optional(v.number()),
			serviceFee: v.optional(v.number()),
			paidBy: v.string(),
			shareBetween: v.array(
				v.object({
					participantId: v.string(),
					amount: v.number(),
					shares: v.optional(v.number()), // Optional shares for shares method
					percentage: v.optional(v.number()), // Optional percentage for percentage method
				}),
			),
			shareMethod: shareMethod,
		}),
	},
	handler: async (ctx, args) => {
		const tally = await ctx.db.get(args.tallyId);

		if (!tally) {
			throw new Error("Tally not found");
		}

		const expenseIndex = tally.expenses.findIndex(
			(expense) => expense.id === args.expenseId,
		);

		if (expenseIndex === -1) {
			throw new Error("Expense not found");
		}

		const updatedExpense = {
			...tally.expenses[expenseIndex],
			...args.updatedExpense,
		};

		// Validate updated expense against tally
		validateExpenseReferential(updatedExpense, tally);
		validateExpenseShare(updatedExpense);

		const updatedExpenses = [...tally.expenses];
		updatedExpenses[expenseIndex] = updatedExpense;

		const updatedTally = {
			...tally,
			expenses: updatedExpenses,
			updatedAt: Date.now(),
		};

		return await ctx.db.patch(args.tallyId, updatedTally);
	},
});

export const removeExpense = mutation({
	args: {
		tallyId: v.id("tallies"),
		expenseId: v.string(),
	},
	handler: async (ctx, args) => {
		const tally = await ctx.db.get(args.tallyId);

		if (!tally) {
			throw new Error("Tally not found");
		}

		const expenseIndex = tally.expenses.findIndex(
			(expense) => expense.id === args.expenseId,
		);

		if (expenseIndex === -1) {
			throw new Error("Expense not found");
		}

		// Remove the expense from the tally
		const updatedExpenses = tally.expenses.filter(
			(expense) => expense.id !== args.expenseId,
		);

		const updatedTally = {
			...tally,
			expenses: updatedExpenses,
			updatedAt: Date.now(),
		};

		return await ctx.db.patch(args.tallyId, updatedTally);
	},
});

export const getTally = query({
	args: {
		id: v.id("tallies"),
	},
	handler: async (ctx, args) => {
		const tally = await ctx.db.get(args.id);

		if (!tally) {
			throw new Error("Tally not found");
		}

		return tally;
	},
});
