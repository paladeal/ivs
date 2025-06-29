"use client";
import { useChatMassages } from "@/app/_hooks/useChatMessages";
import { useParams } from "next/navigation";

export const RoomTitle: React.FC = () => {
	const { id } = useParams();
	const { data, error } = useChatMassages({ roomId: id as string })

  if (!data) return <p className="font-medium">読み込み中...</p>
	if (error) return <p className="font-medium">エラーが発生しました</p>
	
	return (
		<div className="flex items-center">
			<h1 className="text-xl font-semibold text-gray-900 truncate">
				{data.chatRoom.title}
			</h1>
		</div>
	)
}