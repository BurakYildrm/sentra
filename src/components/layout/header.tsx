"use client";

import { logout } from "@/actions/auth-actions";
import { cn } from "@/utils/tailwind";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ThemeToggle } from "../ui/theme-toggle";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";

import { Tables } from "@/types/database.types";

interface HeaderProps {
  title: string;
  user: Tables<"users"> & { email: string };
  className?: string;
}

export function Header({ title, user, className }: HeaderProps) {
  const handleLogout = async () => {
    toast.loading("Signing out...", {
      id: "logout",
    });

    const result = await logout();

    if (result?.error) {
      toast.error(result.error, {
        id: "logout",
      });
    } else {
      toast.success("Signed out successfully", {
        id: "logout",
      });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-(--header-height) w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 container">
        <div className="flex items-center gap-2">
          <CustomSidebarTrigger className="md:hidden" />
          <Link href="/">
            <h1 className="text-lg font-semibold">{title}</h1>
          </Link>
        </div>
        <div className="flex-row gap-8 hidden md:flex">
          <Link href="users">
            <h2 className="text-md font-medium">Users</h2>
          </Link>
          <Link href="articles">
            <h2 className="text-md font-medium">Articles</h2>
          </Link>
        </div>
        <div className="items-center gap-3 hidden md:flex">
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
              <DropdownMenuLabel>
                {user.name}
                <p className="text-xs">{user.email}</p>
              </DropdownMenuLabel>
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
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
