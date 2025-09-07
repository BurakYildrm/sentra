"use server";

import {
  createArticleCore,
  deleteArticleCore,
  listArticlesCore,
  updateArticleCore,
} from "@/lib/article-core";
import { canPerform } from "@/lib/shared";
import { createClient } from "@/utils/supabase/server";

import { Tables } from "@/types/database.types";
import {
  CreateArticleInputSchema,
  DeleteArticleInputSchema,
  UpdateArticleInputSchema,
} from "@/types/validation";

export async function getAllArticles() {
  const supabase = await createClient();
  const result = await listArticlesCore(async () => {
    const { data, error } = await supabase.from("articles").select("*");
    return { data, error };
  });

  if (!result.ok) {
    return { error: result.error };
  }

  return { data: result.data as Tables<"articles">[], error: null };
}

export async function createArticle(data: unknown) {
  const { data: article, error } = CreateArticleInputSchema.safeParse(data);

  if (error) {
    return { error: error.message };
  }

  const supabase = await createClient();
  const { data: rolePermissions } = await supabase.rpc(
    "get_table_permissions",
    {
      p_table: "articles",
    },
  );
  const result = await createArticleCore(
    async (args) => {
      const { error } = await supabase.from("articles").insert(args);
      return { error };
    },
    canPerform(rolePermissions),
    article,
  );

  if (!result.ok) {
    return { error: result.error };
  }

  return { error: null };
}

export async function deleteArticle(data: unknown) {
  const { data: id, error } = DeleteArticleInputSchema.safeParse(data);

  if (error) {
    return { error: error.message };
  }

  const supabase = await createClient();
  const { data: rolePermissions } = await supabase.rpc(
    "get_table_permissions",
    {
      p_table: "articles",
    },
  );
  const result = await deleteArticleCore(
    async (args) => {
      const { error } = await supabase.from("articles").delete().eq("id", args);
      return { error };
    },
    canPerform(rolePermissions),
    id,
  );

  if (!result.ok) {
    return { error: result.error };
  }

  return { error: null };
}

export async function updateArticle(data: unknown) {
  const { data: article, error } = UpdateArticleInputSchema.safeParse(data);

  if (error) {
    return { error: error.message };
  }

  const supabase = await createClient();
  const { data: rolePermissions } = await supabase.rpc(
    "get_table_permissions",
    {
      p_table: "articles",
    },
  );
  const result = await updateArticleCore(
    async (args) => {
      const { error } = await supabase
        .from("articles")
        .update(args)
        .eq("id", args.id);
      return { error };
    },
    canPerform(rolePermissions),
    article,
  );

  if (!result.ok) {
    return { error: result.error };
  }

  return { error: null };
}
