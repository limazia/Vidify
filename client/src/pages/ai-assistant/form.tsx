import { useState } from "react";
import { z } from "zod";
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

interface Model {
  model: string;
  name: string;
  disabled?: boolean;
}

const availableModels: Model[] = [
  { model: "gpt-turbo", name: "ChatGPT 3.5 Turbo" },
  { model: "gemini", name: "Gemini 1.5 Flash" },
  { model: "claude", name: "Claude 3" },
];

const formSchema = z.object({
  term: z.string().min(5),
});

type FormSchema = z.infer<typeof formSchema>;

interface FormProps {
  onSubmit: (data: FormSchema) => void;
}

export function Form({ onSubmit }: FormProps) {
  const [selectedAI, setSelectedAI] = useState("");
  const [openModel, setOpenModel] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting, isDirty, isValid },
  } = useFormContext<FormSchema>();

  const termValue = watch("term");

  const handleOpenModel = () => setOpenModel((prev) => !prev);

  const handleSortChange = (ai: string) => {
    setSelectedAI(ai);
    setOpenModel(false);
  };

  function handleClear() {
    setValue("term", "", { shouldDirty: true });
    trigger();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-2 group">
        <div className="w-full flex flex-col items-center rounded-md border border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 focus-within:border-gray-400 focus:border-gray-400 transition duration-500 ease-linear">
          <Textarea
            placeholder="Escreva o tema que você deseja..."
            className="w-full h-[140px] bg-transparent border-none focus:border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 font-normal text-black/80 placeholder:text-gray-400 resize-none text-base group-focus:text-black"
            maxLength={PROMPT_MAX_LENGTH}
            disabled={isSubmitting}
            {...register("term")}
          />

          <div className="w-full flex items-center justify-between p-2">
            <DropdownMenu open={openModel} onOpenChange={setOpenModel}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1.5 rounded-full p-2 h-9 text-xs text-gray-500 group-focus-within:text-black group-focus-within:border-gray-400 transition duration-500 ease-linear"
                  onClick={handleOpenModel}
                >
                  <Globe className="size-4" />
                  {selectedAI
                    ? availableModels.find((m) => m.model === selectedAI)?.name
                    : "Modelo"}
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
                      disabled={model?.disabled}
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
                  className="px-0 text-gray-400 hover:text-black group-focus-within:text-black"
                  onClick={handleClear}
                >
                  <X className="size-5" />
                </Button>
              )}

              <span className="text-sm font-medium text-gray-400 group-focus-within:text-black transition duration-500 ease-linear">
                {termValue?.length}/{PROMPT_MAX_LENGTH}
              </span>

              <Button
                type="submit"
                size="icon"
                className="px-0 bg-purple-600 hover:bg-purple-700 text-white/60 disabled:text-white/60 group-focus-within:text-white rounded-md transition duration-500 ease-linear"
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
