"use client"
import { Rooms} from "./_components/Roooms";
import { Button } from "@/app/_components/Button";
import { LoginUser } from "@/app/_components/LoginUser";
export default function ChatRooms() {
  return (
    <div className="flex flex-col gap-3">
      <h1>チャットルーム一覧</h1>
      <div className="flex justfy-end">
        <LoginUser />
      </div>
      <Button>新しいチャット</Button>
      <Rooms />
    </div>
  );
}
