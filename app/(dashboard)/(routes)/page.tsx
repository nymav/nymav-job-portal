import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, Building2 } from "lucide-react";
import Link from "next/link";

const DashboardHomePage = async () => {
  const jobs = await db.job.findMany({
    where: { isPublished: true },
    include: { company: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const companies = await db.company.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="w-full min-h-screen py-6 px-4 sm:px-6 text-white bg-transparent font-sans">
      <h1 className="text-4xl font-bold mb-10 text-center text-purple-200">Dashboard</h1>

      {/* Recent Jobs */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-purple-300">
          <Briefcase className="w-6 h-6" /> Recent Jobs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-transparent border border-purple-700 rounded-xl p-4 hover:shadow-lg transition flex flex-col justify-between h-full"
            >
              <div className="mb-2">
                <h3 className="text-xl font-semibold text-purple-100">{job.title}</h3>
                <p className="text-sm text-purple-300 mt-1">
                  {job.company?.name} • {job.category?.name}
                </p>
                <p className="text-xs text-purple-400 mt-1">
                  {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </p>
              </div>
              <p className="mt-2 text-purple-200 text-sm line-clamp-2">
                {job.short_description}
              </p>
            </div>
          ))}
        </div>
      </div>

      
      

      {/* Quick Actions */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-purple-200 mb-4">Quick Actions</h2>
        <div className="flex justify-center flex-wrap gap-6">
          <Link
            href="/search"
            className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition"
          >
            Find Jobs
          </Link>
          <Link
            href="/savedJobs"
            className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition"
          >
            View Saved
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;