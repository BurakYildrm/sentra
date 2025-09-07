"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "../../ui/button";
import { UserFormDialog } from "./user-form-dialog";

export function UserAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="max-sm:size-8 sm:flex sm:flex-row sm:items-center sm:gap-2"
      >
        <Plus />
        <span className="hidden sm:block">Add User</span>
      </Button>
      <UserFormDialog
        title="Add User"
        description="Add a new user to the system."
        mode="create"
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
