import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/shared/lib/api";
import { VideoProps } from "@/shared/types/Video";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  term: z.string({
    required_error: "Preencha com um termo",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

type FormProps = {
  onSubmit: (data: VideoProps) => void;
};

export function FormComponent({ onSubmit }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: "",
    },
  });

  async function handler(data: FormSchema) {
    const {
      data: { video_id },
    } = await api.post("/generate", {
      ...data,
    });

    const dbData = {
      uuid: video_id,
      term: data.term,
      status: "pending",
      status_message: "Seu vídeo será processado em breve",
    };

    onSubmit(dbData);
  }

  return (
    <form onSubmit={handleSubmit(handler)} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="term">Termo</Label>
        <Input
          id="term"
          className="w-full"
          placeholder="Ex: top 5 carros mais raro do mundo"
          disabled={isSubmitting}
          {...register("term")}
        />

        <small className="text-gray-400">
          Termo para explicar, será usado para gerar o vídeo
        </small>

        {errors.term && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.term.message}
          </p>
        )}
      </div>

      <div className="w-full flex justify-end">
        <Button className="w-24" type="submit">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Gerar
        </Button>
      </div>
    </form>
  );
}
