import { z } from "zod";
import { availableModelsArray } from "../models";

export const formSchema = z.object({
  prompt: z.string().min(5),
  model: z.enum(availableModelsArray),
});

export type FormSchema = z.infer<typeof formSchema>;
