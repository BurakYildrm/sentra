import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <Skeleton className="rounded-md border h-60 w-full" />
    </div>
  );
}
