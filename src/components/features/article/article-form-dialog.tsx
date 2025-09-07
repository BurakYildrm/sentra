"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { ArticleForm } from "./article-form";

import { Tables } from "@/types/database.types";

export type ArticleFormDialogProps = {
  article?: Tables<"articles">;
  title: string;
  description: string;
  isDescriptionVisible?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function ArticleFormDialog({
  article,
  title,
  description,
  isDescriptionVisible = true,
  open,
  setOpen,
}: ArticleFormDialogProps) {
  const onSubmitComplete = () => {
    setOpen(false);
  };

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={isDescriptionVisible ? "" : "sr-only"}>
            {description}
          </DialogDescription>
        </DialogHeader>
        <ArticleForm
          article={article}
          onSubmitComplete={onSubmitComplete}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
