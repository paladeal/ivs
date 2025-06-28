"use client"
import { Rooms } from "./_components/Roooms";
import { LoginUser } from "@/app/_components/LoginUser";
import { NewChatForm } from "./_components/NewChatForm";
export default function ChatRooms() {
  return (
    <div className="flex flex-col gap-3">
      <h1>チャットルーム一覧</h1>
      <div className="flex justify-end">
        <LoginUser />
      </div>
      <NewChatForm/>
      <Rooms />
    </div>
  );
}
