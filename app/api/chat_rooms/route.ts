import { buildPrisma } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_lib/getCurrentUser";
import { buildError } from "../_lib/buildError";
import { MessageRequest } from "@/app/_types/chatMassage/MessageRequest";
import { OpenAIService } from "../_services/OpenAIService";

export async function GET(request: NextRequest) {
	const prisma = await buildPrisma();
	try {
		const user = await getCurrentUser({ request });

		const chatRooms = await prisma.chatRoom.findMany({
			where: { userId: user.id },
		});

		return NextResponse.json({
			chatRooms
		});
	} catch (error) {
		buildError(error)
	}
}

export async function POST(request: NextRequest) {
	const prisma = await buildPrisma();
	try {
		const user = await getCurrentUser({ request });
		const { content }: MessageRequest = await request.json();

		// AIにタイトルを生成してもらう
		const titleMessages = [
			{
				role: "system" as const,
				content: "以下のユーザーの質問から、簡潔で適切なチャットルームのタイトルを生成してください。20文字以内で、質問の要点を表すタイトルにしてください。"
			},
			{
				role: "user" as const,
				content: content
			}
		];

		const generatedTitle = await OpenAIService.getChatResponse(titleMessages);

		const responseMessages = [
			{
				role: "system" as const,
				content: "ユーザーの質問に対して、丁寧で分かりやすい回答をしてください。"
			},
			{
				role: "user" as const,
				content: content
			}
		];
		const aiResponse = await OpenAIService.getChatResponse(responseMessages);

		let newChatRoomId: string | null = null;

		await prisma.$transaction(async (tx) => {
			const newChatRoom = await tx.chatRoom.create({
				data: {
					userId: user.id,
					title: generatedTitle,
				}
			});

			newChatRoomId = newChatRoom.id;

			await tx.chatMessage.create({
				data: {
					content,
					chatRoomId: newChatRoom.id,
					role: "USER"
				}
			});

			await tx.chatMessage.create({
				data: {
					content: aiResponse,
					chatRoomId: newChatRoom.id,
					role: "SYSTEM"
				}
			});

		});

		return NextResponse.json({
			message: "success!!",
			roomId: newChatRoomId
		});

	} catch (error) {
		buildError(error)
	}
}
