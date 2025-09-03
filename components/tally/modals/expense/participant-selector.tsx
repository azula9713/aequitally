import { ParticipantAvatar } from "@/components/common/participant-avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import type {
	CustomValueHandlers,
	CustomValuesProps,
	Participant,
	ShareMethodProps,
} from "@/lib/types/tally";

import { ParticipantRow } from "./participant-row";

type Props = {
	participants: Participant[];
	selectedParticipants: string[];
	onSelectionChange: (participantIds: string[]) => void;
};

export function ParticipantSelector({
	participants,
	selectedParticipants,
	onSelectionChange,
	showAdvanced,
	shareMethod,
	customShares,
	customPercentages,
	customAmounts,
	onCustomSharesChange,
	onCustomPercentagesChange,
	onCustomAmountsChange,
}: Props & ShareMethodProps & CustomValuesProps & CustomValueHandlers) {
	const toggleParticipant = (participantId: string) => {
		if (selectedParticipants.includes(participantId)) {
			onSelectionChange(
				selectedParticipants.filter((id) => id !== participantId),
			);
		} else {
			onSelectionChange([...selectedParticipants, participantId]);
		}
	};

	const allSelected =
		selectedParticipants.length > 0 &&
		selectedParticipants.length === participants.length;

	return (
		<div className="space-y-2 min-w-0 w-full overflow-x-hidden">
			<div className="flex items-center justify-between gap-3">
				<Label className="whitespace-nowrap">Share expense between</Label>
			</div>
			<div className="flex items-center gap-2 justify-between">
				<Select>
					<SelectTrigger className="min-h-10">
						<span className="truncate">
							{selectedParticipants.length === 0
								? "Select participants"
								: allSelected
									? "Everyone"
									: `${selectedParticipants.length} selected`}
						</span>
					</SelectTrigger>
					<SelectContent className="p-0">
						<div className="max-h-72 overflow-auto overflow-x-hidden max-w-full min-w-0 divide-y">
							{participants.map((participant) => (
								<ParticipantRow
									key={participant.userId}
									participant={participant}
									checked={selectedParticipants.includes(participant.userId)}
									onToggle={() => toggleParticipant(participant.userId)}
									showAdvanced={showAdvanced}
									shareMethod={shareMethod}
									customShares={customShares}
									customPercentages={customPercentages}
									customAmounts={customAmounts}
									onCustomSharesChange={(value) =>
										onCustomSharesChange(participant.userId, value)
									}
									onCustomPercentagesChange={(value) =>
										onCustomPercentagesChange(participant.userId, value)
									}
									onCustomAmountsChange={(value) =>
										onCustomAmountsChange(participant.userId, value)
									}
								/>
							))}
						</div>
					</SelectContent>
				</Select>
				{selectedParticipants.length > 0 && (
					<div className="flex items-center gap-2 min-w-0 max-w-full">
						<div className="flex -space-x-2">
							<span className="sr-only">
								{selectedParticipants.length} participant
								{selectedParticipants.length === 1 ? "" : "s"} selected
							</span>
							{participants
								.filter((p) => selectedParticipants.includes(p.userId))
								.slice(0, 5)
								.map((p, idx) => (
									<div
										key={p.userId}
										className="ring-2 ring-background rounded-full relative"
										style={{ zIndex: 10 - idx }}
										title={p.name}
									>
										<ParticipantAvatar
											participant={p}
											className="h-7 w-7 shadow-sm"
										/>
									</div>
								))}
							{selectedParticipants.length > 5 && (
								<div
									className="h-7 w-7 rounded-full bg-muted text-xs flex items-center justify-center ring-2 ring-background font-medium"
									title={`${selectedParticipants.length - 5} more`}
								>
									+{selectedParticipants.length - 5}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
