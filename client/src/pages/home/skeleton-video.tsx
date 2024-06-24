import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonVideo() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="w-full flex items-center gap-3 p-4 border rounded-md"
        >
          <Skeleton className="w-12 h-12" />

          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col space-y-2">
              <Skeleton className="w-96 h-4" />
              <Skeleton className="w-60 h-4" />
            </div>

            <Skeleton className="w-12 h-12" />
          </div>
        </div>
      ))}
    </>
  );
}
