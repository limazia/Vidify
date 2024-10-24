import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VideoCardSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="w-full rounded-md overflow-hidden shadow-md mt-3"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-full h-48 bg-gray-100 rounded-b-none" />

            <div className="w-full absolute left-4 top-4 flex flex-col">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="mt-7 absolute w-28 h-4" />
            </div>
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="mt-3">
              <Skeleton className="w-48 h-4" />
              <Skeleton className="w-24 h-4 mt-3" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="w-36 h-12" />
              <Skeleton className="w-24 h-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
