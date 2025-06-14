import { GetJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import { JobCardItem } from "./_components/job-card-item";
import type { Job, Company, Category } from "@/lib/generated/prisma";
import { Suspense } from "react";

type JobWithExtras = Job & {
  company: Company | null;
  category?: Category | null;
  savedUsers?: string[];
};

// ✅ Await searchParams (it's a Promise in Next.js 15)
const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
  }>;
}) => {
  const resolvedParams = await searchParams;

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const { userId } = await auth();

  const jobs = (await GetJobs(resolvedParams)) as JobWithExtras[];

  return (
    <div className="w-full min-h-screen py-6 px-4 sm:px-6 text-white bg-transparent font-sans">
      {/* Mobile search bar */}
      <div className="block md:hidden mb-6">
  <Suspense fallback={null}>
    <SearchContainer />
  </Suspense>
</div>

      {/* Categories filter/list */}
      <CategoriesList categories={categories} />

      {/* Jobs grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCardItem key={job.id} job={job} userId={userId} />)
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No jobs found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;