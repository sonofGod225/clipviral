// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
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

const isIgnoredRoute = createRouteMatcher([
  "/api/webhooks/clerk",
  "/api/webhooks/stripe"
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (!isPublicRoute(req) && !isIgnoredRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 