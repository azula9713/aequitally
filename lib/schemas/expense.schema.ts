import * as v from "valibot";

export const expenseSchema = v.pipe(
	v.object({
		title: v.pipe(v.string(), v.minLength(1, "Title is required")),
		amount: v.optional(v.pipe(v.number(), v.minValue(0))),
		paidBy: v.pipe(v.string(), v.minLength(1, "Who paid is required")),
		date: v.optional(v.date()),

		description: v.optional(v.string()),
		category: v.optional(v.string()),
		tags: v.optional(v.string()),
		merchant: v.optional(v.string()),
		location: v.optional(v.string()),
		receiptUrl: v.optional(
			v.union([v.pipe(v.string(), v.url()), v.literal("")]),
		),
		paymentMethod: v.optional(v.string()),
		tax: v.optional(v.pipe(v.number(), v.minValue(0))),
		tip: v.optional(v.pipe(v.number(), v.minValue(0))),
		serviceFee: v.optional(v.pipe(v.number(), v.minValue(0))),

		selectedParticipants: v.pipe(
			v.array(v.string()),
			v.minLength(1, "Pick at least one"),
		),
		shareMethod: v.optional(
			v.picklist(["equal", "exact-amounts", "shares", "percentage"]),
			"equal",
		),
		customAmounts: v.optional(v.record(v.string(), v.number()), {}),
		customShares: v.optional(v.record(v.string(), v.number()), {}),
		customPercentages: v.optional(v.record(v.string(), v.number()), {}),
	}),
	v.check(
		(data) =>
			data.shareMethod === "exact-amounts" ||
			(typeof data.amount === "number" && Number.isFinite(data.amount)),
		"Amount is required",
	),
);
