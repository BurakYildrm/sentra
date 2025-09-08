import { Can, Permission } from "@/types/shared";

export function canPerform(perms: Array<Permission>): Can {
  const allowed = new Set(perms ?? []);
  return (action: Permission) => allowed.has(action);
}
