"use client";

import { deleteArticle } from "@/actions/article-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type ArticleDeleteAlertDialogProps = {
  article_id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function ArticleDeleteAlertDialog({
  article_id,
  open,
  setOpen,
}: ArticleDeleteAlertDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const onDelete = async (id: string) => {
    setIsDeleting(true);
    toast.loading("Deleting article...", {
      id: "delete-article",
    });

    const result = await deleteArticle(id);

    if (result?.error) {
      toast.error(result.error.message, {
        id: "delete-article",
      });
    } else {
      toast.success("Article deleted successfully", {
        id: "delete-article",
      });
    }

    setIsDeleting(false);
    setOpen(false);

    if (!result?.error) {
      router.refresh();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            article and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(article_id)}
            disabled={isDeleting}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
