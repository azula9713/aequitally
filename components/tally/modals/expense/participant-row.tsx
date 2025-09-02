import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  CustomValuesProps,
  Participant,
  ShareMethodProps
} from "@/lib/types/tally";

import { ParticipantAvatar } from "../../../common/participant-avatar";

export function ParticipantRow({
  participant,
  checked,
  onToggle,
  showAdvanced,
  shareMethod,
  customShares,
  customPercentages,
  customAmounts,
  onCustomSharesChange,
  onCustomPercentagesChange,
  onCustomAmountsChange
}: {
  participant: Participant;
  checked: boolean;
  onToggle: () => void;
} & ShareMethodProps &
  CustomValuesProps & {
    onCustomSharesChange: (value: number) => void;
    onCustomPercentagesChange: (value: number) => void;
    onCustomAmountsChange: (value: number) => void;
  }) {
  return (
    <div
      className="flex min-w-0 items-center gap-2 px-3 py-2 text-sm hover:bg-accent/60 cursor-pointer transition-colors"
      onClick={onToggle}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onToggle}
        onClick={(e) => e.stopPropagation()}
      />
      <ParticipantAvatar participant={participant} className="h-6 w-6" />
      <span className="font-medium flex-1 min-w-0 truncate">
        {participant.name}
      </span>

      {showAdvanced && checked && shareMethod !== "equal" && (
        <div className="ml-auto flex flex-wrap items-center gap-1 text-xs">
          {shareMethod === "shares" && (
            <AutoSizeNumberInput
              value={customShares[participant.userId]}
              placeholder=""
              min={0}
              step={1}
              onChange={(v) =>
                onCustomSharesChange(Math.max(0, Math.floor(v || 0)))
              }
            />
          )}
          {shareMethod === "percentage" && (
            <div className="flex items-center gap-1">
              <AutoSizeNumberInput
                value={customPercentages[participant.userId]}
                placeholder=""
                min={0}
                max={100}
                step={1}
                onChange={(v) =>
                  onCustomPercentagesChange(
                    Math.max(0, Math.min(100, Math.floor(v || 0)))
                  )
                }
              />
              <span className="text-xs">%</span>
            </div>
          )}
          {shareMethod === "exact-amounts" && (
            <div className="flex items-center gap-1">
              <span className="text-[10px]">$</span>
              <AutoSizeNumberInput
                value={customAmounts[participant.userId]}
                placeholder=""
                min={0}
                step={0.01}
                decimals
                onChange={(v) => onCustomAmountsChange(Math.max(0, v || 0))}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AutoSizeNumberInput({
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  decimals = false
}: {
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  decimals?: boolean;
}) {
  const display = value && value !== 0 ? String(value) : "";
  const charCount = Math.min(
    24,
    Math.max(
      (display.length || 0) + 1 + (decimals && display.includes(".") ? 1 : 0),
      2
    )
  );
  return (
    <Input
      type="number"
      inputMode={decimals ? "decimal" : "numeric"}
      className="h-7 px-2 text-xs tabular-nums flex-none w-auto inline-block align-middle [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      size={charCount}
      value={display}
      placeholder={placeholder || ""}
      min={min}
      max={max}
      step={step}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onFocus={(e) => e.stopPropagation()}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          onChange(undefined);
          return;
        }
        const parsed = decimals ? parseFloat(raw) : parseInt(raw, 10);
        if (Number.isNaN(parsed)) {
          onChange(undefined);
          return;
        }
        onChange(parsed);
      }}
    />
  );
}
