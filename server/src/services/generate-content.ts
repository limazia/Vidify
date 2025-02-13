import { connection } from "../database/index";
import { openai } from "@/shared/lib/openai";
import { Model } from "@/shared/types/model";

interface GenerateContentReturn {
  title: string;
  narration: string;
  tags: string[];
  imagePrompt: string;
}

interface GenerateContentParams {
  id: string;
  prompt: string;
  model: Model;
}

export async function generateContent({
  id,
  prompt,
  model,
}: GenerateContentParams) {
  if (!id || !prompt || !model) {
    throw new Error("id, prompt and model are required");
  }

  console.log("Model:", model);

  try {
    const result = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an AI professor specialized in a wide array of subjects like nature, the world, cars, people, and more. Your role is to educate, inspire, and engage your audience in a fun and informative learning environment. I want the answer in Brazilian Portuguese",
        },
        {
          role: "user",
          content: `Please explain the term "${prompt}", its purpose, and provide practical examples of its use. Maintain an educational, friendly, and engaging tone as this content will be used in a social media video. Your explanation should include:
    
          - A clear, concise definition of the term.
          - A description of how the term is used in everyday or specific contexts.
          - At least three clear and relevant examples that illustrate the use of the term.
          
          Additionally, ensure your script includes:
          
          - An engaging introduction that captures attention, perhaps with a question or a surprising fact related to the term.
          - A narrative flow that keeps viewers interested throughout the explanation, using storytelling or analogies where appropriate.
          - Visual cues or suggestions for images or animations that could accompany the explanation to enhance understanding.
          - A call to action at the end where you invite viewers to follow the channel for more insights, like and share the video, and leave comments with their questions or suggestions for future topics.
          
          Remember, you are not just informing but teaching, so every word should feel like a lesson. Make the topic accessible and exciting, sparking curiosity and a desire to learn more. Keep it light-hearted but informative, and ensure the language is simple yet enriching. Your goal is to make learning enjoyable and to encourage viewers to explore further on their own or through your channel.`,
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
                description: "create a title with the prompt and context",
              },
              narration: {
                type: "string",
                description:
                  "Text for tip narration in video. Provide a comprehensive explanation with multiple examples, analogies, and a narrative flow suitable for a 1 - 1:30 minute video segment. Welcome and explain like an engaging teacher, ensuring a substantial depth in content.",
              },
              tags: {
                type: "array",
                description:
                  "create tags based on title and narration (maximum 4 and all lowercase)",
                items: {
                  type: "string",
                },
              },
              imagePrompt: {
                type: "string",
                description:
                  "Analyze the context of the narration and generate a highly detailed but concise prompt for an image in DALL·E, focusing on key visual elements. Ensure the description is detailed but brief.",
              },
            },
            required: ["title", "narration", "tags", "imagePrompt"],
          },
        },
      ],
      function_call: {
        name: "generateContentForVideo",
      },
      temperature: 0.6, // Adjusted for more creative but still focused output
      max_tokens: 1000, // Increased from default to allow for longer responses
    });

    const choices = result.choices[0]!.message.function_call?.arguments;

    const args = JSON.parse(choices as string);

    console.log(args);

    args.narration = args.narration.replace(/```[\s\S]*?```/g, "");

    await connection("videos")
      .update({
        prompt,
        title: args.title,
        narration: args.narration,
        tags: args.tags.join(","),
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
