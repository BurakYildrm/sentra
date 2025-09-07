"use client";

import { logout } from "@/actions/auth-actions";
import { LogOutIcon, Newspaper, Users } from "lucide-react";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback } from "../ui/avatar";

import { Tables } from "@/types/database.types";

const items = [
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Articles",
    url: "/articles",
    icon: Newspaper,
  },
];

export function AppSidebar({
  user,
}: {
  user: Tables<"users"> & { email: string };
}) {
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
    <Sidebar className="md:hidden">
      <SidebarHeader>
        <div className="flex flex-row gap-2 items-center">
          <Avatar>
            <AvatarFallback>
              {(user.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs">{user.email}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <LogOutIcon />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
