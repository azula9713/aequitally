import { Edit, Plus, Receipt, Share2, Users } from "lucide-react";
import { useState } from "react";
import type { Doc } from "@/convex/_generated/dataModel";
import { useCurrency } from "@/hooks/use-currency";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import EditTallyModal from "./modals/edit-tally/modal";

type Props = {
	tally: Doc<"tallies">;
	totalExpenses: number;
	setAddExpenseOpen: (open: boolean) => void;
	setOpenAddParticipant: (open: boolean) => void;
	activeTab: string;
};

export default function TallyHeader({
	tally,
	totalExpenses,
	setAddExpenseOpen,
	setOpenAddParticipant,
	activeTab,
}: Props) {
	const [editTallyOpen, setEditTallyOpen] = useState(false);
	const { formatCurrency } = useCurrency();
	const toast = useToast();

	const handleShareClick = async (): Promise<void> => {
		// Check for clipboard API availability
		if (!navigator.clipboard) {
			toast.error("Clipboard not supported", {
				description: "Please copy the URL manually from the address bar",
			});
			return;
		}

		try {
			await navigator.clipboard.writeText(window.location.href);
			toast.success("URL copied to clipboard", {
				description: "Share this link with others to collaborate on the tally",
			});
		} catch (error) {
			// Handle various error scenarios
			if (error instanceof DOMException) {
				switch (error.name) {
					case "NotAllowedError":
						toast.error("Permission denied", {
							description: "Please allow clipboard access and try again",
						});
						break;
					default:
						toast.error("Failed to copy URL", {
							description: "Please try again or copy the URL manually",
						});
				}
			} else {
				toast.error("Unexpected error", {
					description: "Please try copying the URL manually",
				});
			}
		}
	};

	return (
		<>
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0 flex-1">
					<div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-2">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl truncate">
							{tally.name}
						</h1>
						<div className="flex items-center gap-2">
							{tally.date && (
								<span className="text-xs text-muted-foreground md:text-sm">
									{new Date(tally.date).toLocaleDateString()}
								</span>
							)}
						</div>
					</div>
					<p className="text-sm text-muted-foreground mb-3">
						{tally.description || "Manage participants and expenses"}
					</p>

					{/* Stats row */}
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<Users className="size-4" />
							<span className="font-medium">{tally.participants.length}</span>
							<span className="hidden sm:inline">
								{tally.participants.length === 1
									? "participant"
									: "participants"}
							</span>
						</span>
						<span className="flex items-center gap-1.5">
							<Receipt className="size-4" />
							<span className="font-medium">{tally.expenses.length}</span>
							<span className="hidden sm:inline">
								{tally.expenses.length === 1 ? "expense" : "expenses"}
							</span>
						</span>
						<span className="flex items-center gap-1.5">
							<span className="text-lg font-semibold text-primary">
								{formatCurrency(totalExpenses)}
							</span>
						</span>
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex gap-2 flex-shrink-0">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setEditTallyOpen(true)}
					>
						<Edit className="size-4" />
						<span className="hidden sm:inline">Edit Tally</span>
					</Button>
					{activeTab === "participants" && (
						<Button size="sm" onClick={() => setOpenAddParticipant(true)}>
							<Plus className="size-4" />
							<span className="hidden sm:inline">Add Participant</span>
						</Button>
					)}
					{activeTab === "expenses" && (
						<Button size="sm" onClick={() => setAddExpenseOpen(true)}>
							<Plus className="size-4" />
							<span className="hidden sm:inline">Add Expense</span>
						</Button>
					)}
					<Button
						variant="outline"
						size="sm"
						title="Share Tally - Copy URL to clipboard"
						aria-label="Share this tally by copying its URL to clipboard"
						onClick={handleShareClick}
					>
						<Share2 className="size-4" aria-hidden="true" />
					</Button>
				</div>
			</div>

			<EditTallyModal
				{...{
					editTallyOpen,
					setEditTallyOpen,
					tally,
				}}
			/>
		</>
	);
}
