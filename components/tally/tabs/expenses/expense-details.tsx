import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Doc } from "@/convex/_generated/dataModel";
import { useCurrency } from "@/hooks/use-currency";

type Props = {
	expense: Doc<"tallies">["expenses"][number];
	perHead: number;
	payer: string;
	sharedCount: number;
	openEditExpense: () => void;
	openDeleteExpense: () => void;
};

export default function ExpenseDetails({
	expense,
	perHead,
	payer,
	sharedCount,
	openEditExpense,
	openDeleteExpense,
}: Props) {
	const { formatCurrency } = useCurrency();

	return (
		<div
			key={expense.id}
			className="rounded-lg border p-4 transition-colors hover:bg-muted/30"
		>
			<div className="flex flex-col md:flex-row items-start justify-between gap-3">
				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<span className=" text-sm font-medium">{expense.title}</span>
						<span className="text-xs text-muted-foreground">•</span>
						{expense.shareMethod === "equal" ? (
							<>
								<span className="sr-only">Per head</span>
								<span className="text-xs text-muted-foreground">
									{formatCurrency(perHead)} each
								</span>
							</>
						) : (
							<span className="text-xs text-muted-foreground">
								{expense.shareMethod.toUpperCase()} share
							</span>
						)}
					</div>
					<div className="mt-1 text-[12px] text-muted-foreground truncate">
						Paid by {payer} · Shared: {sharedCount}
					</div>
				</div>
				<div className="flex items-center justify-between w-full md:w-auto gap-2">
					<div className="text-right">
						<div className="text-sm font-semibold tabular-nums">
							{formatCurrency(expense.amount)}
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label={`Actions for ${expense.description}`}
							>
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => openEditExpense()}>
								<Edit className="mr-2 size-3.5" /> Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-rose-600"
								onClick={() => openDeleteExpense()}
							>
								<Trash className="mr-2 size-3.5" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}
