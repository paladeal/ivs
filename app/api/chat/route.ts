import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '../_services/OpenAIService';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: 'あなたは親切で知識豊富なECサイトのアシスタントです。商品に関する質問に答えたり、購入のサポートをしたりします。日本語で応答してください。'
      },
      {
        role: 'user',
        content: message
      }
    ];

    try {
      const aiResponse = await OpenAIService.getChatResponse(messages);
      
      return NextResponse.json({ response: aiResponse });
    } catch (apiError: any) {
      console.error('OpenAI API error:', apiError);
      
      // Rate limit error handling
      if (apiError.status === 429) {
        return NextResponse.json(
          { error: 'API利用制限に達しました。しばらくしてから再度お試しください。' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: 'AIからの応答取得に失敗しました。' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}