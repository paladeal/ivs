import { NextRequest, NextResponse } from "next/server";
import { OpenAIService } from "../_services/OpenAIService";

export async function POST(request: NextRequest) {
  try {
    const { text, voice = "alloy", speed = 1.0 } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "テキストが必要です" },
        { status: 400 }
      );
    }

    const audioBuffer = await OpenAIService.textToSpeech(text, {
      voice,
      speed,
    });

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: "音声生成に失敗しました" },
      { status: 500 }
    );
  }
}