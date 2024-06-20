import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import api from "@/shared/lib/api";
import { VideoProps } from "@/shared/types/Video";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormProps = {
  onSubmit: (data: VideoProps) => void;
};

const FormSchema = z.object({
  term: z.string({
    required_error: "Preencha com um termo",
  }),
});

export const FormComponent = ({ onSubmit }: FormProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function handler(data: z.infer<typeof FormSchema>) {
    const {
      data: { video_id },
    } = await api.post("/generate", {
      ...data,
    });

    const dbData = {
      uuid: video_id,
      term: data.term,
      status: "pending",
      status_message: "Seu vídeo será processado em breve",
    };

    onSubmit(dbData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handler)}
        className="w-full"
      >
        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Termo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: top 5 carros mais raro do mundo"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Termo para explicar, será usado para gerar o vídeo
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit">Gerar</Button>
      </form>
    </Form>
  );
};
