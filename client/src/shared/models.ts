export const availableModels: {
  model: string;
  name: string;
  disabled?: boolean;
}[] = [
  { model: "gpt-4", name: "GPT 4" },
  { model: "gpt-4-turbo", name: "GPT 4 Turbo" },
  { model: "gpt-3.5-turbo", name: "GPT 3.5 Turbo" },
];

export const availableModelsArray = ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"] as const;

export const defaultModel = "gpt-3.5-turbo";
