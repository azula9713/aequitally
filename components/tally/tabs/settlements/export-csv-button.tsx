import { Download, Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Doc } from "@/convex/_generated/dataModel";
import { useCurrency } from "@/hooks/use-currency";
import { useToast } from "@/hooks/use-toast";
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
	const toast = useToast();
	const { currencyFormatter } = useCurrency();

	const handleExport = async (): Promise<void> => {
		if (isExporting || disabled) return;

		setIsExporting(true);

		try {
			const csvContent = csvExportService.generateSettlementCSV(
				tally,
				transfers,
				currencyFormatter,
			);
			const filename = csvExportService.generateFilename(tally);
			csvExportService.downloadCSV(csvContent, filename);

			toast.success("Settlement summary exported successfully", {
				description: `Downloaded as ${filename}`,
			});
		} catch (error) {
			console.error("Export failed:", error);
			toast.error("Failed to export settlement summary", {
				description:
					error instanceof Error ? error.message : "Unknown error occurred",
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
