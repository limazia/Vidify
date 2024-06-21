import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/shared/lib/api";
import { VideoProps } from "@/shared/types/Video";
import { suggestions } from "./suggestions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TERM_MIN_LENGTH = 5;

const formSchema = z.object({
  term: z
    .string({
      message: "Preencha com um termo",
    })
    .min(TERM_MIN_LENGTH, {
      message: `O termo deve ter pelo menos ${TERM_MIN_LENGTH} caracteres.`,
    }),
});

type FormSchema = z.infer<typeof formSchema>;

type FormProps = {
  onSubmit: (data: VideoProps) => void;
};

export function FormComponent({ onSubmit }: FormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: "",
    },
  });

  const { mutateAsync: createVideo } = useMutation({
    mutationFn: async (data: FormSchema) => {
      const response = await api.post("/generate", {
        ...data,
      });

      const { video_id } = response.data;

      return video_id;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
    },
  });

  async function handleCreateVideo(data: FormSchema) {
    const { video_id } = await createVideo(data);

    const dbData: VideoProps = {
      uuid: video_id,
      term: data.term,
      status: "pending",
      status_message: "Seu vídeo será processado em breve",
    };

    onSubmit(dbData);

    reset();
  }

  const titleRandom =
    suggestions[Math.floor(Math.random() * suggestions.length)];

  return (
    <form onSubmit={handleSubmit(handleCreateVideo)} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="term" className="font-bold">
          Termo
        </Label>

        <div className="flex gap-5">
          <Input
            id="term"
            className="w-full"
            placeholder={`Ex: ${titleRandom}`}
            disabled={isSubmitting}
            {...register("term")}
          />

          <Button
            type="submit"
            className="w-40 font-bold"
            disabled={isSubmitting || !isDirty || !isValid}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gerar
          </Button>
        </div>

        <small className="text-gray-400">
          Este termo será utilizado para explicar e gerar o vídeo.
        </small>

        {errors.term && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.term.message}
          </p>
        )}
      </div>
    </form>
  );
}
