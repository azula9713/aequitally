import { useMutation } from "convex/react";
import { User } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Participant } from "@/lib/types/tally";

type Props = {
  openAddParticipant: boolean;
  setOpenAddParticipant: (open: boolean) => void;
  tally: Doc<"tallies">;
};

export default function ParticipantModal({
  openAddParticipant,
  setOpenAddParticipant,
  tally,
}: Props) {
  const addParticipant = useMutation(api.tally.addParticipant);
  return (
    <Dialog open={openAddParticipant} onOpenChange={setOpenAddParticipant}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add participant</DialogTitle>
          <DialogDescription>
            Add by name or invite via email. Keep it short and sweet.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget as HTMLFormElement);

            const name = String(fd.get("name") || "").trim();
            if (!name) return;

            const newParticipant: Participant = {
              userId: uuidv4(),
              name,
            };

            await addParticipant({
              tallyId: tally._id,
              participant: newParticipant,
            }).then(() => {
              (e.currentTarget as HTMLFormElement)?.reset();
              setOpenAddParticipant(false);
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                id="name"
                name="name"
                placeholder="e.g. Jamie Rivera"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpenAddParticipant(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
