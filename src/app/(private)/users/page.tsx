import { getAllUsers } from "@/actions/user-actions";

import { UserAddButton } from "@/components/features/user/user-add-button";
import { DataTable } from "@/components/ui/data-table";

import { columns } from "./columns";

export default async function UsersPage() {
  const { data, error } = await getAllUsers();

  if (error || !data) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <UserAddButton />
      </div>
      <DataTable columns={columns} data={data} />
      <p className="text-muted-foreground text-sm">
        Total users: {data.length}
      </p>
    </div>
  );
}
