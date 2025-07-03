import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";

export type TTSVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

export interface TTSOptions {
  voice?: TTSVoice;
  speed?: number;
}

export class OpenAIService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  private static Chat = z.object({
    message: z.string(),
  });

  /**
   * OpenAI のチャット補完 API を使用して応答を取得します。
   * @param {ChatCompletionMessageParam[]} messages - OpenAI に送信するチャット履歴のメッセージ配列。
   * @returns {Promise<string>} OpenAI からの応答メッセージの文字列。
   */
  public static async getChatResponse(
    messages: ChatCompletionMessageParam[],
  ): Promise<string> {
    const response = await this.openai.chat.completions.parse({
      model: "gpt-4.1-nano",
      messages: messages,
      temperature: 1,
      max_tokens: 16384,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0, 
      response_format: zodResponseFormat(this.Chat, "event"),
    });

    return response.choices[0].message.parsed?.message || "";
  }

  /**
   * OpenAI の Text-to-Speech API を使用してテキストを音声に変換します。
   * @param {string} text - 音声に変換するテキスト
   * @param {TTSOptions} options - 音声合成のオプション
   * @returns {Promise<ArrayBuffer>} 音声データのArrayBuffer
   */
  public static async textToSpeech(
    text: string,
    options: TTSOptions = {}
  ): Promise<ArrayBuffer> {
    const { voice = "alloy", speed = 1.0 } = options;

    const response = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
      speed: speed,
    });

    return response.arrayBuffer();
  }
}