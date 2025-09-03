"use client";

import { useMutation } from "convex/react";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CreateForm from "@/components/home/create-form";
import MobileTips from "@/components/home/mobile-tips";
import QuickTips from "@/components/home/quick-tips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import useTipsPreferences from "@/hooks/use-tips-preference";
import type { Participant } from "@/lib/types/tally";
import { cn } from "@/lib/utils";

export default function Home() {
	const router = useRouter();
	const {
		preferences: tipsPreferences,
		updatePreferences,
		isLoaded,
	} = useTipsPreferences();
	const createTally = useMutation(api.tally.createTally);
	const showTips = isLoaded && tipsPreferences.showCreateTallyTips;

	const [showTipsMobile, setShowTipsMobile] = useState(false);
	const [tallyName, setTallyName] = useState("");
	const [numParticipants, setNumParticipants] = useState("4");
	const [tallyDate, setTallyDate] = useState<Date | undefined>(undefined);
	const [description, setDescription] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const handleDontShowAgainChange = (checked: boolean) => {
		updatePreferences((prev) => ({
			...prev,
			showCreateTallyTips: !checked,
		}));
	};

	const createParticipants = (numParts: number) => {
		const participants: Participant[] = [];

		for (let i = 0; i < numParts; i++) {
			const participantNumber = i + 1;
			participants.push({
				userId: uuidv4(),
				name: `Participant ${participantNumber}`,
			});
		}

		return participants;
	};

	const buildTallyObject = (participants: Participant[]) => {
		return {
			name: tallyName.trim(),
			description: description || undefined,
			date: tallyDate ? tallyDate.toISOString() : undefined,
			participants,
			expenses: [],
		};
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsCreating(true);
		try {
			// Clamp participants between 2 and 20 for safety
			const parsed = parseInt(numParticipants);
			const numParts = Math.min(20, Math.max(2, isNaN(parsed) ? 2 : parsed));
			const participants = createParticipants(numParts);
			const tallyObject = buildTallyObject(participants);

			const createdTally = await createTally({
				createData: tallyObject,
			});
			setIsCreating(false);
			router.push(`/tally/${createdTally}`);
		} catch (error) {
			console.error("Failed to create tally", error);
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="max-w-5xl mx-auto p-4 2xl:py-12">
			<div className="space-y-4 2xl:space-y-8">
				<div className="text-center space-y-3 2xl:space-y-6">
					<div className="flex items-center justify-center space-x-2 mb-2">
						<div className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary size-12">
							<Plus className="size-6" />
						</div>
						<h1 className="text-2xl font-semibold tracking-tight">
							Create New Tally
						</h1>
					</div>
					<p className="text-muted-foreground text-sm max-w-md mx-auto">
						Set up a new expense tally to track shared costs with your group
					</p>
				</div>
				{showTips && (
					<MobileTips
						{...{
							setShowTipsMobile,
							showTipsMobile,
							tipsPreferences,
							handleDontShowAgainChange,
						}}
					/>
				)}
				<div className="md:grid md:grid-cols-12 md:gap-6">
					<div className={cn("md:col-span-8", !showTips && "md:col-start-3")}>
						<Card className="border-border/50 shadow-sm gap-4">
							<CardHeader>
								<CardTitle className="flex items-center space-x-2 text-lg">
									<FileText className="text-primary size-5" />
									<span>Tally Details</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0 px-4 md:px-6">
								<CreateForm
									{...{
										tallyName,
										setTallyName,
										numParticipants,
										setNumParticipants,
										tallyDate,
										setTallyDate,
										description,
										setDescription,
										submitHandler: handleSubmit,
										isLoading: isCreating,
									}}
								/>
							</CardContent>
						</Card>
					</div>
					{showTips && (
						<QuickTips {...{ handleDontShowAgainChange, tipsPreferences }} />
					)}
				</div>
			</div>
		</div>
	);
}
