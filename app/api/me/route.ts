import { buildPrisma } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { UserResponse } from "@/app/_types/me/UserResponse";
import { supabase } from "@/app/_lib/supabase";
import { buildError } from "@/app/api/_lib/buildError";

export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  try {
    const token = request.headers.get("Authorization") ?? "";
    const { data } = await supabase.auth.getUser(token);
    const currentUser = data.user
      ? await prisma.user.findUnique({
          where: {
            supabaseUserId: data.user.id,
          },
        })
      : null;

    if (!currentUser)
      return NextResponse.json<UserResponse|null>(null, {
        status: 200,
      });

    return NextResponse.json<UserResponse>(currentUser, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
