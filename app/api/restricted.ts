import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session) {
    return NextResponse.json({
      content: "This is protected content. You can access this content because you are signed in.",
    });
  } else {
    return NextResponse.json({
      error: "You must be signed in to view the protected content on this page.",
    }, { status: 401 });
  }
}
