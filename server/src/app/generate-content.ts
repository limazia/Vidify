import { connection } from "./../database/index";
import { openai } from "@/shared/lib/openai";
import { Model } from "@/shared/types/model";

interface GenerateContentReturn {
  title: string;
  narration: string;
  tags: string[];
  imageQuery: string;
}

interface GenerateContentParams {
  id: string;
  term: string;
  model: Model;
}

export async function generateContent({
  id,
  term,
  model,
}: GenerateContentParams) {
  try {
    const result = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant trained to provide a wide range of answers on topics such as nature, the world, cars, people, and more.",
        },
        {
          role: "user",
          content: `Explain the term "${term}", its purpose, and provide practical examples of its use. All answers should be in Portuguese and maintain a polite and friendly tone, as this content will be used in a video for social media. The explanation should include:
          
          - A clear and concise definition of the term.
          - A description of how the term is used in everyday or specific context.
          - At least three clear and relevant examples that illustrate the use of the term.
          
          At the end of the explanation, invite viewers to follow the channel for more tips and to leave comments with their questions or suggestions. Make sure the text is engaging and informative to keep the audience interested.`,
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
              narration: {
                type: "string",
                description:
                  "Text for tip narration in video. give examples of use. Welcome and explain like a teacher",
              },
              tags: {
                type: "array",
                description:
                  "tags with the benefits of using this term. Each tag is only one word",
                items: {
                  type: "string",
                },
              },
              imageQuery: {
                type: "string",
                description:
                  "Take the context of the narration and return it to me with a single word image query so that I can search for an image, but I need the context to be 100% accurate and in English.",
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

    await connection("videos")
      .update({
        term: args.title,
        road_map: args.narration,
        tags: args.tags.join(","),
        image_query: args.imageQuery,
      })
      .where({ id });

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
