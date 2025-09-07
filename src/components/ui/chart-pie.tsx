"use client";

import { cn } from "@/utils/tailwind";
import { LabelList, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PieChartLabelProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
  config: ChartConfig;
  onClick?: (data: { name: string; value: number; fill: string }) => void;
  className?: string;
  showLabel?: boolean;
  showIndicator?: boolean;
}

// export const PieChartLabel = React.memo(
//   ({ data, config, onClick, className }: PieChartLabelProps) => {
//     return (
//       <ChartContainer
//         config={config}
//         className={cn(
//           "[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square pb-0",
//           className
//         )}
//       >
//         <PieChart>
//           <ChartTooltip content={<ChartTooltipContent hideLabel />} />
//           <Pie
//             data={data}
//             dataKey="value"
//             label
//             nameKey="name"
//             onClick={onClick}
//           />
//         </PieChart>
//       </ChartContainer>
//     );
//   }
// );

export function ChartPie({
  data,
  config,
  onClick,
  className,
  showLabel = false,
  showIndicator = false,
}: PieChartLabelProps) {
  return (
    <ChartContainer
      config={config}
      className={cn(
        "[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square pb-0",
        className,
      )}
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        {showLabel ? (
          <Pie
            data={data}
            dataKey="value"
            label={showIndicator}
            nameKey="name"
            onClick={onClick}
          >
            <LabelList
              dataKey="name"
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(value: keyof typeof config) => config[value]?.label}
            />
          </Pie>
        ) : (
          <Pie
            data={data}
            dataKey="value"
            label={showIndicator}
            nameKey="name"
            onClick={onClick}
          />
        )}
      </PieChart>
    </ChartContainer>
  );
}
