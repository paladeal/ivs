"use Clint";
import { useFetch } from "./useFetch";
import { MessagesResponse } from "@/app/_types/chatMassage/MessagesResponse";

export const useChatMassages = ({roomId}:{roomId:string}) => {
    return useFetch<MessagesResponse>(`/api/chat_rooms/${roomId}/messages`);
}