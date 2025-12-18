import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value: string[];
  disabled?: boolean;
  placeholder?: string;
  onChange: (values: string[]) => void;
};

const MultiSelectDropdown = ({
  options,
  value,
  disabled,
  placeholder = "Select notify event(s)",
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    const exists = value.includes(optionValue);
    const updated = exists
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onChange(updated);
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  return (
    <div className="relative w-[280px]">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-md border border-[#2a3441] bg-[#0f1419] px-3 py-2 text-sm text-white disabled:opacity-60"
      >
        <span className="truncate">{selectedLabels || placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>

      {open && !disabled && (
        <div className="absolute right-0 z-50 mt-2 w-full rounded-md border border-[#2a3441] bg-[#1a2332] shadow-lg">
          {options.map((option) => {
            const checked = value.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-white hover:bg-[#2a3441]"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded border border-gray-500">
                  {checked && <Check className="h-3 w-3 text-blue-400" />}
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
