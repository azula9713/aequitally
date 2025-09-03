import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { expenseSchema } from "@/lib/schemas/expense.schema";
import { ExpenseFormValues, ShareMethod } from "@/lib/types/tally";
import {
	expenseToFormValues,
	getDefaultFormValues,
} from "@/lib/utils/expense-form.utils";

const parseNumber = (val: unknown): number | undefined => {
	if (val === "" || val === null || typeof val === "undefined")
		return undefined;
	const n = typeof val === "number" ? val : parseFloat(String(val));
	return Number.isNaN(n) ? undefined : n;
};

type Args = {
	tally: Doc<"tallies">;
	userId?: string;
	defaultPaidBy?: string;
	addExpenseOpen: boolean;
	setAddExpenseOpen: (open: boolean) => void;
	editingExpense?: boolean;
	expense?: Doc<"tallies">["expenses"][number] | null;
};

export function useExpenseForm({
	tally,
	userId,
	defaultPaidBy,
	addExpenseOpen,
	setAddExpenseOpen,
	editingExpense = false,
	expense = null,
}: Args) {
	const addExpense = useMutation(api.tally.addExpense);
	const editExpenseMutation = useMutation(api.tally.editExpense);

	const [showAdvanced, setShowAdvanced] = useState(false);

	const defaultPaidUserId =
		defaultPaidBy ?? tally.participants[0]?.userId ?? "";

	const allParticipantIds = useMemo(
		() => tally.participants.map((p) => p.userId),
		[tally.participants],
	);

	const initialValues = useMemo(() => {
		if (editingExpense && expense) {
			return expenseToFormValues(expense);
		}
		return getDefaultFormValues(defaultPaidUserId, allParticipantIds);
	}, [editingExpense, expense, defaultPaidUserId, allParticipantIds]);

	const form = useForm<ExpenseFormValues>({
		resolver: valibotResolver(expenseSchema),
		defaultValues: initialValues,
	});

	const toggleAdvanced = useCallback(() => setShowAdvanced((p) => !p), []);

	// Reset form when modal opens or expense changes
	useEffect(() => {
		if (!addExpenseOpen) return;

		const formValues =
			editingExpense && expense
				? expenseToFormValues(expense)
				: getDefaultFormValues(defaultPaidUserId, allParticipantIds);

		form.reset(formValues);
	}, [
		addExpenseOpen,
		editingExpense,
		expense,
		defaultPaidUserId,
		allParticipantIds,
	]);

	// Keep defaults in sync when opening for new expenses
	useEffect(() => {
		if (addExpenseOpen && !editingExpense) {
			if (defaultPaidBy) {
				form.setValue("paidBy", defaultPaidUserId, { shouldValidate: true });
			}
			const currentSel = form.getValues("selectedParticipants");
			if (!currentSel || currentSel.length === 0) {
				form.setValue("selectedParticipants", allParticipantIds, {
					shouldValidate: true,
				});
			}
		}
	}, [
		addExpenseOpen,
		editingExpense,
		defaultPaidBy,
		defaultPaidUserId,
		allParticipantIds,
	]);

	const selectedParticipants = form.watch("selectedParticipants");
	const shareMethod = form.watch("shareMethod") ?? "equal";
	const customShares = form.watch("customShares") ?? {};
	const customPercentages = form.watch("customPercentages") ?? {};
	const customAmounts = form.watch("customAmounts") ?? {};
	const amountField = form.watch("amount");
	const titleField = form.watch("title");

	const totalShares = useMemo(
		() =>
			Object.values(customShares || {}).reduce((sum, v) => sum + (v || 0), 0),
		[customShares],
	);

	const amountNumber = useMemo(() => {
		if (shareMethod === "exact-amounts") {
			return (selectedParticipants || []).reduce(
				(sum, pid) => sum + (customAmounts?.[pid] || 0),
				0,
			);
		}
		return parseNumber(amountField) ?? 0;
	}, [shareMethod, selectedParticipants, customAmounts, amountField]);

	const shareBetween = useMemo(
		() =>
			(selectedParticipants || []).map((pid) => {
				switch (shareMethod) {
					case "equal":
						return {
							participantId: pid,
							amount:
								(selectedParticipants?.length || 0) > 0
									? amountNumber / (selectedParticipants?.length || 1)
									: 0,
							shares: undefined as number | undefined,
							percentage: undefined as number | undefined,
						};
					case "exact-amounts":
						return {
							participantId: pid,
							amount: customAmounts?.[pid] || 0,
							shares: undefined as number | undefined,
							percentage: undefined as number | undefined,
						};
					case "shares": {
						const ts = totalShares || 0;
						const share = customShares?.[pid] || 0;
						const amt = ts > 0 ? share * (amountNumber / ts) : 0;
						return {
							participantId: pid,
							amount: amt,
							shares: share,
							percentage: undefined as number | undefined,
						};
					}
					case "percentage": {
						const pct = customPercentages?.[pid] || 0;
						return {
							participantId: pid,
							amount: (pct / 100) * amountNumber,
							shares: undefined as number | undefined,
							percentage: pct,
						};
					}
					default:
						return {
							participantId: pid,
							amount: 0,
							shares: undefined as number | undefined,
							percentage: undefined as number | undefined,
						};
				}
			}),
		[
			selectedParticipants,
			shareMethod,
			amountNumber,
			customAmounts,
			customShares,
			customPercentages,
			totalShares,
		],
	);

	const onSelectionChangeParticipants = useCallback(
		(ids: string[]) =>
			form.setValue("selectedParticipants", ids, { shouldValidate: true }),
		[form],
	);
	const onShareMethodChange = useCallback(
		(m: ShareMethod) =>
			form.setValue("shareMethod", m, { shouldValidate: true }),
		[form],
	);
	const onCustomSharesChange = useCallback(
		(id: string, value: number) => {
			const currentShares = form.getValues("customShares") || {};
			if (currentShares[id] !== value) {
				form.setValue(
					"customShares",
					{ ...currentShares, [id]: value },
					{ shouldValidate: true },
				);
			}
		},
		[form],
	);
	const onCustomPercentagesChange = useCallback(
		(id: string, value: number) => {
			const currentPercentages = form.getValues("customPercentages") || {};
			if (currentPercentages[id] !== value) {
				form.setValue(
					"customPercentages",
					{ ...currentPercentages, [id]: value },
					{ shouldValidate: true },
				);
			}
		},
		[form],
	);
	const onCustomAmountsChange = useCallback(
		(id: string, value: number) => {
			const currentAmounts = form.getValues("customAmounts") || {};
			if (currentAmounts[id] !== value) {
				form.setValue(
					"customAmounts",
					{ ...currentAmounts, [id]: value },
					{ shouldValidate: true },
				);
			}
		},
		[form],
	);

	const isSubmitDisabled = useMemo(() => {
		const needsAmount = shareMethod !== "exact-amounts";
		const amountVal = parseNumber(amountField);
		const amountValid =
			!needsAmount ||
			(typeof amountVal === "number" && Number.isFinite(amountVal));
		const sel = selectedParticipants || [];

		return !titleField || !amountValid || sel.length === 0;
	}, [titleField, shareMethod, amountField, selectedParticipants]);

	const resetExpenseForm = useCallback(() => {
		const defaultValues = getDefaultFormValues(
			defaultPaidUserId,
			allParticipantIds,
		);
		form.reset(defaultValues);
		setShowAdvanced(false);
	}, [defaultPaidUserId, allParticipantIds]);

	const onSubmit = form.handleSubmit(async (values) => {
		const tags = (values.tags || "")
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);
		const tagsParsed = tags.length ? tags : undefined;

		const expenseData = {
			title: values.title,
			description: values.description || "",
			category: values.category || undefined,
			tags: tagsParsed,
			merchant: values.merchant || undefined,
			location: values.location || undefined,
			receiptUrl: values.receiptUrl || undefined,
			paymentMethod: values.paymentMethod || undefined,
			tax: parseNumber(values.tax),
			tip: parseNumber(values.tip),
			serviceFee: parseNumber(values.serviceFee),
			amount: amountNumber,
			date: values.date?.toISOString() || new Date().toISOString(),
			paidBy: values.paidBy,
			shareBetween,
			shareMethod: values.shareMethod ?? "equal",
		} as const;

		if (editingExpense && expense?.id) {
			await editExpenseMutation({
				tallyId: tally._id,
				expenseId: expense.id,
				updatedExpense: expenseData as any,
			});
		} else {
			const payload = {
				...expenseData,
				id: uuidv4(),
			};
			await addExpense({ tallyId: tally._id, expense: payload });
		}

		setAddExpenseOpen(false);
		resetExpenseForm();
	});

	return {
		form,
		// UI toggles
		showAdvanced,
		toggleAdvanced,
		// values
		selectedParticipants,
		shareMethod,
		customShares,
		customPercentages,
		customAmounts,
		// setters
		onSelectionChangeParticipants,
		onShareMethodChange,
		onCustomSharesChange,
		onCustomPercentagesChange,
		onCustomAmountsChange,
		// derived
		isSubmitDisabled,
		// actions
		onSubmit,
		resetExpenseForm,
	};
}
