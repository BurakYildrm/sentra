import { getAllUsers } from "@/actions/user-actions";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function UsersPage() {
  const { data, error } = await getAllUsers();

  if (error || !data) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <DataTable columns={columns} data={data} />
      {/* <DataTable columns={columns} data={data} />
      <Skeleton className="rounded-md border h-60 w-full" /> */}
    </div>
  );
}
