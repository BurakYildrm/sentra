import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Skeleton className="max-sm:size-8 h-9 w-29" />
      </div>
      <Skeleton className="rounded-md border h-60 w-full" />
      <Skeleton className="h-5 w-35" />
    </div>
  );
}
