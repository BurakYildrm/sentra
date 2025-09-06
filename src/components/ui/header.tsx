"use client";

import * as React from "react";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback } from "./avatar";
import { cn } from "@/utils/tailwind";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { Tables } from "@/types/database.types";
import { logout } from "@/actions/auth-actions";
import { toast } from "sonner";
import Link from "next/link";

interface HeaderProps {
  title: string;
  user: Tables<"users">;
  className?: string;
}

export function Header({ title, user, className }: HeaderProps) {
  const handleLogout = () => {
    logout();
    toast.loading("Signing out...");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-(--header-height) w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 container">
        <div className="flex items-center gap-2">
          <Link href="/">
            <h1 className="text-lg font-semibold">{title}</h1>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger
              className="cursor-pointer focus:outline-none"
              asChild
            >
              <Avatar>
                <AvatarFallback>
                  {(user.name || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LogOutIcon className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
