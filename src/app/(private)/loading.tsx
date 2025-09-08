import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <Skeleton className="size-60 md:size-70 lg:size-94 rounded-full" />
      <Skeleton className="h-4 w-60 md:w-100" />
    </div>
  );
}
