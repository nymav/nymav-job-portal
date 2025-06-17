import { GetJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import { JobCardItem } from "./_components/job-card-item";
import type { Job, Company, Category } from "@/lib/generated/prisma";
import { Suspense } from "react";
import { Search, Filter, Briefcase } from "lucide-react";

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

  // Get active filters count for display
  const activeFiltersCount = Object.values(resolvedParams).filter(Boolean).length;

  return (
    <div className="w-full min-h-screen bg-transparent">
      {/* Header Section */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-lg mb-8 mx-4 sm:mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Find Your Dream Job
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover opportunities that match your skills and career goals
            </p>
          </div>

          {/* Desktop Search Container */}
          <div className="hidden md:block">
            <Suspense fallback={
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 animate-pulse">
                <div className="h-12 bg-gray-700/50 rounded-lg"></div>
              </div>
            }>
              <SearchContainer />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Mobile Search Bar */}
        <div className="block md:hidden">
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 shadow-lg">
            <Suspense fallback={
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 animate-pulse">
                <div className="h-12 bg-gray-700/50 rounded-lg"></div>
              </div>
            }>
              <SearchContainer />
            </Suspense>
          </div>
        </div>

        {/* Filters and Results Summary */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-white">
                <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
                <span className="font-semibold text-lg">
                  {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
                </span>
              </div>
              {activeFiltersCount > 0 && (
                <div className="flex items-center bg-blue-900/40 border border-blue-700/50 rounded-lg px-3 py-1">
                  <Filter className="w-4 h-4 mr-1 text-blue-400" />
                  <span className="text-blue-300 text-sm font-medium">
                    {activeFiltersCount} Filter{activeFiltersCount !== 1 ? 's' : ''} Applied
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-lg overflow-hidden">
          <CategoriesList categories={categories} />
        </div>

        {/* Jobs Grid */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-lg">
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {jobs.map((job) => (
                <JobCardItem key={job.id} job={job} userId={userId} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Jobs Found</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto mb-6">
                We couldn't find any jobs matching your current search criteria. 
                Try adjusting your filters or search terms.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Try using different keywords</p>
                <p>• Remove some filters to broaden your search</p>
                <p>• Check back later for new job postings</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;