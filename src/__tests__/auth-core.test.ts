import { loginCore, logoutCore } from "@/lib/auth-core";
import { describe, expect, it, vi } from "vitest";

describe("Core Auth Functions", () => {
  it("loginCore returns error on bad credentials", async () => {
    const signIn = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login" },
    });
    const res = await loginCore(signIn, { email: "a@b.com", password: "x" });
    expect(res).toEqual({ ok: false, error: "Invalid login" });
    expect(signIn).toHaveBeenCalledWith({ email: "a@b.com", password: "x" });
  });

  it("loginCore returns ok on successful login", async () => {
    const signIn = vi.fn().mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });
    const res = await loginCore(signIn, {
      email: "a@b.com",
      password: "secret123",
    });
    expect(res).toEqual({ ok: true, error: null });
  });

  it("logoutCore returns ok on successful logout", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    const res = await logoutCore(signOut);
    expect(res).toEqual({ ok: true, error: null });
  });

  it("logoutCore returns error on failed logout", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const res = await logoutCore(signOut);
    expect(res).toEqual({ ok: false, error: "boom" });
  });
});
