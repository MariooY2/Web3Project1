import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const account = request.cookies.get("userAccount")?.value;
  // Redirect to homepage if no account is found and the path is /owned
  if (!account && request.nextUrl.pathname === "/owned") {
   

    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Check ownership for /course/[id] paths
  if (request.nextUrl.pathname.startsWith("/course/")) {
    const courseId = request.nextUrl.pathname.split("/")[2];

    if (!account) {
      // Redirect if account is not found
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Fetch the ownership status from the API
    const response = await fetch(`${request.nextUrl.origin}/api/check-ownership?account=${account}&courseId=${courseId}`);
    const data = await response.json();
    
    if (!data.isOwner) {
      // Redirect if the user does not own the course
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Apply middleware only to the `/owned` and `/course` routes
export const config = {
  matcher: ["/owned", "/course/:path*"],
};
