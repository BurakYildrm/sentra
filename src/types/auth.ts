import { SignInInput } from "./validation";

export type AuthSignInFn = (args: SignInInput) => Promise<{
  data: { user: unknown | null };
  error: { message: string } | null;
}>;

export type AuthSignOutFn = () => Promise<{
  error: { message: string } | null;
}>;
