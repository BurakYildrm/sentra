"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { useState } from "react";

import { UserDeleteAlertDialog } from "@/components/features/user/user-delete-alert-dialog";
import { UserFormDialog } from "@/components/features/user/user-form-dialog";
import { Button } from "@/components/ui/button";

import { Tables } from "@/types/database.types";

export const columns: ColumnDef<Tables<"users">>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original as Tables<"users"> & {
        role: Tables<"user_roles">["role"];
      };
      const [openUpdate, setOpenUpdate] = useState(false);
      const [openDelete, setOpenDelete] = useState(false);

      return (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setOpenUpdate(true)}
          >
            <Edit />
          </Button>
          <UserFormDialog
            user={user}
            title="Edit User"
            description="Make changes to your profile here. Click save when you're done."
            mode="update"
            open={openUpdate}
            setOpen={setOpenUpdate}
          />
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setOpenDelete(true)}
          >
            <Trash />
          </Button>
          <UserDeleteAlertDialog
            user={user}
            open={openDelete}
            setOpen={setOpenDelete}
          />
        </div>
      );
    },
  },
];
