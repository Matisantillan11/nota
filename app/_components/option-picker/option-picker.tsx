import { cn } from "~/utils/cn";
import type { OptionPickerProps } from "./types";

function OptionPicker({
  legend,
  name,
  options,
  value,
  onChange,
  disabled,
}: OptionPickerProps) {
  return (
    <fieldset disabled={disabled} className="flex flex-col gap-3">
      <legend className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "grid h-11 min-w-12 cursor-pointer place-items-center rounded-full border border-border px-4 text-sm transition-colors",
                "hover:border-foreground/40",
                "peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default OptionPicker;
