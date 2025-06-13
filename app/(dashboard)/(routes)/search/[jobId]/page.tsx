import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { JobDetailsPageContent } from "./_components/job-details-page-content";
import type { Job, Company, Category, AppliedJob, Resumes, UserProfile } from "@/lib/generated/prisma";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const { userId } = await auth();

  const job: (Job & { company: Company | null; category: Category | null }) | null = await db.job.findUnique({
    where: { id: params.jobId },
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
    <div className="flex flex-col p-4 md:p-8 max-w-4xl mx-auto">
      <JobDetailsPageContent
        job={job}
        jobId={job.id}
        userProfileInitial={profile}
        currentUserId={userId}
      />
    </div>
  );
};

export default JobDetailsPage;
