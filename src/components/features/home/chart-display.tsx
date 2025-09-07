"use client";

import { redirect } from "next/navigation";

import { ChartConfig } from "@/components/ui/chart";
import { ChartPie } from "@/components/ui/chart-pie";

export type ChartDisplayProps = {
  data: { name: string; value: number; fill: string }[];
  config: ChartConfig;
};

export function ChartDisplay({ data, config }: ChartDisplayProps) {
  const handleChartClick = (data: {
    name: string;
    value: number;
    fill: string;
  }) => {
    redirect(`/${data.name}`);
  };

  return (
    <ChartPie
      data={data}
      config={config}
      onClick={handleChartClick}
      showIndicator
      showLabel
      className="**:cursor-pointer size-80 md:size-90 lg:size-120"
    />
  );
}
