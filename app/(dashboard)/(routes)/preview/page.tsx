import { Suspense } from "react";
import Link from "next/link";
import { SearchContainer } from "@/components/search-container";
import { JobCardItem } from "../search/_components/job-card-item";
import { previewJobs } from "@/lib/preview-data";

export default async function PreviewPage({searchParams}:{searchParams:Promise<{title?:string}>}) {
  const {title=""} = await searchParams;
  const jobs = previewJobs.filter(job => job.title.toLowerCase().includes(title.toLowerCase()));
  return <div className="mx-auto max-w-6xl py-10">
    <div className="mb-8 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm text-indigo-200">Read-only preview · Fictional listings. No sign-in, database writes, or applications. <Link href="/setup" className="underline">Connect services</Link></div>
    <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs uppercase tracking-widest text-gray-400">Explore the workspace</p><h1 className="text-4xl font-semibold tracking-tight text-white">Find your next opportunity</h1><p className="mt-3 text-gray-400">Search sample roles to explore the interface.</p></div></div>
    <Suspense><SearchContainer /></Suspense>
    <p aria-live="polite" className="my-6 text-sm text-gray-400">{jobs.length} sample {jobs.length===1?"role":"roles"}</p>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{jobs.map(job => <JobCardItem key={job.id} job={job} userId={null} preview />)}</div>
    {!jobs.length && <div className="rounded-2xl border border-gray-800 p-10 text-center"><h2 className="text-xl text-white">No matching sample roles</h2><p className="mt-3 text-gray-400">Try “designer”, “frontend”, or “data”.</p><Link href="/preview" className="mt-6 inline-block text-indigo-300 underline">Clear search</Link></div>}
  </div>;
}
