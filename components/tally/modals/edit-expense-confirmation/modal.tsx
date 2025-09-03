import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Doc } from "@/convex/_generated/dataModel";

type Props = {
	open: boolean;
	setOpen: (open: boolean) => void;
	expense: Doc<"tallies">["expenses"][number];
	onCreateNew: () => void;
};

export default function EditExpenseConfirmationModal({
	open,
	setOpen,
	expense,
	onCreateNew,
}: Props) {
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base">
						Cannot edit expense with settled payments
					</AlertDialogTitle>
					<AlertDialogDescription className="space-y-3">
						<p>
							The expense "
							<strong>{expense.description || expense.title}</strong>" has
							settled payments that cannot be modified.
						</p>
						<div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
							<p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
								Why can't this expense be edited?
							</p>
							<ul className="list-disc pl-4 space-y-1 text-sm text-amber-700 dark:text-amber-300">
								<li>Settlement payments have already been made</li>
								<li>
									Changing the expense would invalidate existing settlements
								</li>
								<li>This could lead to incorrect balances and confusion</li>
							</ul>
						</div>
						<p className="text-sm font-medium text-primary">
							<strong>💡 Recommended:</strong> Create a new expense to maintain
							accurate records.
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onCreateNew}>
						Create New Expense
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
