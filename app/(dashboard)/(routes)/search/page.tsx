// app/search/page.tsx

import { GetJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import { JobCardItem } from "./_components/job-card-item";
import type { Job, Company, Category } from "@/lib/generated/prisma";

interface SearchProps {
  searchParams: {
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
  };
}

type JobWithExtras = Job & {
  company: Company | null;
  category?: Category | null;
  savedUsers?: string[];
};

const SearchPage = async ({ searchParams }: SearchProps) => {
  // Fetch categories (for filters or category list)
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  // Get current userId for saved job UI logic
  const { userId } = await auth();

  // Fetch filtered jobs from your GetJobs action
  const jobs = (await GetJobs(searchParams)) as JobWithExtras[];

  return (
    <div className="w-full min-h-screen py-6 px-4 sm:px-6 text-white bg-transparent font-sans">
      {/* Mobile search bar */}
      <div className="block md:hidden mb-6">
        <SearchContainer />
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