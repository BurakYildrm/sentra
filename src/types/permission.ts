export type Permission = "insert" | "update" | "delete";
export type Can = (action: Permission) => boolean;
