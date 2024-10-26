import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { CardSuggestion } from "./card-suggestion";
import { Form } from "./form";

const formSchema = z.object({
  term: z.string().min(5),
});

type FormSchema = z.infer<typeof formSchema>;

export function AIAssistant() {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: "",
    },
  });

  async function handleCreateVideo(data: FormSchema) {
    setIsNavigating(true);
    const chatId = uuidv4();

    // Store the search term in localStorage or state management solution
    localStorage.setItem(`chat-${chatId}`, data.term);

    // Animate out
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for exit animation

    // Navigate to chat
    navigate(`/chat/${chatId}`);
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
          <Form onNavigate={handleCreateVideo} isNavigating={isNavigating} />
        </FormProvider>
      </div>
    </div>
  );
}
