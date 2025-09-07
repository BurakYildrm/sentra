import { Tables } from "./database.types";

export type Article = Omit<Tables<"articles">, "created_at" | "updated_at">;
export type ArticlePerm = "insert" | "update" | "delete";
export type ArticleListFn = () => Promise<{
  data: Article[] | null;
  error: { message: string } | null;
}>;
export type ArticleDeleteFn = (
  id: string,
) => Promise<{ error: { message: string } | null }>;
export type ArticleUpdateFn = (
  id: string,
  article: Article,
) => Promise<{ error: { message: string } | null }>;
export type ArticleInsertFn = (
  article: Article,
) => Promise<{ error: { message: string } | null }>;
