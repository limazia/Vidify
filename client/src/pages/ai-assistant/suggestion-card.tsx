import { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/shared/utils/cn";
import { categorizedSuggestions } from "@/shared/suggestions";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getRandomSuggestions = () => {
  return categorizedSuggestions.map((category) => {
    const randomItem =
      category.items[Math.floor(Math.random() * category.items.length)];
    return { name: category.name, icon: category.icon, text: randomItem };
  });
};

export function SuggestionCard() {
  const [prompts, setPrompts] = useState(getRandomSuggestions);
  const [isSpinning, setIsSpinning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { setValue, trigger } = useFormContext();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleRefreshPrompts = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setPrompts(getRandomSuggestions());

    timeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
    }, 500);
  };

  const handleCardClick = (text: string) => {
    setValue("term", text, { shouldDirty: true });
    trigger();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {prompts.map((prompt, index) => (
          <Card
            key={index}
            className="hover:border-gray-300 transition ease-linear duration-200 cursor-pointer w-full max-w-xs h-40"
            onClick={() => handleCardClick(prompt.text)}
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
        onClick={handleRefreshPrompts}
      >
        <RefreshCw
          className={cn(
            "size-4 mr-1.5",
            isSpinning && "animate-spin transition ease-linear duration-500"
          )}
        />
        Atualizar prompts
      </Button>
    </>
  );
}
