import { format } from "date-fns";
import { CalendarIcon, Loader2, Minus, Plus, Users } from "lucide-react";
import { type FormEvent, useId, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Props = {
	submitHandler: (e: FormEvent) => void;
	tallyName: string;
	setTallyName: (name: string) => void;
	numParticipants: string;
	setNumParticipants: (num: string) => void;
	tallyDate: Date | undefined;
	setTallyDate: (date: Date | undefined) => void;
	description: string;
	setDescription: (desc: string) => void;
	isLoading: boolean;
};

export default function CreateForm({
	submitHandler,
	tallyName,
	setTallyName,
	numParticipants,
	setNumParticipants,
	tallyDate,
	setTallyDate,
	description,
	setDescription,
	isLoading,
}: Props) {
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const tallyNameId = useId();
	const participantsId = useId();
	const dateId = useId();
	const datePickerId = useId();
	const descriptionId = useId();

	return (
		<form onSubmit={submitHandler} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor={tallyNameId} className="text-sm font-medium">
					Tally Name *
				</Label>
				<Input
					id={tallyNameId}
					placeholder="e.g., Italy Trip 2024, Dinner outing"
					value={tallyName}
					onChange={(e) => setTallyName(e.target.value)}
					autoFocus
					required
				/>
			</div>
			<div className="flex flex-col md:flex-row items-center justify-between md:space-x-2">
				<div className="space-y-2 w-full ">
					<Label htmlFor={participantsId} className="text-sm font-medium">
						Participants *
					</Label>
					<div className="flex items-center gap-2 rounded-md border border-border bg-input/30">
						<Button
							type="button"
							size="icon"
							variant="ghost"
							aria-label="Decrease participants"
							className="size-9"
							onClick={() => {
								const raw = parseInt(numParticipants || "2", 10);
								const next = Math.min(
									20,
									Math.max(2, (Number.isNaN(raw) ? 2 : raw) - 1),
								);
								setNumParticipants(String(next));
							}}
							disabled={parseInt(numParticipants || "2", 10) <= 2}
						>
							<Minus className="size-4" />
						</Button>
						<div
							className="flex min-w-[140px] flex-1 items-center justify-center gap-2 px-2"
							aria-live="polite"
						>
							<Users className="size-4 text-muted-foreground" />
							<Input
								id={participantsId}
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								min={2}
								max={20}
								step={1}
								value={numParticipants}
								onChange={(e) => {
									const val = e.target.value;
									if (val === "") {
										setNumParticipants("");
									} else if (/^\d{1,2}$/.test(val)) {
										setNumParticipants(val);
									}
								}}
								onBlur={() => {
									const n = parseInt(numParticipants || "0", 10);
									const clamped = Math.min(
										20,
										Math.max(2, Number.isNaN(n) ? 2 : n),
									);
									setNumParticipants(String(clamped));
								}}
								className="h-8 w-16 text-center font-semibold border-0 bg-input!"
								aria-label="Number of participants"
							/>
						</div>
						<Button
							type="button"
							size="icon"
							variant="ghost"
							aria-label="Increase participants"
							className="size-9"
							onClick={() => {
								const raw = parseInt(numParticipants || "2", 10);
								const next = Math.max(
									2,
									Math.min(20, (Number.isNaN(raw) ? 2 : raw) + 1),
								);
								setNumParticipants(String(next));
							}}
							disabled={parseInt(numParticipants || "2", 10) >= 20}
						>
							<Plus className="size-4" />
						</Button>
					</div>
				</div>
				<div className="space-y-2 w-full">
					<Label htmlFor={dateId} className="text-sm font-medium">
						Date
					</Label>
					<Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
						<PopoverTrigger asChild>
							<Button
								id={dateId}
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
								id={datePickerId}
								mode="single"
								selected={tallyDate}
								onSelect={(selectedDate) => {
									setTallyDate(selectedDate);
									setDatePickerOpen(false);
								}}
								className="w-auto"
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor={descriptionId} className="text-sm font-medium">
					Description
				</Label>
				<Input
					id={descriptionId}
					placeholder="Add any additional details about this tally..."
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="h-9"
				/>
			</div>
			<div className="pt-3">
				<Button
					type="submit"
					className="w-full h-10"
					disabled={!tallyName || !numParticipants || isLoading}
				>
					{isLoading ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						"Create Tally"
					)}
				</Button>
				<p className="text-xs text-muted-foreground text-center mt-2">
					You'll be able to add expenses and edit participants next
				</p>
			</div>
		</form>
	);
}
