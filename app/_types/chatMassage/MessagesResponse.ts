import { ChatRoom, ChatMessage } from "@prisma/client";
export type MessagesResponse = {
    chatRoom: ChatRoom,
    messages: ChatMessage[];
}