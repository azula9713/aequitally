import {
  ChevronDown,
  DollarSign,
  Equal,
  Hash,
  Info,
  Percent,
  SlidersHorizontal
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  CustomValuesProps,
  ShareMethod,
  ShareMethodProps
} from "@/lib/types/tally";

type Props = {
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  onShareMethodChange: (method: ShareMethod) => void;
  selectedParticipants: string[];
} & ShareMethodProps &
  CustomValuesProps;

export function AdvancedSplitOptions({
  showAdvanced,
  onToggleAdvanced,
  shareMethod,
  onShareMethodChange,
  selectedParticipants,
  customShares,
  customPercentages,
  customAmounts
}: Props & ShareMethodProps & CustomValuesProps) {
  const computeSharesTotal = () => {
    return selectedParticipants.reduce(
      (sum, id) => sum + (customShares[id] || 0),
      0
    );
  };

  const computePercentTotal = () => {
    return selectedParticipants.reduce(
      (sum, id) => sum + (customPercentages[id] || 0),
      0
    );
  };

  const computeCustomTotalCents = () => {
    return selectedParticipants.reduce(
      (sum, id) => sum + Math.round((customAmounts[id] || 0) * 100),
      0
    );
  };

  const methodMeta: Record<string, { label: string; helper: string }> = {
    equal: { label: "Equal", helper: "Split evenly between selected" },
    shares: { label: "Shares", helper: "Allocate weight-based shares" },
    percentage: { label: "Percent", helper: "Distribute by percentages" },
    "exact-amounts": {
      label: "Custom",
      helper: "Assign exact currency amounts"
    }
  };

  return (
    <div className="rounded-md border bg-muted/30 dark:bg-muted/20 px-3 py-2 md:p-3 space-y-2">
      <button
        type="button"
        onClick={onToggleAdvanced}
        aria-expanded={showAdvanced}
        className="w-full flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-2 text-left">
          <span
            className={
              "inline-flex items-center justify-center rounded-md bg-primary/10 text-primary p-1 transition-colors group-hover:bg-primary/15" +
              (showAdvanced ? " ring-1 ring-primary/40" : "")
            }
          >
            <SlidersHorizontal className="size-4" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-xs md:text-sm font-medium">
              Advanced split
              <span
                className={`ml-2 hidden sm:inline text-[10px] md:text-xs rounded-full px-2 py-0.5 capitalize transition-colors border ${
                  showAdvanced
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-background/60 border-border text-foreground/70"
                }`}
              >
                {shareMethod === "percentage"
                  ? "%"
                  : shareMethod === "exact-amounts"
                    ? "Custom"
                    : shareMethod === "equal"
                      ? "Equal"
                      : shareMethod}
              </span>
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">
              {showAdvanced
                ? "Choose method & fine-tune participant shares"
                : "Optional: adjust how the cost is split"}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`size-4 shrink-0 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
        />
      </button>
      {!showAdvanced && (
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground pl-1">
          <Info className="size-3" />
          <span className="truncate">{methodMeta[shareMethod].helper}</span>
        </div>
      )}

      {showAdvanced && (
        <div className="space-y-3 animate-in fade-in-50 slide-in-from-top-1">
          <TooltipProvider delayDuration={150}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
              {(
                [
                  { key: "equal", label: "Equal", icon: Equal },
                  { key: "shares", label: "Shares", icon: Hash },
                  { key: "percentage", label: "Percent", icon: Percent },
                  { key: "exact-amounts", label: "Custom", icon: DollarSign }
                ] as const
              ).map(({ key, label, icon: Icon }) => {
                const active = shareMethod === key;
                return (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={active ? "default" : "outline"}
                        onClick={() => onShareMethodChange(key)}
                        className={`h-16 sm:h-14 flex flex-col gap-1 text-xs sm:text-[11px] font-medium relative focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none ${
                          active ? "shadow-sm" : ""
                        }`}
                        aria-pressed={active}
                        aria-label={`${label} split method`}
                      >
                        <Icon className="size-5" />
                        <span>{label}</span>
                        {active && (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-[160px] text-xs"
                    >
                      {methodMeta[key].helper}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
          <div aria-live="polite" className="min-h-[1rem]">
            {shareMethod !== "equal" && (
              <div className="text-[11px] md:text-xs text-muted-foreground flex gap-4 flex-wrap">
                {shareMethod === "percentage" && (
                  <span
                    className={
                      computePercentTotal() === 100
                        ? "text-green-600"
                        : "text-amber-600"
                    }
                  >
                    Total {computePercentTotal()}%
                    {computePercentTotal() !== 100 && " (must be 100%)"}
                  </span>
                )}
                {shareMethod === "shares" && (
                  <span>Total shares {computeSharesTotal()}</span>
                )}
                {shareMethod === "exact-amounts" && (
                  <span>
                    Total ${(computeCustomTotalCents() / 100).toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
