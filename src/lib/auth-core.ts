import { AuthSignInFn, AuthSignOutFn } from "@/types/auth";
import { CoreResult } from "@/types/shared";
import { SignInInput } from "@/types/validation";

export async function loginCore(
  fn: AuthSignInFn,
  args: SignInInput,
): Promise<CoreResult> {
  const { error } = await fn(args);

  if (error) {
    return { ok: false, error: error?.message ?? "Invalid credentials" };
  }

  return { ok: true };
}

export async function logoutCore(fn: AuthSignOutFn): Promise<CoreResult> {
  const { error } = await fn();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
