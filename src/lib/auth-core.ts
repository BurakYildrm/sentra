import {
  AuthActionResult,
  AuthSignInArgs,
  AuthSignInFn,
  AuthSignOutFn,
} from "@/types/auth";

export async function loginCore(
  fn: AuthSignInFn,
  args: AuthSignInArgs
): Promise<AuthActionResult> {
  const { error, data } = await fn(args);

  if (error || !data?.user) {
    return { ok: false, error: error?.message ?? "Invalid credentials" };
  }

  return { ok: true, error: null };
}

export async function logoutCore(fn: AuthSignOutFn): Promise<AuthActionResult> {
  const { error } = await fn();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, error: null };
}
