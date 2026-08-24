import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/jwt-secret";

const publicPaths = new Set(["/", "/login", "/cadastro"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Verificar se é um caminho público ou estático
  const isPublicPath = publicPaths.has(pathname);
  const isStaticFile = pathname.startsWith("/_next") || pathname === "/favicon.ico";

  if (isPublicPath || isStaticFile) {
    return NextResponse.next();
  }

  // 2. Tentar obter o token
  const token = request.cookies.get("session-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // 3. Verificar o token
    await jwtVerify(token, getJwtSecret());
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware Auth Error:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
