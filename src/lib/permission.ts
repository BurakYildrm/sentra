import { Can } from "@/types/permission";

export function canPerform(perms: Array<"insert" | "update" | "delete">): Can {
  const allowed = new Set(perms ?? []);
  return (action: "insert" | "update" | "delete") => allowed.has(action);
}
