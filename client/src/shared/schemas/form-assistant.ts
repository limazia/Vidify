import { z } from "zod";

const availableModels = [
  "gpt-turbo",
  "gemini",
  "claude"
] as const;

export const formSchema = z.object({
  term: z.string().min(5),
  model: z.enum(availableModels)
});

export type FormSchema = z.infer<typeof formSchema>;