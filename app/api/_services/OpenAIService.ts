import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";

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
      model: "gpt-4o-mini",
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
}