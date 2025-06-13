import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns, JobsColumns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const JobsPageOverview = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedJobs: JobsColumns[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company ? job.company.name : "N/A",
    category: job.category ? job.category.name : "Uncategorized",
    createdAt: job.createdAt.toLocaleDateString(),
    isPublished: job.isPublished,
  }));

  return (
    <div className="p-6 min-h-screen bg-black/30 text-purple-300 rounded-md">
      <div className="flex items-end justify-end">
        <Link href="/admin/create">
          <Button className="bg-purple-800 hover:bg-purple-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            New Job
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <DataTable columns={columns} data={formattedJobs} searchKey="title" />
      </div>
    </div>
  );
};

export default JobsPageOverview;