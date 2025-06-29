"use client"
import { Rooms } from "./_components/Roooms";
import { LoginUser } from "@/app/_components/LoginUser";
import { NewChatForm } from "./_components/NewChatForm";
export default function ChatRooms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">チャットルーム</h1>
          <LoginUser />
        </div>

        <div className="mb-8">
          <NewChatForm />
        </div>

        <Rooms />
      </div>
    </div>
  );
}
