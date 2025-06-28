"use client";
import { useChatRooms } from "@/app/_hooks/useChatRooms";

export const Rooms:React.FC =()=>{
    const { data, error } = useChatRooms();

    if(!data) return <div>読み込み中...</div>;
    if(error) return <div>{error.message}</div>;
    if(data.chatRooms.length === 0) return <div>チャットルームがありません</div>;
    return (
    <div className="space-y-4 p-4">
      {data.chatRooms.map((room) => (
        <div key={room.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">{room.title}</h2>
          {room.updatedAt && (
            <p className="text-xs text-gray-500 mt-1">更新日時: {new Date(room.updatedAt).toLocaleString()}</p>
          )}
        </div>
      ))}
    </div>
  );
};