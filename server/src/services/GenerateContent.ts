import { openai } from "@/shared/lib/openai";

type GenerateContentReturn = {
  title: string;
  tags: string[];
  narration: string;
};

type GenerateContentParams = {
  term: string;
};

export async function generateContent({ term }: GenerateContentParams) {
  try {
    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant trained to provide a wide variety of responses on topics such as nature, the world, cars, people, and more.",
        },
        {
          role: "user",
          content: `Explain ${term}, its purpose, and provide examples of use. All answers should be in Portuguese and maintain a polite tone, as this content will be used in a social media video. At the end of the explanation, invite viewers to follow for more tips and to leave a comment.`,
        },
      ],
      functions: [
        {
          name: "generateContentForVideo",
          description: "Generate content for video in portuguese",
          parameters: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "title of term to be explained. Only one word",
              },
              tags: {
                type: "array",
                description:
                  "tags with the benefits of using this term. Each tag is only one word",
                items: {
                  type: "string",
                },
              },
              narration: {
                type: "string",
                description:
                  "Text for tip narration in video. give examples of use. Welcome and explain like a teacher",
              },
            },
          },
        },
      ],
      function_call: {
        name: "generateContentForVideo",
      },
      temperature: 0.1,
    });

    const choices = result.choices[0]!.message.function_call?.arguments;

    const args = JSON.parse(choices as string);

    console.log(args);

    args.narration = args.narration.replace(/```[\s\S]*?```/g, "");

    return args as GenerateContentReturn;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "response" in error) {
      const errorResponse = error as {
        response: { data: { error: { message: string } } };
      };

      console.error(errorResponse.response.data.error.message);
    } else {
      console.error(error);
    }
  }
}
