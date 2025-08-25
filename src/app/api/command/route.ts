import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest } from "next/server";
import z from "zod";
import { VOICE_TIMER_PROMPT } from "@/utils/prompts";

export async function POST(request: NextRequest) {
  const { transcript } = await request.json();

  try {
    const { object } = await generateObject({
      model: openai("gpt-5-nano-2025-08-07"),
      system: VOICE_TIMER_PROMPT,
      prompt: `Analyze the following voice transcript and return the appropriate JSON response. Here is the transcript: ${transcript}`,
      schema: z.object({
        command: z.enum(["start", "stop", "pause", "resume"]),
        totalSeconds: z.number().min(0).default(0),
      }),
    });

    return Response.json(object);
  } catch (error) {
    console.error("Error generating object", error);
    return Response.json(
      { error: "Failed to generate object" },
      { status: 500 }
    );
  }
}
