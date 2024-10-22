import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIndexedDB } from "react-indexed-db-hook";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { api } from "@/shared/lib/api";

import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { VideoProps } from "@/shared/types/Video";

interface DeleteVideoDialogProps {
  videoId: string;
}

export function DeleteVideoDialog({ videoId }: DeleteVideoDialogProps) {
  const { deleteRecord } = useIndexedDB("videos");
  const queryClient = useQueryClient();

  const { mutateAsync: deleteVideo, isPending } = useMutation({
    mutationFn: async () => {
      await deleteRecord(videoId);

      const queryKey = ["videos"];

      queryClient.setQueryData(queryKey, (oldData: VideoProps[] | undefined) =>
        oldData ? oldData.filter((video) => video.uuid !== videoId) : []
      );

      await api.delete(`/delete/${videoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
      toast.success("Vídeo excluído com sucesso.");
    },
  });

  async function handleDelete() {
    await deleteVideo();
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
        <AlertDialogDescription>
          Essa ação não pode ser desfeita. Isso excluirá permanentemente seu
          vídeo.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="ghost">
            Cancelar
          </Button>
        </AlertDialogTrigger>

        <Button
          disabled={isPending}
          variant="destructive"
          className="w-20"
          onClick={handleDelete}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
