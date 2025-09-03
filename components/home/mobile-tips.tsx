import { ChevronDown } from "lucide-react";

import { TipsPreferences } from "@/lib/handlers/tips-handler";
import { Checkbox } from "../ui/checkbox";

import TipContent from "./tip-content";

type Props = {
	setShowTipsMobile: React.Dispatch<React.SetStateAction<boolean>>;
	showTipsMobile: boolean;
	tipsPreferences: TipsPreferences;
	handleDontShowAgainChange: (bool: boolean) => void;
};

export default function MobileTips({
	setShowTipsMobile,
	showTipsMobile,
	tipsPreferences,
	handleDontShowAgainChange,
}: Props) {
	return (
		<div className="md:hidden">
			<button
				type="button"
				onClick={() => setShowTipsMobile((v) => !v)}
				aria-expanded={showTipsMobile}
				className="w-full flex items-center justify-between rounded-lg border border-border/30 bg-muted/30 px-3 py-2 text-left"
			>
				<span className="flex items-center gap-2 text-sm font-medium">
					<span className="text-primary">💡</span>
					Quick Tips
				</span>
				<ChevronDown
					className={`size-4 transition-transform ${showTipsMobile ? "rotate-180" : ""}`}
				/>
			</button>
			{showTipsMobile && (
				<div className="bg-muted/30 rounded-lg p-4 border border-border/30 mt-2">
					<TipContent />
					<div className="flex items-center space-x-2 mt-3 pt-2 border-t border-border/30">
						<Checkbox
							id="dont-show-tips"
							checked={!tipsPreferences.showCreateTallyTips}
							onCheckedChange={handleDontShowAgainChange}
						/>
						<label
							htmlFor="dont-show-tips"
							className="text-xs text-muted-foreground cursor-pointer"
						>
							Don&apos;t show these tips again
						</label>
					</div>
				</div>
			)}
		</div>
	);
}
