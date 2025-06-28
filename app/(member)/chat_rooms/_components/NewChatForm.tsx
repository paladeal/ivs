"use client";
import { api } from "@/app/_lib/api";
import { useState } from "react";
import {MessageRequest} from "@/app/_types/chatMassage/MessageRequest";
import { useRouter } from "next/navigation";

export const NewChatForm: React.FC = ( ) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {push} = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) return;
    setIsSubmitting(true);
    try {
      const {roomId} = await api.post<MessageRequest, { message: string; roomId: string }>(`/api/chat_rooms`, { content });
      setContent("");
      push(`/chat_rooms/${roomId}/messages`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <h2 className="text-lg font-semibold mb-3">新しいチャットを開始</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="p-2 border rounded resize-none"
          rows={3}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {isSubmitting ? "作成中..." : "チャットを開始"}
          </button>
        </div>
      </form>
    </div>
  );
};
