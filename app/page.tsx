import { GuestLoginButton } from "./_components/GuestLoginButton";
import { SocialLoginButtons } from "./_components/SocialLoginButtons";
export default function Home() {
  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-center">ivsのプロジェクトです</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-[400px] mx-auto">
        <GuestLoginButton />
        <SocialLoginButtons/>
      </div>
    </div>
  );
}
