import OpenAI from 'openai';

import { removeFirstWordInCodeBlocks } from "../utils";
import { env } from "../env";

type GenerateContentReturn = {
  title: string;
  tags: string[];
  code_example: string;
  narration: string;
};

type GenerateContentParams = {
  term: string;
};

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY, // This is the default and can be omitted
});

export async function generateContent({ term }: GenerateContentParams) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant trained to provide responses of the most diverse types about nature, the world, cars, people, etc.",
        },
        {
          role: "user",
          content: `Explain ${term}, what it is for, give examples of use, etc. Return all answers in Portuguese. Be polite, as this is a video for social media, at the end of the narration ask to follow along for more tips and to leave a comment`,
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
              code_example: {
                type: "string",
                description:
                  "code example based in example. Should be in markdown. Do not add comments",
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

    const args = JSON.parse(
      //chatCompletion.data.choices[0].message?.function_call?.arguments ?? ""
      chatCompletion.choices[0].message.content ?? ""
    );

    args.narration = args.narration.replace(/```[\s\S]*?```/g, "");

    if (args.code_example[0] === "`") {
      args.code_example = removeFirstWordInCodeBlocks(args.code_example);
    }

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
