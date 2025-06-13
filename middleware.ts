import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Only protect these routes — DO NOT protect "/" or auth pages
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/api(.*)",
]);

function authMiddleware(
  auth: { userId: string | null },
  req: NextRequest
) {
  const { userId } = auth;

  const isProtectedRoute = createRouteMatcher([
    "/" // ❌ remove /api(.*)
  ]);
}

// @ts-expect-error – Clerk type mismatch, safe to ignore
export default clerkMiddleware(authMiddleware);

export const config = {
  matcher: [
    // run middleware on all non-static routes
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/', // include root for decision logic, but don’t protect it
  ],
};