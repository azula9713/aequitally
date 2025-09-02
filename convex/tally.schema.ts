import { defineTable } from "convex/server";
import { v } from "convex/values";

export const shareMethod = v.union(
  v.literal("equal"),
  v.literal("shares"),
  v.literal("percentage"),
    v.literal("exact-amounts")
);


export const tallySchema = {
  name: v.string(),
  description: v.optional(v.string()),
  date: v.optional(v.string()),
  participants: v.array(
    v.object({
      userId: v.string(),
      name: v.string(),
    })
  ),
  expenses: v.array(
    v.object({
      id: v.string(),
      title: v.string(),
      description: v.optional(v.string()),
      amount: v.number(),
      date: v.optional(v.string()),
      // Expense richness
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
      // How the expense is shared
      shareBetween: v.array(
        v.object({
          participantId: v.string(),
          amount: v.number(),
          shares: v.optional(v.number()), // Optional shares for shares method
          percentage: v.optional(v.number()), // Optional percentage for percentage method
        })
      ),
      shareMethod: shareMethod,
    })
  ),
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
};

export const tallies = defineTable(tallySchema)

export type Tally = typeof tallySchema;
