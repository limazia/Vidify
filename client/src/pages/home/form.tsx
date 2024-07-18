"use client";

import { useEffect, useState } from "react";
import { FileTerminal, X, Loader2, Hammer, RotateCw } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/shared/lib/api";
import { VideoProps } from "@/shared/types/Video";
import { suggestions } from "./suggestions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  term: z.string().min(5),
});

type FormSchema = z.infer<typeof formSchema>;

type FormProps = {
  onSubmit: (data: VideoProps) => void;
};

export function FormComponent({ onSubmit }: FormProps) {
  const [titleRandom, setTitleRandom] = useState("");

  useEffect(() => {
    setTitleRandom(suggestions[Math.floor(Math.random() * suggestions.length)]);
  }, []);

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

  async function handleCreateVideo(data: FormSchema) {
    const response = await api.post("/generate", data);
    const { video_id } = response.data;

    const dbData: VideoProps = {
      uuid: video_id,
      term: data.term,
      cover: "",
      status: "pending",
      status_message: "Seu vídeo será processado em breve",
      created_at: new Date().toISOString(),
    };

    reset();

    onSubmit(dbData);
  }

  function handleSuggestionClick() {
    setValue("term", titleRandom, { shouldDirty: true });
    trigger();
  }

  function handleClear() {
    setValue("term", "", { shouldDirty: true });
    trigger();
  }

  function handleRefreshClick() {
    setTitleRandom(suggestions[Math.floor(Math.random() * suggestions.length)]);
  }

  return (
    <form onSubmit={handleSubmit(handleCreateVideo)} className="space-y-4">
      <div className="flex group flex-col">
        <div className="w-full h-[50px] flex items-center px-4 rounded-md border border-gray-300 disabled:cursor-not-allowed  disabled:opacity-50 focus-within:border-gray-400 focus:border-gray-400 transition duration-500 ease-linear">
          <FileTerminal className="w-5 h-5 text-gray-500 transition duration-500 ease-linear" />

          <Input
            className="bg-transparent border-none font-normal text-gray-500 focus:border-gray-400 shadow-none outline-none focus:outline-none focus-visible:ring-0"
            placeholder="Digite seu prompt aqui"
            disabled={isSubmitting}
            {...register("term")}
          />

          <div className="flex items-center gap-2">
            {termValue && (
              <Button
                variant="link"
                className="px-0"
                onClick={handleClear}
              >
                <X className="size-4" />
              </Button>
            )}

            <Button
              type="submit"
              variant="link"
              className="px-0"
              disabled={isSubmitting || !isDirty || !isValid}
            >
              {isSubmitting ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                <Hammer className="size-6" />
              )}
            </Button>
          </div>
        </div>

        {!termValue && (
          <div className="flex items-center gap-2 cursor-pointer">
            <Button
              variant="link"
              className="px-0"
              onClick={handleRefreshClick}
            >
              <RotateCw className="w-4 h-4" />
            </Button>

            <div className="w-full" onClick={handleSuggestionClick}>
              <p className="truncate w-[840px] text-gray-600 font-medium">
                {titleRandom}
              </p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
