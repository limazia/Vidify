import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { deleteVideo } from "@/shared/http/delete-video";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PHRASE_FOR_DELETION = "excluir video";

const formSchema = z.object({
  confirmText: z
    .string()
    .min(1, "A confirmação é obrigatória")
    .refine(
      (value) => value.trim().toLowerCase() === PHRASE_FOR_DELETION,
      "Texto de confirmação incorreto"
    ),
});

type FormSchema = z.infer<typeof formSchema>;

interface VideoDeleteDialogProps {
  videoId: string;
  onClose: (value: boolean) => void;
}

export function VideoDeleteDialog({
  videoId,
  onClose,
}: VideoDeleteDialogProps) {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const { mutateAsync: deleteCompanyFn, isPending } = useMutation({
    mutationFn: () => deleteVideo(videoId),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["videos"],
      });

      onClose(false);

      toast.success("Video excluido com sucesso!");
    },
    onError() {
      toast.error("Não foi possível excluir o video. Tente novamente.");
    },
  });

  async function onSubmit() {
    await deleteCompanyFn();
  }

  return (
    <DialogContent>
      <DialogHeader className="space-y-4">
        <div className="space-y-1">
          <DialogTitle>Excluir video</DialogTitle>
          <DialogDescription />
        </div>

        <span>
          Essa ação não pode ser desfeita. Isso excluirá permanentemente seu
          vídeo.
        </span>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="confirm_text">
            Para verificar, digite <strong>{PHRASE_FOR_DELETION}</strong>{" "}
            abaixo:
          </Label>
          <Input
            type="text"
            id="confirm_text"
            disabled={isSubmitting}
            {...register("confirmText")}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>

          <Button
            type="submit"
            variant="destructive"
            className="bg-red-600 hover:bg-red-600/90"
            disabled={isPending || isSubmitting || !isDirty || !isValid}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Excluir"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
