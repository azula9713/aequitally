import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId, useState } from "react";

import { ParticipantAvatar } from "@/components/common/participant-avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Doc } from "@/convex/_generated/dataModel";
// import { Doc } from "@/convex/_generated/dataModel";
import { useExpenseForm } from "@/hooks/use-expense-form";
import { cn } from "@/lib/utils";
import { AdvancedSplitOptions, ParticipantSelector } from "./index";

type Props = {
	addExpenseOpen: boolean;
	setAddExpenseOpen: (open: boolean) => void;
	editingExpense?: boolean;
	tally: Doc<"tallies">;
	userId?: string;
	defaultPaidBy?: string;
	expense?: Doc<"tallies">["expenses"][number] | null;
};

export default function ExpenseModal({
	addExpenseOpen,
	setAddExpenseOpen,
	editingExpense = false,
	tally,
	userId,
	defaultPaidBy,
	expense = null,
}: Props) {
	const formId = useId();
	const expenseDateId = useId();
	const tallyDateId = useId();

	const [datePickerOpen, setDatePickerOpen] = useState(false);

	const {
		form,
		showAdvanced,
		toggleAdvanced,
		selectedParticipants,
		shareMethod,
		customShares,
		customPercentages,
		customAmounts,
		onSelectionChangeParticipants,
		onShareMethodChange,
		onCustomSharesChange,
		onCustomPercentagesChange,
		onCustomAmountsChange,
		isSubmitDisabled,
		onSubmit,
		resetExpenseForm,
	} = useExpenseForm({
		tally,
		userId,
		defaultPaidBy,
		addExpenseOpen,
		setAddExpenseOpen,
		editingExpense,
		expense,
	});

	const expenseDate = form.watch("date");

	return (
		<Dialog
			open={addExpenseOpen}
			onOpenChange={(open) => {
				setAddExpenseOpen(open);
				if (!open) {
					resetExpenseForm();
				}
			}}
		>
			<DialogContent className="max-h-[92vh] max-w-[97vw] sm:max-w-xl md:max-w-3xl w-full overflow-hidden p-0 flex flex-col">
				<div className="px-4 pt-4 pb-2 border-b">
					<DialogHeader>
						<DialogTitle className="text-base md:text-lg font-semibold tracking-tight">
							{editingExpense ? "Edit expense" : "Add expense"}
						</DialogTitle>
					</DialogHeader>
				</div>
				<Form {...form}>
					<form
						id={formId}
						onSubmit={onSubmit}
						className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6 py-4 space-y-6 min-w-0"
					>
						<div className="space-y-5">
							<div className="grid gap-3 md:gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] min-w-0 items-start">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>What was this expense for?</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Dinner, Gas, Hotel"
													autoFocus
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="amount"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Amount</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													min="0"
													placeholder="0.00"
													value={field.value ?? ""}
													onChange={(e) => {
														const v = e.currentTarget.value;
														const n =
															v === "" ? undefined : Number.parseFloat(v);
														field.onChange(
															Number.isNaN(n as number) ? undefined : n,
														);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid gap-3 md:gap-4 sm:grid-cols-2 min-w-0 items-start">
								<FormField
									control={form.control}
									name="paidBy"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Who paid?</FormLabel>
											<Select
												value={field.value ?? ""}
												onValueChange={field.onChange}
											>
												<SelectTrigger className="min-h-10">
													<SelectValue placeholder="Select who paid" />
												</SelectTrigger>
												<SelectContent>
													{tally.participants.map((participant) => (
														<SelectItem
															key={participant.userId}
															value={participant.userId}
														>
															<div className="flex items-center gap-2">
																<ParticipantAvatar
																	participantName={participant.name}
																	className="size-5"
																/>
																{participant.name}
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="min-w-0 space-y-2">
									<ParticipantSelector
										participants={tally.participants}
										selectedParticipants={selectedParticipants}
										onSelectionChange={onSelectionChangeParticipants}
										showAdvanced={showAdvanced}
										shareMethod={shareMethod}
										customShares={customShares}
										customPercentages={customPercentages}
										customAmounts={customAmounts}
										onCustomSharesChange={onCustomSharesChange}
										onCustomPercentagesChange={onCustomPercentagesChange}
										onCustomAmountsChange={onCustomAmountsChange}
									/>
								</div>
							</div>

							<AdvancedSplitOptions
								showAdvanced={showAdvanced}
								onToggleAdvanced={toggleAdvanced}
								shareMethod={shareMethod}
								onShareMethodChange={onShareMethodChange}
								selectedParticipants={selectedParticipants}
								customShares={customShares}
								customPercentages={customPercentages}
								customAmounts={customAmounts}
							/>

							{showAdvanced && (
								<div className="space-y-5 rounded-md border border-dashed p-3 md:p-4 bg-muted/20 min-w-0">
									<div className="grid gap-3 md:gap-4 sm:grid-cols-2 min-w-0">
										<div className="space-y-2">
											<Label htmlFor="expense-date">Date</Label>
											<Popover
												open={datePickerOpen}
												onOpenChange={setDatePickerOpen}
											>
												<PopoverTrigger asChild>
													<Button
														id={expenseDateId}
														variant="outline"
														className={cn(
															"w-full h-9 justify-start text-left font-normal bg-transparent hover:bg-accent hover:text-accent-foreground",
															!expenseDate && "text-muted-foreground",
														)}
													>
														<CalendarIcon className="mr-2 size-4" />
														{expenseDate
															? format(expenseDate, "PPP")
															: "Select date"}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														id={tallyDateId}
														mode="single"
														selected={expenseDate}
														onSelect={(selectedDate) => {
															form.setValue("date", selectedDate, {
																shouldValidate: true,
															});
															setDatePickerOpen(false);
														}}
														className="w-auto"
													/>
												</PopoverContent>
											</Popover>
										</div>
										<FormField
											control={form.control}
											name="tags"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Tags (comma-separated)</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., team,work,groupA"
															value={field.value || ""}
															onChange={field.onChange}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-3 md:gap-4 sm:grid-cols-2 min-w-0">
										<FormField
											control={form.control}
											name="merchant"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Merchant</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Starbucks"
															value={field.value || ""}
															onChange={field.onChange}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="location"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Location</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., San Francisco, CA"
															value={field.value || ""}
															onChange={field.onChange}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-3 md:gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="receiptUrl"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Receipt URL</FormLabel>
													<FormControl>
														<Input
															type="url"
															placeholder="https://..."
															value={field.value || ""}
															onChange={field.onChange}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="paymentMethod"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Payment method</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Cash, Card, UPI"
															value={field.value || ""}
															onChange={field.onChange}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-3 md:gap-4 sm:grid-cols-3 min-w-0">
										<FormField
											control={form.control}
											name="tax"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Tax</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															min="0"
															placeholder="0.00"
															value={field.value ?? ""}
															onChange={(e) => {
																const v = e.currentTarget.value;
																const n =
																	v === "" ? undefined : Number.parseFloat(v);
																field.onChange(
																	Number.isNaN(n as number) ? undefined : n,
																);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="tip"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Tip</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															min="0"
															placeholder="0.00"
															value={field.value ?? ""}
															onChange={(e) => {
																const v = e.currentTarget.value;
																const n =
																	v === "" ? undefined : Number.parseFloat(v);
																field.onChange(
																	Number.isNaN(n as number) ? undefined : n,
																);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="serviceFee"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Service fee</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															min="0"
															placeholder="0.00"
															value={field.value ?? ""}
															onChange={(e) => {
																const v = e.currentTarget.value;
																const n =
																	v === "" ? undefined : Number.parseFloat(v);
																field.onChange(
																	Number.isNaN(n as number) ? undefined : n,
																);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Input
														placeholder="Add any notes or details..."
														value={field.value || ""}
														onChange={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}
						</div>
						<div className="h-2" />
					</form>
				</Form>
				<div className="mt-auto px-4 md:px-6 py-3 border-t flex flex-col gap-3 sm:flex-row sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							setAddExpenseOpen(false);
							resetExpenseForm();
						}}
						className="w-full sm:w-auto"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						form={formId}
						disabled={isSubmitDisabled}
						className="w-full sm:flex-1"
					>
						{editingExpense ? "Update expense" : "Save expense"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
