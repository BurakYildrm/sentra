"use server";

import { loginCore, logoutCore } from "@/lib/auth-core";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { SignInInputSchema } from "@/types/validation";

export async function login(data: unknown) {
  const { data: signInData, error } = SignInInputSchema.safeParse(data);

  if (error) {
    return { error: error.message };
  }

  const supabase = await createClient();
  const result = await loginCore(
    (args) => supabase.auth.signInWithPassword(args),
    signInData,
  );

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  const result = await logoutCore(() => supabase.auth.signOut());

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/login", "layout");
  redirect("/login");
}
