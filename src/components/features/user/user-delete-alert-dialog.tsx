"use client";

import { deleteUser } from "@/actions/user-actions";
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

import { Tables } from "@/types/database.types";

export type UserDeleteAlertDialogProps = {
  user: Tables<"users">;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function UserDeleteAlertDialog({
  user,
  open,
  setOpen,
}: UserDeleteAlertDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const onDelete = async (id: string) => {
    setIsDeleting(true);
    toast.loading("Deleting user...", {
      id: "delete-user",
    });

    const result = await deleteUser(id);

    if (result.error) {
      toast.error(result.error.message, {
        id: "delete-user",
      });
    } else {
      toast.success("User deleted successfully", {
        id: "delete-user",
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
            This action cannot be undone. This will permanently delete this user
            and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(user.id)}
            disabled={isDeleting}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
