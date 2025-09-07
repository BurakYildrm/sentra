import {
  Article,
  ArticleCreateFn,
  ArticleDeleteFn,
  ArticleListFn,
  ArticleUpdateFn,
  CoreResult,
} from "@/types/article";
import { Can } from "@/types/permission";
import {
  CreateArticleInput,
  DeleteArticleInput,
  UpdateArticleInput,
} from "@/types/validation-schemas";

/** READ */
export async function listArticlesCore(
  fn: ArticleListFn,
): Promise<CoreResult<Article[]>> {
  const { data, error } = await fn();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data: data ?? [] };
}

/** CREATE */
export async function createArticleCore(
  fn: ArticleCreateFn,
  can: Can,
  input: CreateArticleInput,
): Promise<CoreResult> {
  if (!can("insert")) {
    return { ok: false, error: "Not authorized to create articles" };
  }

  const { error } = await fn(input);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/** UPDATE */
export async function updateArticleCore(
  fn: ArticleUpdateFn,
  can: Can,
  input: UpdateArticleInput,
): Promise<CoreResult> {
  if (!can("update")) {
    return { ok: false, error: "Not authorized to update articles" };
  }

  const { error } = await fn(input);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/** DELETE */
export async function deleteArticleCore(
  fn: ArticleDeleteFn,
  can: Can,
  input: DeleteArticleInput,
): Promise<CoreResult> {
  if (!can("delete")) {
    return { ok: false, error: "Not authorized to delete articles" };
  }

  const { error } = await fn(input);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
