"use client";

import { createUser, updateUser } from "@/actions/user-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { Tables } from "@/types/database.types";
import {
  CreateUserFieldsSchema,
  CreateUserFormValues,
  UpdateUserFieldsSchema,
  UpdateUserFormValues,
} from "@/types/validation-schemas";

export type UserFormProps = {
  user?: Tables<"users"> & { role: Tables<"user_roles">["role"] };
  mode: "create" | "update";
  onSubmitComplete: () => void;
  onCancel: () => void;
};

export function UserForm({
  user,
  mode,
  onSubmitComplete,
  onCancel,
}: UserFormProps) {
  const form = useForm<UpdateUserFormValues | CreateUserFormValues>({
    resolver: zodResolver(
      mode === "create" ? CreateUserFieldsSchema : UpdateUserFieldsSchema,
    ),
    defaultValues: user
      ? {
          name: user.name,
          role: user.role,
        }
      : {
          name: "",
          role: "viewer",
          email: "",
          password: "",
        },
    resetOptions: {
      keepDirtyValues: false,
      keepErrors: false,
    },
  });
  const router = useRouter();

  async function onSubmit(data: UpdateUserFormValues | CreateUserFormValues) {
    toast.loading(`${mode === "create" ? "Creating" : "Updating"} user...`, {
      id: `${mode}-user`,
    });

    if (mode === "create") {
      const result = await createUser(data as CreateUserFormValues);

      if (result?.error) {
        toast.error(result.error.message, { id: "create-user" });
      } else {
        toast.success("User created successfully", { id: "create-user" });
      }

      onSubmitComplete();

      if (!result?.error) {
        router.refresh();
      }
    } else {
      const result = await updateUser(
        {
          user: { ...data, id: user!.id },
          fieldsToUpdate: Object.keys(form.formState.dirtyFields),
        },
        // Object.keys(form.formState.dirtyFields),
      );

      if (result?.error) {
        toast.error(result.error.message, { id: "update-user" });
      } else {
        toast.success("User updated successfully", { id: "update-user" });
      }

      onSubmitComplete();

      if (!result?.error) {
        router.refresh();
      }
    }
  }

  function handleCancel() {
    form.reset();
    onCancel();
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="admin">admin</SelectItem>
                      <SelectItem value="editor">editor</SelectItem>
                      <SelectItem value="viewer">viewer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {mode == "create" && (
            <>
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
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleCancel()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
