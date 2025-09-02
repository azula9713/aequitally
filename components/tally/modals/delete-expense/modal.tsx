import { useMutation } from "convex/react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
// import { useToast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  tally: Doc<"tallies">;
  expense: Doc<"tallies">["expenses"][number];
};

export default function DeleteExpenseModal({
  open,
  setOpen,
  tally,
  expense,
}: Props) {
  const removeExpense = useMutation(api.tally.removeExpense);
  const [submitting, setSubmitting] = useState(false);
//   const { toast } = useToast();

  const onConfirm = async () => {
   
    try {
      setSubmitting(true);
      await removeExpense({
        tallyId: (tally as any)._id,
        expenseId: expense.id,
      });
    //   toast({
    //     title: "Expense deleted",
    //     description: `${expense.title} has been removed.`,
    //     variant: "destructive"
    //   });
      setOpen(false);
    } catch (e) {
      console.error("Failed to remove expense", e);
    //   toast({
    //     title: "Failed to remove expense",
    //     description: e instanceof Error ? e.message : "Please try again.",
    //     variant: "destructive"
    //   });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">
            Delete expense
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{expense.title}"? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
            disabled={submitting}
          >
            Delete expense
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
