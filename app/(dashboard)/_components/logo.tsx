import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-3 font-semibold text-white" aria-label="Job Portal home">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
      <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
    </span>
    <span>Job Portal</span>
  </Link>
);
