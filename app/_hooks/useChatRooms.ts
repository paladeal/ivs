"use Clint";
import { useFetch } from "./useFetch";
import { ChatRoom } from "@prisma/client";
export const useChatRooms = () => {
    return useFetch<{chatRooms:ChatRoom[]}>("/api/chat_rooms");
}