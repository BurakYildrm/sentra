"use server";

import { canPerform } from "@/lib/shared";
import {
  createUserCore,
  deleteUserCore,
  listUsersCore,
  updateUserCore,
} from "@/lib/user-core";
import { createClient as createClientAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

import {
  CreateUserInputSchema,
  DeleteUserInputSchema,
  UpdateUserInputSchema,
} from "@/types/validation";

export async function getAllUsers() {
  const supabase = await createClient();

  const result = await listUsersCore(
    async () => await supabase.from("users").select("*"),
    async () => await supabase.from("user_roles").select("*"),
  );

  if (!result.ok) {
    return { error: result.error };
  }

  return { data: result.data, error: null };
}

export async function deleteUser(data: unknown) {
  const { data: id, error } = DeleteUserInputSchema.safeParse(data);

  if (error) {
    return { error: error.message };
  }

  const supabase = await createClient();
  const { data: rolePermissions } = await supabase.rpc(
    "get_table_permissions",
    {
      p_table: "users",
    },
  );

  const admin = await createClientAdmin();

  const result = await deleteUserCore(
    canPerform(rolePermissions),
    id,
    (userId) => admin.auth.admin.deleteUser(userId),
  );

  if (!result.ok) {
    return { error: result.error };
  }

  return { error: null };
}

export async function createUser(data: unknown) {
  const { data: user, error: zodError } = CreateUserInputSchema.safeParse(data);

  if (zodError) {
    return { error: zodError.message };
  }

  const supabase = await createClient();
  const { data: rolePermissions } = await supabase.rpc(
    "get_table_permissions",
    {
      p_table: "users",
    },
  );

  const admin = await createClientAdmin();

  const result = await createUserCore(
    canPerform(rolePermissions),
    user,
    async (userData) =>
      await admin.auth.admin.createUser({ ...userData, email_confirm: true }),
    async (userData) => await supabase.from("users").insert(userData),
    async (userData) => await supabase.from("user_roles").insert(userData),
  );

  if (!result.ok) {
    return { error: result.error };
  }

  return { error: null };
}

export async function updateUser(data: unknown) {
  const { data: zodData, error: zodError } =
    UpdateUserInputSchema.safeParse(data);

  if (zodError) {
    return { error: zodError.message };
  }

  const supabase = await createClient();
  const { data: rolePermissions } = await supabase.rpc(
    "get_table_permissions",
    {
      p_table: "users",
    },
  );

  const result = await updateUserCore(
    canPerform(rolePermissions),
    zodData,
    async (userData, id) =>
      await supabase.from("users").update(userData).eq("id", id),
    async (roleData, userId) =>
      await supabase.from("user_roles").update(roleData).eq("user_id", userId),
    async () => {
      await supabase.auth.refreshSession();
    },
  );

  if (!result.ok) {
    return { error: result.error };
  }

  return { error: null };
}
