import { Tables } from "./database.types";

export type Article = Omit<Tables<"articles">, "created_at" | "updated_at">;

export type ArticlesSelectFn = () => Promise<{
  data: Article[] | null;
  error: { message: string } | null;
}>;

export type ArticlesDeleteFn = (
  id: string,
) => Promise<{ error: { message: string } | null }>;

export type ArticlesUpdateFn = (
  article: Article,
) => Promise<{ error: { message: string } | null }>;

export type ArticlesInsertFn = (
  article: Omit<Article, "id">,
) => Promise<{ error: { message: string } | null }>;
