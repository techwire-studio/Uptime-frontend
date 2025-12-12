import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ResponseTimeStatsType } from "@/types/monitor";
import { Activity, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export function ResponseTimeGraph({
  responseStats,
}: {
  responseStats: ResponseTimeStatsType;
}) {
  const { min, max, avg, chartData } = responseStats;

  const chartConfig = {
    response_time: {
      label: "Response Time (ms)",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="p-4 my-10 bg-primary text-white border-0 rounded-xl">
      <CardHeader className="flex my-4 flex-col items-stretch border-0 p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Response Time</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="response_time"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })
                  }
                />
              }
            />

            <Line
              dataKey="response_time"
              type="natural"
              stroke={`var(--color-response_time)`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 px-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Activity className="text-gray-300" size={18} />
              <span>{avg}</span>
            </div>

            <span className="text-sm opacity-70 mt-1">Average</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <ArrowDownToLine className="text-green-500" size={18} />
              <span>{min}</span>
            </div>

            <span className="text-sm opacity-70 mt-1">Minimum</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <ArrowUpFromLine className="text-red-500" size={18} />
              <span>{max}</span>
            </div>

            <span className="text-sm opacity-70 mt-1">Maximum</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
