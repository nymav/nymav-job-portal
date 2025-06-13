// If you want client interactivity, else remove this line for server-only

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface Applicant {
  id: string;
  fullName: string;
  email: string;
  contact: string;
  resume: string;
  resumeName: string;
  appliedAt: string;
}

interface PageProps {
  params: { jobId: string };
}

const JobApplicantsPage = async ({ params }: PageProps) => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const job = await db.job.findUnique({
    where: { id: params.jobId, userId },
  });

  if (!job) redirect("/admin/jobs");

  const profiles = await db.userProfile.findMany({
    include: {
      resumes: { orderBy: { createdAt: "desc" } },
      appliedJobs: true, // make sure this is included in your Prisma schema
    },
  });

  const filteredProfiles = profiles.filter((profile: any) =>
    profile.appliedJobs?.some((aj: any) => aj.jobId === params.jobId)
  );

  const applicants: Applicant[] = filteredProfiles.map((profile: any) => {
    const appliedJob = profile.appliedJobs.find((aj: any) => aj.jobId === params.jobId);
    const latestResume = profile.resumes[0];
    return {
      id: profile.userId,
      fullName: profile.fullName ?? "",
      email: profile.email ?? "",
      contact: profile.contact ?? "",
      resume: latestResume?.url ?? "",
      resumeName: latestResume?.name ?? "Untitled",
      appliedAt: appliedJob?.appliedAt?.toISOString() ?? "",
    };
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-purple-300 border-b border-purple-600 pb-2">
        Job Applicants
      </h1>
      <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-lg bg-purple-900 text-purple-50">
        <thead className="bg-gradient-to-r from-purple-700 to-purple-800">
          <tr>
            <th className="px-6 py-3 font-semibold tracking-wide">Name</th>
            <th className="px-6 py-3 font-semibold tracking-wide">Email</th>
            <th className="px-6 py-3 font-semibold tracking-wide">Contact</th>
            <th className="px-6 py-3 font-semibold tracking-wide">Resume</th>
            <th className="px-6 py-3 font-semibold tracking-wide">Applied At</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((a) => (
            <tr
              key={a.id}
              className="border-b border-purple-700 hover:bg-purple-800 transition-colors duration-300"
            >
              <td className="px-6 py-4">{a.fullName}</td>
              <td className="px-6 py-4">{a.email}</td>
              <td className="px-6 py-4">{a.contact}</td>
              <td className="px-6 py-4">
                <a
                  href={a.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 underline hover:text-indigo-300"
                >
                  {a.resumeName}
                </a>
              </td>
              <td className="px-6 py-4">{new Date(a.appliedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobApplicantsPage;