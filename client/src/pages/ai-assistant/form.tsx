import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ArrowRight, Loader2, X, Globe, ChevronDown } from "lucide-react";

import { cn } from "@/shared/utils/cn";

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

const PROMPT_MAX_LENGTH = 600;

const availableModels: { model: string; name: string; disabled?: boolean }[] = [
  { model: "gpt-turbo", name: "ChatGPT 3.5 Turbo" },
  { model: "gemini", name: "Gemini 1.5 Flash" },
  { model: "claude", name: "Claude 3" },
];

interface FormProps {
  onSubmit: (data: any) => Promise<void>;
}

export function Form({ onSubmit }: FormProps) {
  const [openModel, setOpenModel] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting, isDirty, isValid },
  } = useFormContext();

  const termValue = watch("term");
  const selectedModel = watch("model");

  const handleOpenModel = () => setOpenModel((prev) => !prev);
  const handleModelChange = (model: string) => {
    setValue("model", model, { shouldDirty: true });
    setOpenModel(false);
    trigger();
  };

  const handleClear = () => {
    setValue("term", "", { shouldDirty: true });
    trigger();
  };

  const selectedModelName = availableModels.find(m => m.model === selectedModel)?.name || "Modelo";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex flex-col items-center w-full">
        <div className="w-full rounded-md border border-gray-300 focus-within:border-gray-400 transition">
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
                  onClick={handleOpenModel}
                  className="flex items-center gap-1.5 rounded-full p-2 h-9 text-xs text-gray-500 focus-within:text-black transition"
                >
                  <Globe className="size-4" />
                  {selectedModelName}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      openModel && "rotate-180"
                    )}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]" align="start">
                <DropdownMenuLabel>Modelo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedModel}
                  onValueChange={handleModelChange}
                >
                  {availableModels.map((model, index) => (
                    <DropdownMenuRadioItem
                      key={index}
                      value={model.model}
                      disabled={model.disabled}
                      className="cursor-pointer"
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
                  className="text-gray-400 hover:text-black focus:text-black"
                  onClick={handleClear}
                >
                  <X className="size-5" />
                </Button>
              )}
              <span className="text-sm font-medium text-gray-400 focus:text-black transition">
                {termValue?.length || 0}/{PROMPT_MAX_LENGTH}
              </span>
              <Button
                type="submit"
                size="icon"
                className="bg-purple-600 hover:bg-purple-700 text-white/60 disabled:text-white/60 rounded-md"
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
  );
}