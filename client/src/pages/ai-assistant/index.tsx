import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import qs from "qs";

import { generateVideo } from "@/shared/http/generate-video";
import { formSchema, FormSchema } from "@/shared/schemas/form-assistant";

import { Form } from "./form";
import { SuggestionCard } from "./suggestion-card";

export function AIAssistant() {
  const navigate = useNavigate();

  const methods = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: "",
      model: "gpt-turbo",
    },
    mode: "onChange",
  });

  const { mutate: generateVideoMutationFn } = useMutation({
    mutationFn: generateVideo,
    onSuccess: ({ id: chatId }) => {
      const queryParams = qs.stringify({ video: chatId });

      navigate(`/videos?${queryParams}`);
    },
    onError: () => {
      toast.error("Erro ao gerar o vídeo, tente novamente mais tarde");
    },
  });

  async function handleGenerateVideo(data: FormSchema) {
    try {
      await generateVideoMutationFn(data);
    } catch (error) {
      console.error("Generate video error:", error);
    }
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

      <FormProvider {...methods}>
        <SuggestionCard />
        <Form onSubmit={handleGenerateVideo} />
      </FormProvider>
    </div>
  );
}
