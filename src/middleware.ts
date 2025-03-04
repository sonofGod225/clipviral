// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhooks/clerk",
  "/api/webhooks/stripe",
  "/pricing",
  "/blog",
  "/contact"
]);

const isSuperboardRoute = createRouteMatcher([
  "/superboard(.*)"]);

const isIgnoredRoute = createRouteMatcher([
  "/api/webhooks/clerk",
  "/api/webhooks/stripe"
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { has , sessionClaims , userId , sessionId , getToken } = await auth();
  const clerk = await clerkClient();
 
  if (!isPublicRoute(req) && !isIgnoredRoute(req)) {
      if(isSuperboardRoute(req) && userId) {
        const user = await clerk.users.getUser(userId);
        if(user.publicMetadata.role !== 'superadmin') {
          return NextResponse.redirect(new URL('/superboard/login', req.url));
        }
        return NextResponse.next();
      }else{
        await auth.protect();
      }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 