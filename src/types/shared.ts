export type Permission = "insert" | "update" | "delete";
export type Can = (action: Permission) => boolean;
export type CoreResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };
