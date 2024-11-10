import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function GET() {
  const session = await verifySession();

  if (!session || !session.userId) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true, userId: session.userId });
}
