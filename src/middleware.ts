import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/utils/auth";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
 
  const verifiedToken =
    token &&
    (await verifyAuth(token).catch((err) => {
      console.error(err.message);
    }));

  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname === "/board"
  ) {
    if (!verifiedToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/board"],
};
