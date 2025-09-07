// src/lib/article-core.ts
export type ArticlePerm = "select" | "create" | "update" | "delete";

export type CoreResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export type Article = {
  id: string;
  title: string;
  content: string;
};

export type CreateArticleInput = { title: string; content: string };
export type UpdateArticleInput = { id: string; title: string; content: string };
export type DeleteArticleInput = { id: string };

// Small helpers for deps
type CreateDeps = {
  insert: (
    payload: CreateArticleInput,
  ) => Promise<{ error: { message: string } | null }>;
};
type UpdateDeps = {
  update: (
    payload: UpdateArticleInput,
  ) => Promise<{ error: { message: string } | null }>;
};
type DeleteDeps = {
  remove: (id: string) => Promise<{ error: { message: string } | null }>;
};
type ListDeps = {
  listAll: () => Promise<{
    data: Article[] | null;
    error: { message: string } | null;
  }>;
};

// Authorization predicate the core depends on.
// Keep it sync for super-simple testing; if you prefer async, change boolean → Promise<boolean>.
export type Can = (action: ArticlePerm) => boolean;

/** READ */
export async function listArticlesCore(
  deps: ListDeps,
  can: Can,
): Promise<CoreResult<Article[]>> {
  if (!can("select"))
    return { ok: false, error: "Not authorized to view articles" };

  const { data, error } = await deps.listAll();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

/** CREATE */
export async function createArticleCore(
  deps: CreateDeps,
  can: Can,
  input: CreateArticleInput,
): Promise<CoreResult> {
  if (!can("create"))
    return { ok: false, error: "Not authorized to create articles" };
  const { error } = await deps.insert(input);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** UPDATE */
export async function updateArticleCore(
  deps: UpdateDeps,
  can: Can,
  input: UpdateArticleInput,
): Promise<CoreResult> {
  if (!can("update"))
    return { ok: false, error: "Not authorized to update articles" };
  const { error } = await deps.update(input);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** DELETE */
export async function deleteArticleCore(
  deps: DeleteDeps,
  can: Can,
  input: DeleteArticleInput,
): Promise<CoreResult> {
  if (!can("delete"))
    return { ok: false, error: "Not authorized to delete articles" };
  const { error } = await deps.remove(input.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
