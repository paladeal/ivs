import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '../_services/OpenAIService';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import productsData from '../_data/products.json';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // 商品情報を含むシステムプロンプトを作成
    const productCatalog = productsData.slice(0, 10).map(product => 
      `- ${product.name}: ${product.price} - ${product.description}`
    ).join('\n');

    const systemPrompt = `あなたは親切で知識豊富なECサイトのアシスタントです。商品に関する質問に答えたり、購入のサポートをしたりします。日本語で応答してください。

現在取り扱っている商品の一部をご紹介します：
${productCatalog}

他にも${productsData.length}種類以上の商品を取り扱っています。すべて手作りでサステナブルな素材を使用した商品です。カテゴリは雑貨、衣類、インテリアなどがあります。

お客様のニーズに合わせて、適切な商品をご提案したり、詳細な情報をお伝えしたりします。`;

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt
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