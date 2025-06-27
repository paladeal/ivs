"use client"
import { Button } from "./Button"
import { supabase } from "../_lib/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const LoginButton: React.FC = () => {
    const { push } = useRouter()
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
            console.error("ログイン失敗しました", error)
            toast.error("ログインに失敗しました");
        }
        toast.success("ゲストログインしました");
        push("/dashboard");
    }
    return (
        <Button variant="rose-gray" onClick={handleLogin}>ゲストログイン</Button>
    )
}