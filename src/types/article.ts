import { Tables } from "./database.types";

export type CoreResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export type Article = Omit<Tables<"articles">, "created_at" | "updated_at">;

export type ArticleListFn = () => Promise<{
  data: Article[] | null;
  error: { message: string } | null;
}>;

export type ArticleDeleteFn = (
  id: string,
) => Promise<{ error: { message: string } | null }>;

export type ArticleUpdateFn = (
  article: Article,
) => Promise<{ error: { message: string } | null }>;

export type ArticleCreateFn = (
  article: Omit<Article, "id">,
) => Promise<{ error: { message: string } | null }>;
