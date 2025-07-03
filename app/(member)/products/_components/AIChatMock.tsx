'use client';

import { useState } from "react";
import { api } from "../../../_lib/api";

/**
 * Props
 */
type Props = {
  setIsChatOpen: (isOpen: boolean) => void;
};

/**
 * チャットメッセージ型
 */
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

/**
 * コンポーネント本体
 */
export const AIChatMock: React.FC<Props> = ({ setIsChatOpen }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await api.post<Record<string, any>, { reply: string; }>("/api/chat_rooms/e56902f0-d8c1-4a84-9d76-ee28a1a7e1c7/messages", {
        content: JSON.stringify(userMessage),
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: result.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-end z-50 p-4">
      <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-sm h-3/4 flex flex-col">
        <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold">AIアバター店員</h3>
          <button
            onClick={() => setIsChatOpen(false)}
            className="text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow p-4 overflow-y-auto space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
              <p className="inline-block bg-gray-100 text-gray-800 p-2 rounded-lg">
                {msg.content}
              </p>
            </div>
          ))}
          {isLoading && <p className="text-gray-400">AIが入力中...</p>}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
};