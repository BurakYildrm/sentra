"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAllUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select("*");
  return { data, error };
}
