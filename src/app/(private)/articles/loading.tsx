import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const skeletonCount = 8;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Skeleton className="max-sm:size-8 h-9 w-[142px]" />
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton
            key={index}
            className="rounded-md border w-full sm:w-xs sm:h-42 h-52"
          />
        ))}
      </div>
    </div>
  );
}
