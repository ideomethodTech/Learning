import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();

//     const result = streamText({
//       model: groq("llama-3.3-70b-versatile"),
//       prompt,
//     });

//     // Log token usage after streaming completes
//     result.usage.then((usage) => {
//       console.log({
//         inputTokens: usage.inputTokens,
//         outputTokens: usage.outputTokens,
//         totalTokens: usage.totalTokens,
//       });
//     });

//     return result.toUIMessageStreamResponse();
//   } catch (error) {
//     console.error("Error streaming text:", error);
//     return new Response("Failed to stream text", { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error){
    console.error("Error streaming text:" ,error );
    return new Response("Faild to stream text", {status:500})
  }
}
