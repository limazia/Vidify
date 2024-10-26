import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";

import { CardSuggestion } from "./card-suggestion";
import { Form } from "./form";

const formSchema = z.object({
  term: z.string().min(5),
});

type FormSchema = z.infer<typeof formSchema>;

export function AIAssistant() {
  const {
    reset,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

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
        <CardSuggestion setValue={setValue} trigger={trigger} />
      </div>

      <div className="space-y-2">
        <FormProvider {...methods}>
          <Form />
        </FormProvider>
      </div>
    </div>
  );
}
