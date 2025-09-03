// import { useMutation } from "convex/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

type Props = {
	editTallyOpen: boolean;
	setEditTallyOpen: (open: boolean) => void;
	tally: Doc<"tallies">;
};

export default function EditTallyModal({
	editTallyOpen,
	setEditTallyOpen,
	tally,
}: Props) {
	//   const updateTally = useMutation(api.tally.updateTally);

	const [tallyName, setTallyName] = useState(tally.name || "");
	const [tallyDescription, setTallyDescription] = useState(
		tally.description || "",
	);
	const [tallyDate, setTallyDate] = useState<Date | undefined>(undefined);
	const [datePickerOpen, setDatePickerOpen] = useState(false);

	const handleUpdateTally = (e: React.FormEvent) => {
		e.preventDefault();
	};
	return (
		<Dialog open={editTallyOpen} onOpenChange={setEditTallyOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Tally Details</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleUpdateTally} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="tally-name">Tally Name</Label>
						<Input
							id="tally-name"
							placeholder="e.g., Trip to Italy"
							value={tallyName}
							onChange={(e) => setTallyName(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tally-description">Description (optional)</Label>
						<Input
							id="tally-description"
							placeholder="e.g., Amazing vacation with friends"
							value={tallyDescription}
							onChange={(e) => setTallyDescription(e.target.value)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-x-2 gap-y-4">
						<div className="space-y-2">
							<Label htmlFor="tally-date">Date</Label>
							<Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
								<PopoverTrigger asChild>
									<Button
										id="tally-date"
										variant="outline"
										className={cn(
											"w-full h-9 justify-start text-left font-normal bg-transparent hover:bg-accent hover:text-accent-foreground",
											!tallyDate && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="mr-2 size-4" />
										{tallyDate ? format(tallyDate, "PPP") : "Select date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										id="tally-date-picker"
										mode="single"
										selected={tallyDate}
										onSelect={(selectedDate) => {
											setTallyDate(selectedDate);
											setDatePickerOpen(false);
										}}
										initialFocus
										className="w-auto"
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					<div className="flex gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setEditTallyOpen(false)}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="flex-1"
							//   disabled={!userId || !tally._id || !tallyName}
						>
							Save Changes
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
