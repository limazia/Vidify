import { Download, Trash2 } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { VideoStatus } from "./video-status";
import { DeleteVideoDialog } from "./delete-video-dialog";

import { ReactComponent as Placeholder } from "@/assets/placeholder.svg";

type Status = "pending" | "processing" | "error" | "finished";

export function CardVideo() {
  const status: Status = "processing";
  const cover = true;
  const status_message = "Processando video";

  function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
  }

  return (
    <Card className="w-full rounded-md overflow-hidden shadow-md mt-3">
      <div className="relative flex items-center justify-center">
        {status === "finished" ? (
          <>
            {cover ? (
              <>
                <div
                  className="w-full h-48 object-cover bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://img.freepik.com/premium-photo/close-up-blurred-gradient-background_534308-4181.jpg")',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
              </>
            ) : (
              <Placeholder className="w-full h-48 rounded-b-none" />
            )}
          </>
        ) : (
          <>
            <Skeleton className="w-full h-48 rounded-b-none" />

            <div className="absolute">
              <VideoStatus status={status} />
            </div>
          </>
        )}

        {status !== "finished" && (
          <div className="w-full absolute left-4 top-4 flex flex-col">
            <span className="font-semibold text-gray-500 text-xs uppercase">
              Na fila
            </span>
            <span className="mt-4 absolute text-gray-500 text-xs">
              {status_message}
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="mt-3 space-y-2">
          <CardTitle
            className="text-md font-bold"
            title="16aa00ae-a042-4b38-a2bf-5444e823a051"
          >
            Artigos científicos mais impactantes
          </CardTitle>

          <span className="text-gray-500 text-xs">
            Criado agora mesmo 
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="lg"
            disabled={status !== "finished"}
            className="px-3 flex items-center gap-2"
          >
            <Download className="size-5" />
            <span className="font-base">Baixar video</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="link"
                disabled={status !== "finished"}
                className="flex items-center gap-2 cursor-pointer text-red-500 hover:no-underline"
                onClick={handleDeleteClick}
              >
                <Trash2 className="size-5" />
                <span className="font-base">Excluir video</span>
              </Button>
            </AlertDialogTrigger>

            <DeleteVideoDialog />
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
