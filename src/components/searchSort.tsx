import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Check, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface IncidentControlsProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  debouncedSetSearchTerm: (value: string) => void;
  selected: string;
  placeholder?: string;
  setSelected: (value: string) => void;
  sortOptions: string[];
  containerClass?: string;
}

export const SearchSort: React.FC<IncidentControlsProps> = ({
  inputValue,
  setInputValue,
  debouncedSetSearchTerm,
  selected,
  setSelected,
  sortOptions,
  placeholder = "Search by monitor or reason",
  containerClass = "",
}) => {
  return (
    <div className={`flex items-center gap-3 ${containerClass}`}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={16}
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            debouncedSetSearchTerm(e.target.value);
          }}
          className="bg-gray-800/50 border border-gray-700 pl-10 w-64"
        />
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-md px-2 h-9 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} />
              {selected}
              <ChevronDown size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => setSelected(option)}
                className="flex justify-between"
              >
                {option}
                {selected === option && <Check className="text-green-400" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
