"use client";

import { cn } from "@/utils/tailwind";
import { Menu } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";

import { Button } from "../ui/button";

export type CustomSidebarTriggerProps = {
  className?: string;
};

export function CustomSidebarTrigger({ className }: CustomSidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-8", className)}
      onClick={toggleSidebar}
    >
      <Menu />
    </Button>
  );
}
