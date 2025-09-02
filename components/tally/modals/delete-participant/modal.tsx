import { useMutation } from "convex/react";
import { useMemo, useState } from "react";

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
  participant: { userId: string; name: string };
};

export default function DeleteParticipantModal({
  open,
  setOpen,
  tally,
  participant,
}: Props) {
  const removeParticipant = useMutation(api.tally.removeParticipant);
  const [submitting, setSubmitting] = useState(false);
//   const { toast } = useToast();

  const involvedExpenses = useMemo(() => {
    const pId = String(participant.userId);
    return (tally?.expenses ?? []).filter(
      (e) =>
        String(e.paidBy) === pId ||
        (Array.isArray(e.shareBetween) &&
          e.shareBetween.some((s) => String(s.participantId) === pId))
    );
  }, [participant.userId, tally?.expenses]);

  const canDelete = involvedExpenses.length === 0

  const onConfirm = async () => {
    if (!canDelete) return;
    try {
      setSubmitting(true);
      await removeParticipant({
        tallyId: (tally as any)._id,
        participantId: participant.userId as any,
      });
    //   toast({
    //     title: "Participant removed",
    //     description: `${participant.name} has been removed.`,
    //     variant: "destructive"
    //   });
      setOpen(false);
    } catch (e) {
      console.error("Failed to remove participant", e);
    //   toast({
    //     title: "Failed to remove participant",
    //     description:
    //       e instanceof Error
    //         ? e.message
    //         : "Please try again or check expenses.",
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
            Remove participant
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            {involvedExpenses.length === 0 ? (
              <p>
                Are you sure you want to remove {participant.name} as a
                participant?
              </p>
            ) : (
              <div className="space-y-3">
                <p>
                  Remove this participant from the following expenses to delete.
                </p>
                <ul className="list-disc pl-5 space-y-1 max-h-48 overflow-auto">
                  {involvedExpenses.map((e) => {
                    const isPayer =
                      String(e.paidBy) === String(participant.userId);
                    const isShared = e.shareBetween?.some(
                      (s) =>
                        String(s.participantId) === String(participant.userId)
                    );
                    return (
                      <li key={e.id} className="text-sm">
                        <span className="font-medium">{e.title}</span>
                        <span className="text-muted-foreground"> — </span>
                        <span className="text-xs text-muted-foreground">
                          {isPayer && isShared
                            ? "paid by and shared"
                            : isPayer
                              ? "paid by"
                              : "shared"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
            disabled={!canDelete || submitting}
          >
            Remove participant
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
