import { Download, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Doc } from "@/convex/_generated/dataModel";
import type { SettlementTransfer } from "@/lib/helpers/tally.helper";
import { csvExportService } from "@/lib/services/csv-export.service";

interface ExportCSVButtonProps {
	tally: Doc<"tallies">;
	transfers: SettlementTransfer[];
	disabled?: boolean;
	variant?: "default" | "outline" | "ghost";
	size?: "default" | "sm" | "lg";
}

export default function ExportCSVButton({
	tally,
	transfers,
	disabled = false,
	variant = "outline",
	size = "sm",
}: ExportCSVButtonProps) {
	const [isExporting, setIsExporting] = useState(false);

	const handleExport = async (): Promise<void> => {
		if (isExporting || disabled) return;

		setIsExporting(true);

		try {
			const csvContent = csvExportService.generateSettlementCSV(
				tally,
				transfers,
			);
			const filename = csvExportService.generateFilename(tally);
			csvExportService.downloadCSV(csvContent, filename);

			toast.success("Settlement summary exported successfully", {
				description: `Downloaded as ${filename}`,
				classNames: {
					icon: "text-primary",
				},
			});
		} catch (error) {
			console.error("Export failed:", error);
			toast.error("Failed to export settlement summary", {
				description:
					error instanceof Error ? error.message : "Unknown error occurred",
				classNames: {
					icon: "text-destructive",
				},
			});
		} finally {
			setIsExporting(false);
		}
	};

	const generateFilename = (): string => {
		return csvExportService.generateFilename(tally);
	};

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleExport}
			disabled={disabled || isExporting}
			className="gap-2"
			title={
				isExporting
					? "Generating CSV..."
					: `Export settlement summary as CSV (${generateFilename()})`
			}
		>
			{isExporting ? (
				<Loader className="size-4 animate-spin" />
			) : (
				<Download className="size-4" />
			)}
			<span className="hidden sm:inline">
				{isExporting ? "Generating..." : "Export CSV"}
			</span>
		</Button>
	);
}
