import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { JobCardItem } from "../search/_components/job-card-item";

const SavedJobsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const savedJobs = await db.job.findMany({
    where: {
      isPublished: true,
      savedUsers: {
        has: userId,
      },
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full min-h-screen py-6 px-4 sm:px-6 text-white bg-transparent font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-purple-300">Saved Jobs</h1>

        {savedJobs.length === 0 ? (
          <p className="text-purple-200">You have not saved any jobs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-fr">
            {savedJobs.map((job) => (
              <JobCardItem key={job.id} job={job} userId={userId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;