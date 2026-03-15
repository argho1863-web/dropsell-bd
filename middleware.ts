import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Protect admin dashboard
    if (pathname.startsWith("/admin-dashboard")) {
      if (!(token as any)?.isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Only require auth for checkout and admin routes
        if (pathname.startsWith("/checkout") || pathname.startsWith("/admin-dashboard")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/checkout/:path*", "/admin-dashboard/:path*"],
};
