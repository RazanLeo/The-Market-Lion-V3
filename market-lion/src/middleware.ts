import { NextResponse, type NextRequest } from "next/server";

// Server-only secret cookie name for admin sessions. Different from user session.
const ADMIN_COOKIE = "ml_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Routes that must be hidden from the public — admin namespace
  if (pathname.startsWith("/admin")) {
    // Allow only /admin/login and /admin/logout without auth; everything else requires the admin cookie.
    if (pathname === "/admin/login" || pathname === "/admin/logout") return NextResponse.next();
    const adminCookie = req.cookies.get(ADMIN_COOKIE);
    if (!adminCookie) {
      // Hide entirely from regular users: return 404 page (Next will render not-found if available, otherwise 404)
      const notFoundUrl = req.nextUrl.clone();
      notFoundUrl.pathname = "/admin/login";
      // Pretend it doesn't exist by replying with 404 status while serving the login page (separate entry)
      return NextResponse.redirect(notFoundUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
