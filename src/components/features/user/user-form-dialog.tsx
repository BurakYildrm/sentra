"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { UserForm } from "./user-form";

import { Tables } from "@/types/database.types";

export type UserFormDialogProps = {
  user?: Tables<"users"> & { role: Tables<"user_roles">["role"] };
  title: string;
  description?: string;
  mode: "create" | "update";
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function UserFormDialog({
  user,
  title,
  description,
  mode,
  open,
  setOpen,
}: UserFormDialogProps) {
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
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <UserForm
          user={user}
          mode={mode}
          onSubmitComplete={onSubmitComplete}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
