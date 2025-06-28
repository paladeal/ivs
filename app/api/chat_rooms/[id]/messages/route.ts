import { buildPrisma } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../_lib/getCurrentUser";
import { buildError } from "../../../_lib/buildError";
import { MessagesResponse } from "@/app/_types/chatMassage/MessagesResponse";
import { MessageRequest } from "@/app/_types/chatMassage/MessageRequest";
import { OpenAIService } from "../../../_services/OpenAIService";
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const prisma = await buildPrisma();
  try {
    const { id } = await params;
    const user = await getCurrentUser({ request });

    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    if (!chatRoom) {
      return buildError({ error: "Chat room not found" })
    }
    return NextResponse.json<MessagesResponse>({
      chatRoom,
      messages: chatRoom.messages,
    });
  } catch (error) {
    buildError(error)
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const prisma = await buildPrisma();
  try {
    const { id } = await params;
    const user = await getCurrentUser({ request });
    const { content }: MessageRequest = await request.json();

    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!chatRoom) {
      return buildError({ error: "Chat room not found" });
    }

    const conversationHistory = chatRoom.messages.map(msg => ({
      role: msg.role === "USER" ? "user" as const : "assistant" as const,
      content: msg.content
    }));

    conversationHistory.push({
      role: "user" as const,
      content: content
    });

    const messages = [
      {
        role: "system" as const,
        content: "ユーザーの質問に対して、丁寧で分かりやすい回答をしてください。"
      },
      ...conversationHistory
    ];

    const aiResponse = await OpenAIService.getChatResponse(messages);

    await prisma.$transaction(async (tx) => {
      await tx.chatMessage.create({
        data: {
          chatRoomId: id,
          role: "USER",
          content,
        },
      });

      await tx.chatMessage.create({
        data: {
          chatRoomId: id,
          role: "SYSTEM",
          content: aiResponse,
        },
      });
    });

    return NextResponse.json({
      message: "Message sent successfully",
    });
  } catch (error) {
    buildError(error);
  }
}
