import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { Ellipsis, EllipsisVertical, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ParticipantAvatar } from "@/components/common/participant-avatar";
import DeleteParticipantModal from "@/components/tally/modals/delete-participant/modal";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import {
	getParticipantBalance,
	getParticipantExpenses,
} from "@/lib/helpers/tally.helper";
import { cn } from "@/lib/utils";

type Props = {
	tally: FunctionReturnType<typeof api.tally.getTally>;
	openAddExpenseForParticipant: (participantId: string) => void;
};

export default function ParticipnatsTab({
	tally,
	openAddExpenseForParticipant,
}: Props) {
	const [searchTerm, setSearchTerm] = useState("");
	const updateTally = useMutation(api.tally.updateTally);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");
	const [deleteParticipantOpen, setDeleteParticipantOpen] = useState(false);
	const [selectedParticipant, setSelectedParticipant] = useState<{
		userId: string;
		name: string;
	} | null>(null);

	const openDeleteParticipantForParticipant = (p: {
		userId: string;
		name: string;
	}) => {
		setSelectedParticipant(p);
		setDeleteParticipantOpen(true);
	};

	const startEditing = (participant: { userId: string; name: string }) => {
		setEditingId(participant.userId);
		setEditingName(participant.name);
	};

	const cancelEditing = () => {
		setEditingId(null);
		setEditingName("");
	};

	const commitEditing = async () => {
		if (!editingId) return;
		const nextName = editingName.trim();
		if (!nextName) {
			cancelEditing();
			return;
		}
		try {
			const nextParticipants = tally.participants.map((p) =>
				String(p.userId) === String(editingId) ? { ...p, name: nextName } : p,
			);
			await updateTally({
				tallyId: tally._id,
				patchData: { participants: nextParticipants },
			});

			toast.success("Name updated", {
				description: "Participant name has been updated.",
				classNames: {
					icon: "text-primary",
				},
			});
		} catch (e) {
			toast.error("Failed to update name", {
				description: e instanceof Error ? e.message : "Please try again.",
				classNames: {
					icon: "text-destructive",
				},
			});
		} finally {
			cancelEditing();
		}
	};

	const filteredParticipants = useMemo(() => {
		if (!searchTerm.trim()) return tally.participants;

		return tally.participants.filter((participant) =>
			participant.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [tally.participants, searchTerm]);

	return (
		<TabsContent value="participants" className="mt-4 space-y-6">
			<Card className="border-border/70 shadow-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Participants</CardTitle>
					<CardDescription>Balances update as expenses change</CardDescription>

					{tally.participants.length > 4 && (
						<div className="relative mt-3">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
							<Input
								placeholder="Search participants..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					)}
				</CardHeader>
				<CardContent>
					<ul className="space-y-1 divide-y">
						{filteredParticipants.map((participant) => {
							const participantExpenses = getParticipantExpenses(
								participant.userId,
								tally,
							);
							const { balance, totalPaid } = getParticipantBalance(
								participant.userId,
								tally,
							);
							const positive = balance > 0.01;
							const negative = balance < -0.01;

							return (
								<li
									key={participant.userId}
									className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 py-3"
								>
									<div className="flex min-w-0 items-center gap-3">
										<ParticipantAvatar {...{ participant }} />
										<div className="min-w-0">
											<div className="truncate font-medium leading-tight">
												{editingId === participant.userId ? (
													<div className="flex items-center gap-2">
														<Input
															value={editingName}
															onChange={(e) => setEditingName(e.target.value)}
															onBlur={commitEditing}
															onKeyDown={(e) => {
																if (e.key === "Enter") commitEditing();
																if (e.key === "Escape") cancelEditing();
															}}
															autoFocus
															className="h-7 py-0 px-2 text-sm w-44"
														/>
													</div>
												) : (
													<button
														type="button"
														onClick={() => startEditing(participant)}
														className="truncate text-left hover:underline decoration-dotted cursor-text"
														title="Click to edit name"
													>
														{participant.name}
													</button>
												)}
											</div>
											<div className="truncate text-xs text-muted-foreground">
												Paid {totalPaid.toFixed(2)} •{" "}
												{participantExpenses.length} expenses
											</div>
										</div>
									</div>
									<div className="flex items-center justify-between w-full md:w-auto gap-3">
										<span
											className={cn(
												"whitespace-nowrap text-xs font-medium",
												positive
													? "text-emerald-600"
													: negative
														? "text-rose-600"
														: "text-muted-foreground",
											)}
											title={
												positive ? "Is owed" : negative ? "Owes" : "Settled"
											}
										>
											{Math.abs(balance) <= 0.01
												? "Settled"
												: positive
													? `+${balance.toFixed(2)}`
													: `-${Math.abs(balance).toFixed(2)}`}
										</span>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													aria-label={`Actions for ${participant.name}`}
												>
													<EllipsisVertical className="hidden md:inline" />
													<Ellipsis className="inline md:hidden" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() =>
														openAddExpenseForParticipant(participant.userId)
													}
												>
													<Plus className="mr-2 h-4 w-4" />
													Add expense
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-destructive"
													onClick={() =>
														openDeleteParticipantForParticipant(participant)
													}
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Remove participant
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</li>
							);
						})}
					</ul>

					{filteredParticipants.length === 0 && searchTerm.trim() && (
						<div className="text-center py-8">
							<p className="text-sm text-muted-foreground">
								No participants found matching "{searchTerm}"
							</p>
						</div>
					)}
				</CardContent>
			</Card>
			{selectedParticipant && (
				<DeleteParticipantModal
					open={deleteParticipantOpen}
					setOpen={(o) => {
						setDeleteParticipantOpen(o);
						if (!o) setSelectedParticipant(null);
					}}
					tally={tally}
					participant={selectedParticipant}
				/>
			)}
		</TabsContent>
	);
}
