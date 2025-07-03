import { NextRequest, NextResponse } from "next/server";

// VoiceVoxのスピーカーID（話者の種類）
const VOICEVOX_SPEAKERS = {
  normal: 1,          // ずんだもん（ノーマル）
  happy: 3,           // ずんだもん（あまあま）
  tsundere: 7,        // ずんだもん（ツンツン）
  whisper: 22,        // ずんだもん（ささやき）
  male_normal: 13,    // 青山龍星
  female_normal: 14,  // 冥鳴ひまり
  girl_normal: 2,     // 四国めたん（ノーマル）
  boy_normal: 10,     // 春日部つむぎ
} as const;

export async function POST(request: NextRequest) {
  try {
    const { text, speaker = "normal", speed = 1.0 } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "テキストが必要です" },
        { status: 400 }
      );
    }

    const speakerId = VOICEVOX_SPEAKERS[speaker as keyof typeof VOICEVOX_SPEAKERS] || VOICEVOX_SPEAKERS.normal;
    
    // VoiceVoxのローカルサーバーURL（Docker版を使用する場合）
    const VOICEVOX_URL = process.env.VOICEVOX_URL || "http://localhost:50021";

    // 音声合成用のクエリを作成
    const queryResponse = await fetch(
      `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!queryResponse.ok) {
      throw new Error("音声クエリの作成に失敗しました");
    }

    const query = await queryResponse.json();
    
    // 速度を調整
    if (speed !== 1.0) {
      query.speedScale = speed;
    }

    // 音声を合成
    const synthesisResponse = await fetch(
      `${VOICEVOX_URL}/synthesis?speaker=${speakerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      }
    );

    if (!synthesisResponse.ok) {
      throw new Error("音声合成に失敗しました");
    }

    const audioBuffer = await synthesisResponse.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("VoiceVox TTS API error:", error);
    
    // VoiceVoxが利用できない場合は、ブラウザのTTSを使用するようフロントエンドに通知
    return NextResponse.json(
      { 
        error: "音声生成に失敗しました", 
        fallback: true,
        message: "VoiceVoxサーバーに接続できません。ブラウザの音声合成を使用してください。"
      },
      { status: 503 }
    );
  }
}