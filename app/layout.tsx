import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: { default: "Job Portal", template: "%s | Job Portal" }, description: "Search openings, save roles, and manage job applications in one workspace." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <ClerkProvider>{children}<ToastProvider /></ClerkProvider> : <>{children}<ToastProvider /></>}
      </body>
    </html>
  );
}