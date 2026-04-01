import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Si el usuario está autenticado, continuar
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Rutas públicas - no requieren autenticación
        const publicPaths = ["/", "/auth/login", "/auth/register", "/api/auth"];
        if (publicPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }

        // Archivos estáticos y API pública
        if (
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon") ||
          pathname.startsWith("/public") ||
          pathname.includes(".") // archivos estáticos
        ) {
          return true;
        }

        // Rutas protegidas - requieren autenticación
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
