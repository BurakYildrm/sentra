import { Tables } from "./database.types";

export type User = Tables<"users"> & { role?: Tables<"user_roles">["role"] };

export type UsersSelectFn = () => Promise<{
  data: any[] | null;
  error: { message: string } | null;
}>;

export type UserRolesSelectFn = () => Promise<{
  data: any[] | null;
  error: { message: string } | null;
}>;

export type UsersInsertFn = (data: any) => Promise<{
  error: { message: string } | null;
}>;

export type UserRolesInsertFn = (data: any) => Promise<{
  error: { message: string } | null;
}>;

export type UsersUpdateFn = (
  data: any,
  id: string,
) => Promise<{
  error: { message: string } | null;
}>;

export type UserRolesUpdateFn = (
  data: any,
  userId: string,
) => Promise<{
  error: { message: string } | null;
}>;

export type AuthCreateUserFn = (data: any) => Promise<{
  data: { user: any } | null;
  error: { message: string } | null;
}>;

export type AuthDeleteUserFn = (id: string) => Promise<{
  error: { message: string } | null;
}>;

export type AuthRefreshSessionFn = () => Promise<void>;
