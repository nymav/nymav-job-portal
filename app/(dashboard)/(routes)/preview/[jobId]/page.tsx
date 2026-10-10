import Link from "next/link";
import { notFound } from "next/navigation";
import { previewJobs } from "@/lib/preview-data";
import { JobDetailsPageContent } from "../../search/[jobId]/_components/job-details-page-content";
export default async function PreviewDetails({params}:{params:Promise<{jobId:string}>}) {
  const {jobId} = await params;
  const job = previewJobs.find(job => job.id === jobId);
  if (!job) notFound();
  return <div className="mx-auto max-w-5xl py-10"><div className="mb-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm text-indigo-200">Sample role · Applications are unavailable in the preview. <Link href="/preview" className="underline">Back to sample listings</Link></div><JobDetailsPageContent job={{...job,category:null}} jobId={jobId} userProfileInitial={null} currentUserId={null} /></div>;
}
