import { Doc } from "@/convex/_generated/dataModel";

import { ExpenseFormValues } from "../types/tally";

export function expenseToFormValues(
  expense: Doc<"tallies">["expenses"][number]
): Partial<ExpenseFormValues> {
  const shareMethod = expense.shareMethod ?? "equal";
  const selectedParticipants = (expense.shareBetween || []).map(
    (s) => s.participantId
  );

  if (selectedParticipants.length === 0) {
    selectedParticipants.push(expense.paidBy);
  }

  const customAmounts: Record<string, number> = {};
  const customShares: Record<string, number> = {};
  const customPercentages: Record<string, number> = {};

  for (const share of expense.shareBetween || []) {
    if (typeof share.amount === "number") {
      customAmounts[share.participantId] = share.amount;
    }
    if (typeof share.shares === "number") {
      customShares[share.participantId] = share.shares;
    }
    if (typeof share.percentage === "number") {
      customPercentages[share.participantId] = share.percentage;
    }
  }

  const amount =
    shareMethod === "exact-amounts"
      ? expense.shareBetween.reduce((acc, s) => acc + (s.amount || 0), 0)
      : expense.amount;

  return {
    title: expense.title || "",
    amount: typeof amount === "number" ? amount : undefined,
    paidBy: expense.paidBy,
    date: expense.date ? new Date(expense.date) : undefined,
    description: expense.description || "",
    category: expense.category || "",
    tags: (expense.tags || []).join(","),
    merchant: expense.merchant || "",
    location: expense.location || "",
    receiptUrl: expense.receiptUrl || "",
    paymentMethod: expense.paymentMethod || "",
    tax: typeof expense.tax === "number" ? expense.tax : undefined,
    tip: typeof expense.tip === "number" ? expense.tip : undefined,
    serviceFee:
      typeof expense.serviceFee === "number" ? expense.serviceFee : undefined,
    selectedParticipants,
    shareMethod,
    customAmounts,
    customShares,
    customPercentages
  };
}

export function getDefaultFormValues(
  defaultPaidUserId: string,
  allParticipants: string[]
): ExpenseFormValues {
  return {
    title: "",
    amount: undefined,
    paidBy: defaultPaidUserId,
    date: undefined,
    description: "",
    category: "",
    tags: "",
    merchant: "",
    location: "",
    receiptUrl: "",
    paymentMethod: "",
    tax: undefined,
    tip: undefined,
    serviceFee: undefined,
    selectedParticipants: allParticipants,
    shareMethod: "equal",
    customAmounts: {},
    customShares: {},
    customPercentages: {}
  };
}
