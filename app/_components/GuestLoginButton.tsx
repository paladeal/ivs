"use client"
import { Button } from "./Button"
import { supabase } from "../_lib/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const GuestLoginButton: React.FC = () => {
    const { push } = useRouter()
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword(
            {
                email: process.env.NEXT_PUBLIC_GUEST_USER_EMAIL!,
                password: process.env.NEXT_PUBLIC_GUEST_USER_PASSWORD!
            }
        );
        if (error) {
            console.error("ログイン失敗しました", error)
            toast.error("ログインに失敗しました");
            return;
        }
        toast.success("ゲストログインしました");
        push("/chat_rooms");
    }
    return (
        <Button variant="rose-gray" onClick={handleLogin}>ゲストログイン</Button>
    )
}