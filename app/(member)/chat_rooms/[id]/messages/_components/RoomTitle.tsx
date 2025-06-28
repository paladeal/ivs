"use client";
import { useChatMassages } from "@/app/_hooks/useChatMessages";
import { useParams } from "next/navigation";

export const RoomTitle: React.FC = () => {
    const { id } = useParams();
    const { data, error } = useChatMassages({ roomId: id as string })

    if (error) {
        return (
            <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-red-600 font-medium">エラーが発生しました</span>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-gray-500 font-medium">読み込み中...</span>
            </div>
        )
    }

    return (
        <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <h1 className="text-xl font-semibold text-gray-900 truncate">
                {data.chatRoom.title}
            </h1>
        </div>
    )
}