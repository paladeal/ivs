"use client";
import { useChatRooms } from "@/app/_hooks/useChatRooms";
import Link from "next/link";
export const Rooms: React.FC = () => {
  const { data, error } = useChatRooms();

  if (!data) return <span className="ml-3 text-gray-600">読み込み中...</span>
  if (error) return <p className="text-sm text-red-800">{error.message}</p>


  if (data.chatRooms.length === 0) return (
    <div className="text-center py-12">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">チャットルームがありません</h3>
      <p className="mt-1 text-sm text-gray-500">新しいチャットを開始してみましょう。</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">過去のチャット</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.chatRooms.map((room) => (
          <Link
            key={room.id}
            href={`/chat_rooms/${room.id}/messages`}
            className="group block"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group-hover:border-blue-300">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                    {room.title}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};