import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  if (
    !token &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/projectDashboard") ||
      pathname.startsWith("/ImageGeneration") ||
      pathname.startsWith("/imageManipulation") ||
      pathname.startsWith("/imageMixActions"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (
    token &&
    (pathname.startsWith("/register") || pathname.startsWith("/login"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/",
    "/dashboard",
    "/projectDashboard/:path*",
    "/ImageGeneration",
    "/imageManipulation/:path*",
    "/imageMixActions/:path*",
  ],
};
