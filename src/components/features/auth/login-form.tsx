"use client";

import { login } from "@/actions/auth-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Alert, AlertTitle } from "../../ui/alert";

import {
  SignInFieldsSchema,
  SignInFormValues,
} from "@/types/validation-schemas";

export function LoginForm() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInFieldsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormValues) {
    form.clearErrors("root");
    const result = await login(data);

    if (result?.error) {
      console.log(result.error);

      form.setError("root", {
        type: "server",
        message: "Invalid email or password",
      });
    } else {
      toast.success("Signed in successfully");
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>
                <div className="flex items-center justify-between">
                  <p>{form.formState.errors.root.message}</p>
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => form.clearErrors("root")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </AlertTitle>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
