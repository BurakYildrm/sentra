"use client";

import { ChartPie } from "@/components/ui/chart-pie";
import { redirect } from "next/navigation";

export default function Home() {
  const chartData = [
    { name: "articles", value: 2, fill: "var(--color-articles)" },
    { name: "users", value: 3, fill: "var(--color-users)" },
  ];

  const chartConfig = {
    articles: {
      label: "Articles",
      color: "var(--chart-1)",
    },
    users: {
      label: "Users",
      color: "var(--chart-2)",
    },
  };

  const handleChartClick = (data: {
    name: string;
    value: number;
    fill: string;
  }) => {
    redirect(`/${data.name}`);
  };

  return (
    <main className="flex flex-col items-center gap-3 justify-center">
      <ChartPie
        data={chartData}
        config={chartConfig}
        onClick={handleChartClick}
        showIndicator
        showLabel
        className="size-60 sm:hidden **:cursor-pointer"
      />
      <ChartPie
        data={chartData}
        config={chartConfig}
        onClick={handleChartClick}
        showIndicator
        className="max-sm:hidden sm:size-80 md:size-90 lg:size-120 **:cursor-pointer"
      />
      <p className="text-muted-foreground leading-none">
        Showing total resources
      </p>
    </main>
  );
}
