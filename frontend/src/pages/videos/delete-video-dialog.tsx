import { Loader2 } from "lucide-react";

import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteVideoDialog() {
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

        <Button disabled={true} variant="destructive" className="w-20">
          <Loader2 className="size-4 animate-spin" />
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
