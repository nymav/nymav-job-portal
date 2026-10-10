import { ArrowUpRight, Bookmark, BriefcaseBusiness, FileText, Search } from "lucide-react";
import Link from "next/link";

const tools = [
  { icon: Search, title: "Find a role", description: "Browse published openings by title, category, work mode, and experience.", href: "/search", label: "Explore jobs" },
  { icon: Bookmark, title: "Keep a shortlist", description: "Save roles you want to revisit before deciding where to apply.", href: "/savedJobs", label: "Saved jobs" },
  { icon: FileText, title: "Prepare your profile", description: "Manage your contact details and choose a résumé for your application.", href: "/user", label: "Your profile" },
];

export default function HomePage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY && process.env.DATABASE_URL);
  return (
    <div className="mx-auto max-w-6xl py-10 sm:py-16">
      <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 px-6 py-12 sm:p-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <p className="relative mb-6 text-xs font-medium uppercase tracking-[.2em] text-indigo-300">Job Portal / Career workspace</p>
        <h1 className="relative max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">Your next role.<br /><span className="text-gray-400">A clearer way forward.</span></h1>
        <p className="relative mt-6 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">Find openings, build a shortlist, and apply with the résumé you choose. Keep the process in one place.</p>
        <div className="relative mt-9 flex flex-wrap gap-3">
          <Link href={configured ? "/search" : "/preview"} className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-medium text-gray-950 hover:bg-gray-200">Explore jobs <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
          <Link href="/user" className="rounded-xl border border-gray-700 px-6 py-3 font-medium text-gray-200 hover:bg-gray-900">Create your profile</Link>
        </div>
        <div className="relative mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-800 pt-6 text-sm text-gray-400"><span>Search & filter</span><span>Save openings</span><span>Choose your résumé</span></div>
      </section>
      <section aria-labelledby="workspace-title" className="mt-12">
        <h2 id="workspace-title" className="mb-6 text-xl font-semibold text-white">Make your next move</h2>
        <div className="grid gap-4 md:grid-cols-3">{tools.map(({icon: Icon, ...tool}) => (
          <Link key={tool.href} href={tool.href} className="group rounded-2xl border border-gray-800 bg-gray-950 p-6 transition-colors hover:border-gray-600">
            <Icon className="mb-6 h-6 w-6 text-indigo-300" aria-hidden="true" /><h3 className="text-lg font-medium text-white">{tool.title}</h3>
            <p className="mt-3 min-h-20 text-sm leading-relaxed text-gray-400">{tool.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm text-gray-200">{tool.label}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
          </Link>
        ))}</div>
      </section>
      <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-800 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4"><BriefcaseBusiness aria-hidden="true" className="h-6 w-6 text-gray-400" /><div><h2 className="font-medium text-white">Hiring for your team?</h2><p className="mt-1 text-sm text-gray-400">Manage your companies, openings, and applicants.</p></div></div>
        <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300">Open hiring workspace<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
