import { ArrowUpRight, HandCoins, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ParticipantAvatar } from "@/components/common/participant-avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import type { Doc } from "@/convex/_generated/dataModel";
import {
	computeSettlements,
	getParticipantName,
	type SettlementTransfer,
} from "@/lib/helpers/tally.helper";
import ExportCSVButton from "./export-csv-button";

type Props = {
	tally: Doc<"tallies">;
};

export default function SettlementsTab({ tally }: Props) {
	const [searchTerm, setSearchTerm] = useState("");

	const transfers = useMemo<SettlementTransfer[]>(() => {
		return computeSettlements(tally);
	}, [tally]);

	const visibleTransfers = useMemo(() => {
		if (!searchTerm.trim()) return transfers;
		const term = searchTerm.toLowerCase();
		return transfers.filter((t) => {
			const from = getParticipantName(t.fromParticipantId, tally).toLowerCase();
			const to = getParticipantName(t.toParticipantId, tally).toLowerCase();
			return from.includes(term) || to.includes(term);
		});
	}, [transfers, searchTerm, tally]);

	const totalToSettle = useMemo(
		() => visibleTransfers.reduce((s, t) => s + t.amount, 0),
		[visibleTransfers],
	);

	return (
		<TabsContent value="settlements" className="mt-4">
			<Card className="border-border/70 shadow-sm">
				<CardHeader className="pb-3">
					<div className="flex flex-col space-y-2 md:space-y-0 md:flex-row items-start md:items-center justify-between">
						<div>
							<CardTitle className="text-base tracking-tight">
								Settlements
							</CardTitle>
							<CardDescription className="mt-0.5">
								{visibleTransfers.length > 0
									? `${
											visibleTransfers.length
										} transfers • ${totalToSettle.toFixed(2)} total`
									: "Suggested transfers to settle up"}
							</CardDescription>
						</div>
						<ExportCSVButton
							tally={tally}
							transfers={transfers}
							disabled={transfers.length === 0}
						/>
					</div>
					{transfers.length > 6 && (
						<div className="relative mt-3">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
							<Input
								placeholder="Search by payer or receiver..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					)}
				</CardHeader>
				<CardContent className="space-y-4">
					{transfers.length === 0 ? (
						<div className="text-center py-10">
							<HandCoins className="mx-auto text-muted-foreground size-10 mb-3" />
							<div className="space-y-1">
								<h3 className="font-medium text-base">All settled</h3>
								<p className="text-sm text-muted-foreground">
									No transfers needed. Add or edit expenses to update balances.
								</p>
							</div>
						</div>
					) : visibleTransfers.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-sm text-muted-foreground">
								No transfers match "{searchTerm}"
							</p>
						</div>
					) : (
						<ul className="space-y-2">
							{visibleTransfers.map((t) => {
								const fromName = getParticipantName(t.fromParticipantId, tally);
								const toName = getParticipantName(t.toParticipantId, tally);
								return (
									<li
										key={`${t.fromParticipantId}->${t.toParticipantId}:${t.amount}`}
										className="flex items-center justify-between gap-3 py-2"
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="flex items-center gap-2">
												<ParticipantAvatar
													participantName={fromName}
													className="size-7"
												/>
												<ArrowUpRight className="size-4 text-emerald-600" />
												<ParticipantAvatar
													participantName={toName}
													className="size-7"
												/>
											</div>
											<div className="min-w-0">
												<div className="truncate text-sm">
													{fromName} pays {toName}
												</div>
												<div className="truncate text-xs text-muted-foreground">
													Suggested transfer
												</div>
											</div>
										</div>
										<Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
											{t.amount.toFixed(2)}
										</Badge>
									</li>
								);
							})}
						</ul>
					)}
				</CardContent>
			</Card>
		</TabsContent>
	);
}
