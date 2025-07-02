"use client";
import { RoomTitle } from "./_components/RoomTitle";
import { Messages } from "./_components/Messages";
import { NewMessage } from "./_components/NewMessage";
import Link from "next/link";

export default function ChatRoom() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <RoomTitle />
            <Link
              href="/chat_rooms"
              className="block inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              一覧に戻る
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 py-6 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <Messages />
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 shadow-sm w-full">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <NewMessage />
        </div>
      </div>
    </div>
  );
}
