import {
  createArticleCore,
  deleteArticleCore,
  listArticlesCore,
  updateArticleCore,
} from "@/lib/article-core";
import { canPerform } from "@/lib/permission";
import { describe, expect, it, vi } from "vitest";

const ok = { error: null as any };
const err = (message: string) => ({ error: { message } });

describe("Core Article Functions", () => {
  it("listArticlesCore returns data", async () => {
    const rows = [{ id: "1", title: "A", content: "x" }];
    const fn = vi.fn().mockResolvedValue({ data: rows, error: null });
    const res = await listArticlesCore(fn);
    expect(res).toEqual({ ok: true, data: rows });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("listArticlesCore propagates errors", async () => {
    const fn = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "db fail" } });
    const res = await listArticlesCore(fn);
    expect(res).toEqual({ ok: false, error: "db fail" });
  });

  it("createArticleCore denies without insert", async () => {
    const fn = vi.fn();
    const res = await createArticleCore(fn, canPerform([]), {
      title: "t",
      content: "c",
    });
    expect(res).toEqual({
      ok: false,
      error: "Not authorized to create articles",
    });
    expect(fn).not.toHaveBeenCalled();
  });

  it("createArticleCore succeeds with insert", async () => {
    const fn = vi.fn().mockResolvedValue(ok);
    const input = { title: "t", content: "c" };
    const res = await createArticleCore(fn, canPerform(["insert"]), input);
    expect(res).toEqual({ ok: true });
    expect(fn).toHaveBeenCalledWith(input);
  });

  it("createArticleCore propagates db error", async () => {
    const fn = vi.fn().mockResolvedValue(err("db error"));
    const res = await createArticleCore(fn, canPerform(["insert"]), {
      title: "t",
      content: "c",
    });
    expect(res).toEqual({ ok: false, error: "db error" });
  });

  it("updateArticleCore denies without update", async () => {
    const fn = vi.fn();
    const res = await updateArticleCore(fn, canPerform([]), {
      id: "1",
      title: "t",
      content: "c",
    });
    expect(res).toEqual({
      ok: false,
      error: "Not authorized to update articles",
    });
    expect(fn).not.toHaveBeenCalled();
  });

  it("updateArticleCore succeeds with update", async () => {
    const fn = vi.fn().mockResolvedValue(ok);
    const input = { id: "1", title: "t", content: "c" };
    const res = await updateArticleCore(fn, canPerform(["update"]), input);
    expect(res).toEqual({ ok: true });
    expect(fn).toHaveBeenCalledWith(input);
  });

  it("updateArticleCore propagates db error", async () => {
    const fn = vi.fn().mockResolvedValue(err("boom"));
    const res = await updateArticleCore(fn, canPerform(["update"]), {
      id: "1",
      title: "t",
      content: "c",
    });
    expect(res).toEqual({ ok: false, error: "boom" });
  });

  it("deleteArticleCore denies without delete", async () => {
    const fn = vi.fn();
    const res = await deleteArticleCore(fn, canPerform([]), "1");
    expect(res).toEqual({
      ok: false,
      error: "Not authorized to delete articles",
    });
    expect(fn).not.toHaveBeenCalled();
  });

  it("deleteArticleCore succeeds with delete", async () => {
    const fn = vi.fn().mockResolvedValue(ok);
    const res = await deleteArticleCore(fn, canPerform(["delete"]), "1");
    expect(res).toEqual({ ok: true });
    expect(fn).toHaveBeenCalledWith("1");
  });

  it("deleteArticleCore propagates db error", async () => {
    const fn = vi.fn().mockResolvedValue(err("nope"));
    const res = await deleteArticleCore(fn, canPerform(["delete"]), "1");
    expect(res).toEqual({ ok: false, error: "nope" });
  });
});
