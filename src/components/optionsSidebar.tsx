import type { SidebarOptionsType } from "@/types/core";
import { Button } from "@/components/ui/button";

export const OptionsSidebar = ({
  options,
  selected,
  onSelect,
}: {
  options: SidebarOptionsType[];
  selected: SidebarOptionsType;
  onSelect: (option: SidebarOptionsType) => void;
}) => (
  <div className="w-72 mt-10 p-6 space-y-2">
    {options.map((category) => (
      <Button
        key={category.id}
        onClick={() => onSelect(category)}
        className={`w-full  bg-transparent hover:bg-transparent justify-start px-3 py-2 rounded ${
          selected.id === category.id
            ? "text-green-500 font-semibold"
            : "text-gray-400 hover:text-white"
        }`}
      >
        {category.label}
      </Button>
    ))}
  </div>
);
