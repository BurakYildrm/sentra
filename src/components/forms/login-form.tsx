"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/auth-actions";
import { X } from "lucide-react";
import { LoginFormData, loginSchema } from "@/types/validation-schemas";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    clearErrors("root");

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await login(formData);

    if (result?.error) {
      setError("root", {
        type: "server",
        message: "Invalid email or password",
      });
      // toast.error(result.error, {
      //   className:
      //     "!text-red-600 !bg-red-50 !border !border-red-200 dark:!bg-red-950/50 dark:!border-red-800 dark:!text-red-400",
      // });
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Sign In to Your Account</h1>
        <p className="text-muted-foreground">
          Enter your credentials to continue
        </p>
      </div>

      {errors.root?.message && (
        <div className="flex items-center justify-between p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/50 dark:border-red-800 dark:text-red-400">
          <p>{errors.root.message}</p>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => clearErrors("root")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
            disabled={isSubmitting}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <div
              role="alert"
              className="text-sm text-red-600 dark:text-red-400"
            >
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            disabled={isSubmitting}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
