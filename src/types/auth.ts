export type AuthActionResult =
  | { ok: true; error: null }
  | { ok: false; error: string };

export type AuthSignInArgs = {
  email: string;
  password: string;
};

export type AuthSignInFn = (args: AuthSignInArgs) => Promise<{
  data: { user: unknown | null };
  error: { message: string } | null;
}>;

export type AuthSignOutFn = () => Promise<{
  error: { message: string } | null;
}>;
