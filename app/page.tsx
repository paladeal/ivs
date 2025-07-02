import { GuestLoginButton } from "./_components/GuestLoginButton";
export default function Home() {
  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">ivsのプロジェクトです</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <GuestLoginButton />
      </div>
    </div>
  );
}
