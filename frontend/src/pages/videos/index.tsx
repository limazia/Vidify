import { useEffect, useState } from "react";
import { VideoCardSkeleton } from "./video-card-skeleton";
import { CardVideo } from "./video-card";

export function Videos() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Videos</h1>
        <p className="text-sm text-gray-600">Veja seus vídeos criados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <VideoCardSkeleton /> : <CardVideo />}
      </div>
    </div>
  );
}
