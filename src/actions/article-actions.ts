"use server";

import {
  createArticleCore,
  deleteArticleCore,
  listArticlesCore,
  updateArticleCore,
} from "@/lib/article-core";
import { canPerform } from "@/lib/permission";
import { createClient } from "@/utils/supabase/server";

import {
  CreateArticleInputSchema,
  DeleteArticleInputSchema,
  UpdateArticleInputSchema,
} from "@/types/validation-schemas";

// export async function getAllArticles() {
//   const supabase = await createClient();
//   const result = await supabase.from("articles").select("*");

//   if (result.error) {
//     return { error: result.error };
//   }

//   return { data: result.data, error: null };
// }

export async function getAllArticles() {
  const supabase = await createClient();
  const result = await listArticlesCore(async () => {
    const { data, error } = await supabase.from("articles").select("*");
    return { data, error };
  });

  if (!result.ok) {
    return { error: result.error };
  }

  return { data: result.data, error: null };
}

// export async function createArticle(data: unknown) {
//   const { data: article, error } = CreateArticleInputSchema.safeParse(data);

//   if (error) {
//     return { error };
//   }

//   const supabase = await createClient();
//   const { data: rolePermissions } = await supabase.rpc(
//     "get_table_permissions",
//     {
//       p_table: "articles",
//     },
//   );

//   if (!rolePermissions.includes("insert")) {
//     return { error: new Error("You are not authorized to create an article") };
//   }

//   const result = await supabase.from("articles").insert(article);

//   if (result.error) {
//     return { error: result.error };
//   }

//   return { data: result.data, error: null };
// }

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

// export async function deleteArticle(data: unknown) {
//   const { data: id, error } = DeleteArticleInputSchema.safeParse(data);

//   if (error) {
//     return { error };
//   }

//   const supabase = await createClient();
//   const { data: rolePermissions } = await supabase.rpc(
//     "get_table_permissions",
//     {
//       p_table: "articles",
//     },
//   );

//   if (!rolePermissions.includes("delete")) {
//     return {
//       error: new Error("You are not authorized to delete this article"),
//     };
//   }

//   const result = await supabase.from("articles").delete().eq("id", id);

//   if (result.error) {
//     return { error: result.error };
//   }
// }

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

// export async function updateArticle(data: unknown) {
//   const { data: article, error } = UpdateArticleInputSchema.safeParse(data);

//   if (error) {
//     return { error };
//   }

//   const supabase = await createClient();
//   const { data: rolePermissions } = await supabase.rpc(
//     "get_table_permissions",
//     {
//       p_table: "articles",
//     },
//   );

//   if (!rolePermissions.includes("update")) {
//     return {
//       error: new Error("You are not authorized to update this article"),
//     };
//   }

//   const result = await supabase
//     .from("articles")
//     .update(article)
//     .eq("id", article.id);

//   if (result.error) {
//     return { error: result.error };
//   }
// }

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
