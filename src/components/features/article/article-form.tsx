"use client";

import { createArticle, updateArticle } from "@/actions/article-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";

import { Tables } from "@/types/database.types";
import {
  ArticleFieldsSchema,
  ArticleFormValues,
} from "@/types/validation-schemas";

export type UserFormProps = {
  article?: Tables<"articles">;
  onSubmitComplete: () => void;
  onCancel: () => void;
};

export function ArticleForm({
  article,
  onSubmitComplete,
  onCancel,
}: UserFormProps) {
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(ArticleFieldsSchema),
    defaultValues: article
      ? {
          title: article.title,
          content: article.content,
        }
      : {
          title: "",
          content: "",
        },
    resetOptions: {
      keepDirtyValues: false,
      keepErrors: false,
    },
  });
  const router = useRouter();

  async function onSubmit(data: ArticleFormValues) {
    toast.loading(`${article ? "Updating" : "Creating"} article...`, {
      id: `${article ? "update" : "create"}-article`,
    });

    if (!article) {
      const result = await createArticle(data);

      if (result?.error) {
        toast.error(result.error, { id: "create-article" });
      } else {
        toast.success("Article created successfully", { id: "create-article" });
      }

      onSubmitComplete();

      if (!result?.error) {
        router.refresh();
      }
    } else {
      const result = await updateArticle({ ...data, id: article!.id });

      if (result?.error) {
        toast.error(result.error, { id: "update-article" });
      } else {
        toast.success("Article updated successfully", { id: "update-article" });
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Content"
                    {...field}
                  />
                </FormControl>
                {article && (
                  <FormDescription>
                    Last updated:{" "}
                    {new Date(article?.updated_at).toLocaleString("tr-TR")}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
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
