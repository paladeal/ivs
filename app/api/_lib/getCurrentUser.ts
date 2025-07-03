import { NextRequest } from "next/server";
import { buildPrisma } from "@/app/_lib/prisma";
import { supabase } from "@/app/_lib/supabase";
export const getCurrentUser = async ({ request }: { request: NextRequest }) => {
  const token = request.headers.get("Authorization") ?? "";
  if (!token) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    console.error("Supabase error:", error.message);
    throw new Error("Unauthorized");
  }
  const prisma = await buildPrisma();

  const user = await prisma.user.findUnique({
    where: {
      supabaseUserId: data.user.id,
    },
  });
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
};
