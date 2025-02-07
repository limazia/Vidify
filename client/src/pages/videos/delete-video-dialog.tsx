import { Loader2 } from "lucide-react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteVideoDialog() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Você tem certeza?</DialogTitle>
        <DialogDescription>
          Essa ação não pode ser desfeita. Isso excluirá permanentemente seu
          vídeo.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogTrigger asChild>
          <Button type="button" variant="ghost">
            Cancelar
          </Button>
        </DialogTrigger>

        <Button disabled={true} variant="destructive" className="w-20">
          <Loader2 className="size-4 animate-spin" />
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
