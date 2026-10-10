import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/user(.*)", "/savedJobs(.*)", "/api(.*)"]);

const authenticatedMiddleware = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const configured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY && process.env.DATABASE_URL);
  if (!configured) {
    if (["/", "/setup"].includes(req.nextUrl.pathname) || req.nextUrl.pathname.startsWith("/preview")) return NextResponse.next();
    if (req.nextUrl.pathname.startsWith("/api")) return NextResponse.json({error:"Services are not configured. Preview is read-only."},{status:503});
    return NextResponse.redirect(new URL("/setup",req.url));
  }
  return authenticatedMiddleware(req, event);
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
