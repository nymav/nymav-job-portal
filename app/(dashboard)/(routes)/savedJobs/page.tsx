import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

const SavedJobsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const savedJobs = await db.job.findMany({
    where: {
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
          <p className="text-purple-200">You haven't saved any jobs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-fr">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-transparent border border-purple-700 rounded-xl p-4 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-purple-100">{job.title}</h2>
                <p className="text-sm text-purple-400">
                  {job.company?.name} • {job.category?.name} •{" "}
                  {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </p>
                <p className="mt-2 text-purple-200 text-sm line-clamp-2">
                  {job.short_description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;