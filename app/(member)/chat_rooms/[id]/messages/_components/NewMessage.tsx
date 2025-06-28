"use client";
import { api } from "@/app/_lib/api";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useChatMassages } from "@/app/_hooks/useChatMessages";
import { MessageRequest } from "@/app/_types/chatMassage/MessageRequest";

export const NewMessage: React.FC = () => {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useChatMassages({ roomId: id as string });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post<MessageRequest>(`/api/chat_rooms/${id}/messages`, { content });
      mutate();
      setContent("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim() && !isSubmitting) {
        // フォームを直接送信
        e.currentTarget.form?.requestSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 w-full">
      <div className="flex-1 w-full">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力してください..."
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[48px] max-h-32 overflow-y-auto"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 128) + 'px';
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="w-full flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
      >
        {isSubmitting ? (
          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full">送信中</div>
        ) : (
          <div>送信する
          </div>
        )}
      </button>
    </form>
  )
}