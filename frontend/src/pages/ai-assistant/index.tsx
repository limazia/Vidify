import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  RefreshCw,
  ArrowRight,
  Loader2,
  X,
  Globe,
  ChevronDown,
} from "lucide-react";

//import { VideoProps } from "@/shared/types/Video";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { categorizedSuggestions } from "./suggestions";
import { cn } from "@/shared/lib/utils";

const PROMPT_MAX_LENGTH = 600;

const getRandomSuggestions = () => {
  return categorizedSuggestions.map((category) => {
    const randomItem =
      category.items[Math.floor(Math.random() * category.items.length)];
    return { name: category.name, icon: category.icon, text: randomItem };
  });
};

const formSchema = z.object({
  term: z.string().min(5),
});

type FormSchema = z.infer<typeof formSchema>;

// type AIAssistantProps = {
//   onSubmit: (data: VideoProps) => void;
// };

const availableModels = [
  { name: "ChatGPT 3.5 Turbo", model: "gpt-turbo" },
  { name: "Gemini 1.5 Flash", model: "gemini", disabled: true },
  { name: "Claude 3", model: "claude", disabled: true },
];

export function AIAssistant() {
  const [prompts, setPrompts] = useState(getRandomSuggestions);
  const [selectedAI, setSelectedAI] = useState("");
  const [openModel, setOpenModel] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const termValue = watch("term");

  const refreshPrompts = () => {
    setPrompts(getRandomSuggestions());
  };

  const handleOpenModel = () => setOpenModel((prev) => !prev);

  const handleSortChange = (ai: string) => {
    setSelectedAI(ai);
    setOpenModel(false);
  };

  async function handleCreateVideo(data: FormSchema) {
    console.log(data);
    // const video_id = "asdsad";

    // const dbData: VideoProps = {
    //   uuid: video_id,
    //   term: data.term,
    //   cover: "",
    //   status: "pending",
    //   status_message: "Seu vídeo será processado em breve",
    //   created_at: new Date().toISOString(),
    // };

    reset();
    //onSubmit(dbData);
  }

  function handleClear() {
    setValue("term", "", { shouldDirty: true });
    trigger();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {prompts.map((prompt, index) => (
            <Card
              key={index}
              className="hover:border-gray-300 transition ease-linear duration-200 cursor-pointer w-full max-w-xs h-40"
              onClick={() => {
                setValue("term", prompt.text, { shouldDirty: true });
                trigger();
              }}
            >
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex flex-col space-y-1">
                  <small className="text-xs text-gray-400">{prompt.name}</small>
                  <span className="text-sm mb-0">{prompt.text}</span>
                </div>

                <span className="mt-7">
                  <prompt.icon className="size-6 text-gray-400" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          variant="link"
          className="px-0 cursor-pointer hover:no-underline text-gray-500"
          onClick={refreshPrompts}
        >
          <RefreshCw className="size-4 mr-1.5" />
          Atualizar prompts
        </Button>
      </div>

      <form onSubmit={handleSubmit(handleCreateVideo)}>
        <div className="flex group flex-col space-y-2">
          <div className="w-full flex flex-col items-center rounded-md border border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 focus-within:border-gray-400 focus:border-gray-400 transition duration-500 ease-linear">
            <Textarea
              placeholder="Escreva o tema que você deseja..."
              className="w-full h-[140px] bg-transparent border-none focus:border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 font-normal text-black/80 placeholder:text-gray-400 resize-none text-base"
              maxLength={PROMPT_MAX_LENGTH}
              disabled={isSubmitting}
              {...register("term")}
            />

            <div className="w-full flex items-center justify-between p-2">
              <DropdownMenu open={openModel} onOpenChange={setOpenModel}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1.5 rounded-full px-3 text-sm"
                    onClick={handleOpenModel}
                  >
                    <Globe className="size-4" />
                    {selectedAI ? selectedAI : "Modelo"}
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-200",
                        openModel && "rotate-180"
                      )}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[180px]" align="start">
                  <DropdownMenuLabel>Modelo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={selectedAI}
                    onValueChange={(value) => handleSortChange(value)}
                  >
                    {availableModels.map((model, index) => (
                      <DropdownMenuRadioItem
                        key={index}
                        value={model.model}
                        disabled={model.disabled}
                      >
                        {model.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2">
                {termValue && (
                  <Button
                    variant="link"
                    className="px-0 text-gray-400 hover:text-black"
                    onClick={handleClear}
                  >
                    <X className="size-5" />
                  </Button>
                )}

                <span className="text-sm font-medium text-gray-400">
                  {termValue?.length}/{PROMPT_MAX_LENGTH}
                </span>

                <Button
                  type="submit"
                  size="icon"
                  className="px-0 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                  disabled={isSubmitting || !isDirty || !isValid}
                >
                  {isSubmitting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <ArrowRight className="size-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
