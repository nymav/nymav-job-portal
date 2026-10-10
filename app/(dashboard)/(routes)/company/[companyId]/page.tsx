import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { objectId } from "@/lib/validation";
import { JobCardItem } from "../../search/_components/job-card-item";
import { auth } from "@clerk/nextjs/server";
export default async function CompanyPage({params}:{params:Promise<{companyId:string}>}) {
  const {companyId} = await params;
  if (!objectId.safeParse(companyId).success) notFound();
  const company = await db.company.findUnique({where:{id:companyId},include:{jobs:{where:{isPublished:true},orderBy:{createdAt:"desc"}}}});
  if (!company) notFound();
  const {userId} = await auth();
  return <div className="mx-auto max-w-6xl py-10"><h1 className="text-4xl font-semibold text-white">{company.name}</h1><p className="mt-5 whitespace-pre-line leading-relaxed text-gray-300">{company.overview || company.description || "No company overview yet."}</p><h2 className="mb-6 mt-10 text-xl font-semibold text-white">Open roles</h2><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{company.jobs.map(job => <JobCardItem key={job.id} job={{...job,company}} userId={userId} />)}</div>{!company.jobs.length && <p className="text-gray-400">No published openings.</p>}</div>;
}
