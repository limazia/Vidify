import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import qs from "qs";

import { generateVideo } from "@/shared/http/generate-video";

import { CardSuggestion } from "./card-suggestion";
import { Form } from "./form";

const formSchema = z.object({
  term: z.string().min(5),
});

type FormSchema = z.infer<typeof formSchema>;

export function AIAssistant() {
  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: "",
    },
  });

  const { mutateAsync: generateVideoFn } = useMutation({
    mutationFn: generateVideo,
    onSuccess: (data) => {
      const chatId = data.id;

      const baseURL = "/videos";

      const queryParams = {
        id: chatId,
      };

      const queryString = qs.stringify(queryParams);

      navigate(`${baseURL}?${queryString}`);
    },
    onError: () => {
      toast.error("Erro ao gerar o vídeo, tente novamente mais tarde");
    },
  });

  async function handleCreateVideo(data: FormSchema) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    await generateVideoFn(data);
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Olá,{" "}
          <span className="bg-gradient-to-tr from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            o que você gostaria de saber?
          </span>
        </h1>

        <p className="text-sm text-gray-600">
          Use um dos prompts mais comuns abaixo ou use o seu próprio para
          começar
        </p>
      </div>

      <div className="space-y-2">
        <CardSuggestion setValue={form.setValue} trigger={form.trigger} />
      </div>

      <div className="space-y-2">
        <FormProvider {...form}>
          <Form onNavigate={handleCreateVideo} />
        </FormProvider>
      </div>
    </div>
  );
}
