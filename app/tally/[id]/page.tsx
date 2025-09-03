"use client";

import { useQuery } from "convex/react";
import { Receipt, ReceiptText, Users } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import ExpenseModal from "@/components/tally/modals/expense/modal";
import ParticipantModal from "@/components/tally/modals/participant/modal";
import ExpensesTab from "@/components/tally/tabs/expenses";
import ParticipnatsTab from "@/components/tally/tabs/participants";
import SettlementsTab from "@/components/tally/tabs/settlements";
import TallyHeader from "@/components/tally/tally-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function Viewtally({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = params instanceof Promise ? use(params) : params;

	const tally = useQuery(
		api.tally.getTally,
		id
			? {
					id: id as Id<"tallies">,
				}
			: "skip",
	);

	const [addExpenseOpen, setAddExpenseOpen] = useState(false);
	const [openAddParticipant, setOpenAddParticipant] = useState(false);
	const [activeTab, setActiveTab] = useState("expenses");
	const [defaultPaidBy, setDefaultPaidBy] = useState<string | undefined>(
		undefined,
	);

	const openAddExpenseForParticipant = (participantId: string) => {
		setDefaultPaidBy(participantId);
		setAddExpenseOpen(true);
	};

	const handleCloseAddExpense = (open: boolean) => {
		setAddExpenseOpen(open);
		if (!open) {
			setDefaultPaidBy(undefined);
		}
	};

	const openAddExpenseFromHeader = () => {
		setDefaultPaidBy(undefined);
		setAddExpenseOpen(true);
	};

	const handleCreateExpenseWithDefaults = (defaultPaidBy: string) => {
		setDefaultPaidBy(defaultPaidBy);
		setAddExpenseOpen(true);
	};

	if (tally === undefined) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="animate-spin border-2 border-accent border-t-transparent rounded-full size-8" />
			</div>
		);
	}

	if (!tally) {
		return (
			<div className="min-h-screen bg-background lex items-center justify-center">
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-medium">Tally not found</h1>
					<Button asChild variant="outline">
						<Link href="/">Go back home</Link>
					</Button>
				</div>
			</div>
		);
	}

	const totalExpenses = tally.expenses.reduce(
		(sum, expense) => sum + expense.amount,
		0,
	);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<TallyHeader
				{...{
					tally,
					totalExpenses,
					setAddExpenseOpen: openAddExpenseFromHeader,
					setOpenAddParticipant,
					activeTab,
				}}
			/>
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				defaultValue="participants"
				className="space-y-2"
			>
				<TabsList className="grid w-full grid-cols-3 sm:w-auto">
					<TabsTrigger value="expenses">
						<Receipt className="size-4 md:mr-2" />
						<span className="hidden md:inline">Expenses</span>
					</TabsTrigger>
					<TabsTrigger value="participants">
						<Users className="size-4 md:mr-2" />
						<span className="hidden md:inline">Participants</span>
					</TabsTrigger>
					<TabsTrigger value="settlements">
						<ReceiptText className="size-4 md:mr-2" />
						<span className="hidden md:inline">Settlements</span>
					</TabsTrigger>
				</TabsList>

				<ParticipnatsTab {...{ tally, openAddExpenseForParticipant }} />
				<ExpensesTab
					{...{
						tally,
						setAddExpenseOpen: handleCloseAddExpense,
						onCreateExpenseWithDefaults: handleCreateExpenseWithDefaults,
					}}
				/>
				<SettlementsTab tally={tally} />
			</Tabs>

			<ExpenseModal
				{...{
					addExpenseOpen,
					setAddExpenseOpen: handleCloseAddExpense,
					tally,
					defaultPaidBy,
				}}
			/>
			<ParticipantModal
				{...{
					openAddParticipant,
					setOpenAddParticipant,
					tally,
				}}
			/>
		</div>
	);
}
