"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { loginCore, logoutCore } from "@/lib/auth-core";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = await loginCore(
    (args) => supabase.auth.signInWithPassword(args),
    data
  );
  // const { error } = await supabase.auth.signInWithPassword(data);

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  const result = await logoutCore(() => supabase.auth.signOut());

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/login", "layout");
  redirect("/login");
}
