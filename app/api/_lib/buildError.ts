import { NextResponse } from "next/server";

export const buildError = async (e: unknown) => {
  console.error("Error captured:", e);
  if (e instanceof Error) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
};
