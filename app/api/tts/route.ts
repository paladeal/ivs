import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_lib/buildError";
import OpenAI from "openai";
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_SECRET_KEY,
    });
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
      response_format: "mp3",
    });
    return NextResponse.json({
      mp3: mp3Response,
    });
  } catch (error) {
    buildError(error);
  }
}
