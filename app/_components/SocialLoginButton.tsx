
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "../_lib/supabase";

type Props = {
  provider: 'Google' | 'Apple' | 'LINE' | 'X' | 'Facebook' | 'Instagram';
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
}

export const SocialLoginButton: React.FC<Props> = ({ provider, icon: Icon, bgColor, textColor }) => {
  const { push } = useRouter();

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
    <button
      onClick={handleLogin}
      className={`
        flex items-center gap-2 justify-center w-full py-3 px-4 mb-3 rounded-xl
        text-lg font-semibold shadow-md transition-all duration-200
        hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${bgColor} ${textColor}
      `}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <Icon className="" size={24} />
      <span>{provider}でログイン</span>
    </button>
  );
};
