import type { TipsPreferences } from "@/lib/handlers/tips-handler";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

import TipContent from "./tip-content";

type Props = {
	tipsPreferences: TipsPreferences;
	handleDontShowAgainChange: (bool: boolean) => void;
};

export default function QuickTips({
	tipsPreferences,
	handleDontShowAgainChange,
}: Props) {
	return (
		<aside className="hidden md:block md:col-span-4">
			<div className="sticky top-4 bg-muted/30 rounded-lg p-4 border border-border/30">
				<h3 className="font-medium text-sm mb-2 flex items-center gap-2">
					<span className="text-primary">💡</span>
					Quick Tips
				</h3>
				<TipContent />
				<div className="flex items-center space-x-2 mt-3 pt-2 border-t border-border/30">
					<Checkbox
						id="dont-show-tips"
						checked={!tipsPreferences.showCreateTallyTips}
						onCheckedChange={handleDontShowAgainChange}
					/>
					<Label
						htmlFor="dont-show-tips"
						className="text-xs text-muted-foreground cursor-pointer"
					>
						Don&apos;t show these tips again
					</Label>
				</div>
			</div>
		</aside>
	);
}
