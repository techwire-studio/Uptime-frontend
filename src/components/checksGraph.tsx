import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Check {
  date: string;
  success: boolean;
}

interface ChecksGraphProps {
  checks: Check[];
  barClassName?: string;
}

export function ChecksGraph({
  checks,
  barClassName = "h-5 w-2",
}: ChecksGraphProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex gap-1 items-end w-full">
        {checks.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className={`
                  rounded-full shrink-0 cursor-pointer
                  ${item.success ? "bg-green-500" : "bg-red-500"}
                  ${barClassName}
                `}
              />
            </TooltipTrigger>

            <TooltipContent className="bg-gray-800 text-white text-xs p-2.5 rounded shadow-lg whitespace-nowrap">
              <span className="block mb-1">
                {new Date(item.date).toLocaleString()}
              </span>
              <span className="block">{item.success ? "Upto 100%" : "0%"}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
