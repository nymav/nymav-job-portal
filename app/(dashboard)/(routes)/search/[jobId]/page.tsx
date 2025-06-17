import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { JobDetailsPageContent } from "./_components/job-details-page-content";
import type {
  Job,
  Company,
  Category,
  AppliedJob,
  Resumes,
  UserProfile,
} from "@/lib/generated/prisma";

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  const { jobId } = await params;

  const { userId } = await auth();

  const job: (Job & {
    company: Company | null;
    category: Category | null;
  }) | null = await db.job.findUnique({
    where: { id: jobId },
    include: {
      company: true,
      category: true,
    },
  });

  if (!job) {
    redirect("/search");
  }

  const profile: (UserProfile & {
    resumes: Resumes[];
    appliedJobs: AppliedJob[];
  }) | null = userId
    ? await db.userProfile.findUnique({
        where: { userId },
        include: {
          resumes: { orderBy: { createdAt: "desc" } },
          appliedJobs: true,
        },
      })
    : null;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 text-white bg-transparent font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/20 pointer-events-none" />
        
        <div className="relative">
          <JobDetailsPageContent
            job={job}
            jobId={job.id}
            userProfileInitial={profile}
            currentUserId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;