import { buildPrisma } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_lib/getCurrentUser";
import { buildError } from "../_lib/buildError";
export async function GET(request: NextRequest) {
    const prisma = await buildPrisma();
    try {
        const user = await getCurrentUser({ request });

        const chatRooms = await prisma.chatRoom.findMany({
            where: { userId: user.id },
        });

        return NextResponse.json({
            chatRooms
        });
    } catch (error) {
        buildError(error)
    }
}
