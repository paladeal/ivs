"use client";
import { useChatMassages } from "@/app/_hooks/useChatMessages";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export const Messages: React.FC = () => {
  const { id } = useParams();
  const { data, error } = useChatMassages({ roomId: id as string })
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);
  if (!data) return <p className="text-gray-500">メッセージを読み込んでいます...</p>
  if (error) return <p className="text-gray-500 text-sm mt-1">{error.message}</p>

  if (data.messages.length === 0)
    return <p className="text-gray-500 font-medium">まだメッセージがありません</p>

  return (
    <div className="space-y-4 px-2 pb-6 w-full">
      {data.messages.map(message => {
        const isSystemMessage = message.role === "SYSTEM";
        return (
          <div
            key={message.id}
            className={`w-full flex ${isSystemMessage ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`
                max-w-[75%]
                p-3 md:p-4 rounded-xl shadow-md transition-all duration-200 ease-in-out
                ${isSystemMessage
                  ? 'bg-green from-white to-gray-50 border border-gray-200 text-gray-800 rounded-bl-none'
                  : 'bg-red from-blue-500 to-blue-600 text-white rounded-br-none'
                }
              `}
            >
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words font-sans">
                {message.content}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}