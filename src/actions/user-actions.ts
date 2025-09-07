"use server";

import { createClient as createClientAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

import { Tables } from "@/types/database.types";
import {
  CreateUserInputSchema,
  DeleteUserInputSchema,
  UpdateUserInputSchema,
} from "@/types/validation-schemas";

export async function getAllUsers() {
  const supabase = await createClient();
  const usersPromise = supabase.from("users").select("*");
  const UserRolesPromise = supabase.from("user_roles").select("*");
  const [users, userRoles] = await Promise.all([
    usersPromise,
    UserRolesPromise,
  ]);

  if (users.error || userRoles.error) {
    return { error: users.error || userRoles.error };
  }

  const usersWithRoles = users.data.map((user) => {
    return {
      ...user,
      role: userRoles.data.find((role) => role.user_id === user.id)?.role,
    };
  });

  return { data: usersWithRoles, error: null };
}

export async function deleteUser(data: unknown) {
  const { data: id, error } = DeleteUserInputSchema.safeParse(data);

  if (error) {
    return { error };
  }

  const supabase = await createClient();
  const { data: rolePermissions } = await supabase.rpc(
    "get_table_permissions",
    {
      p_table: "users",
    },
  );

  if (!rolePermissions.includes("delete")) {
    return { error: new Error("You are not authorized to delete this user") };
  }

  const admin = await createClientAdmin();
  const { error: authError } = await admin.auth.admin.deleteUser(id);

  if (authError) {
    return { authError };
  }

  return { error: null };
}

export async function createUser(data: unknown) {
  const { data: user, error: zodError } = CreateUserInputSchema.safeParse(data);

  if (zodError) {
    return { error: zodError };
  }

  const supabase = await createClient();
  const { data: rolePermissions } = await supabase.rpc(
    "get_table_permissions",
    {
      p_table: "users",
    },
  );

  if (!rolePermissions.includes("insert")) {
    return { error: new Error("You are not authorized to create a user") };
  }

  const admin = await createClientAdmin();
  const {
    data: { user: newUser },
    error: authError,
  } = await admin.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
  });

  if (authError) {
    return { authError };
  }

  const { error: usersError } = await supabase.from("users").insert({
    id: newUser?.id,
    name: user.name,
  });

  if (usersError) {
    return { usersError };
  }

  const { error: userRolesError } = await supabase.from("user_roles").insert({
    user_id: newUser?.id,
    role: user.role,
  });

  if (userRolesError) {
    return { userRolesError };
  }

  return { error: null };
}

function pick<T, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K,
): Pick<T, K[number]> {
  const out = {} as Pick<T, K[number]>;
  for (const k of keys) out[k] = obj[k];
  return out;
}

export async function updateUser(
  data: unknown,
  // user: Tables<"users"> & { role: Tables<"user_roles">["role"] },
  // fieldsToUpdate: string[],
) {
  const { data: zodData, error: zodError } =
    UpdateUserInputSchema.safeParse(data);

  if (zodError) {
    return { error: zodError };
  }

  const { user, fieldsToUpdate } = zodData;

  if (fieldsToUpdate.length === 0) {
    return { error: new Error("No fields to update") };
  }

  const promises = [];
  const supabase = await createClient();
  const { data: rolePermissions } = await supabase.rpc(
    "get_table_permissions",
    {
      p_table: "users",
    },
  );

  if (!rolePermissions.includes("update")) {
    return { error: new Error("You are not authorized to update this user") };
  }

  if (fieldsToUpdate.includes("role")) {
    const userRolesPromise = supabase
      .from("user_roles")
      .update({
        role: user.role,
      })
      .eq("user_id", user.id);

    promises.push(userRolesPromise);
    delete fieldsToUpdate[fieldsToUpdate.indexOf("role")];
  }

  if (fieldsToUpdate.length >= 1) {
    const usersPromise = supabase
      .from("users")
      .update(pick(user, fieldsToUpdate as (keyof Tables<"users">)[]))
      .eq("id", user.id);

    promises.push(usersPromise);
  }

  const result = await Promise.all(promises);

  if (result.some((result) => result.error)) {
    return { error: result.find((result) => result.error)?.error };
  }

  await supabase.auth.refreshSession();
  return { error: null };
}
