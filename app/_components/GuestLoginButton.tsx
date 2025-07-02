"use client";
import { supabase } from "../_lib/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const GuestLoginButton: React.FC = () => {
  const { push } = useRouter();
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_GUEST_USER_EMAIL!,
      password: process.env.NEXT_PUBLIC_GUEST_USER_PASSWORD!,
    });
    if (error) {
      console.error("ログイン失敗しました", error);
      toast.error("ログインに失敗しました");
      return;
    }
    toast.success("ゲストログインしました");
    push("/chat_rooms");
  };
  return (
    <button
      className={`
        flex items-center justify-center w-full py-3 px-4 mb-3 rounded-xl text-black
        text-lg font-semibold shadow-md transition-all duration-200
        hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
      onClick={handleLogin}
    >
      ゲストログイン
    </button>
  );
};
