import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LoginForm } from "@/components/forms/login-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!error && data?.user) {
    redirect("/");
  }

  return (
    <div className="font-sans grid grid-rows-[1fr] items-center justify-items-center min-h-screen p-8 sm:p-20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <main className="flex flex-col items-center">
        <LoginForm />
      </main>
    </div>
  );
}
