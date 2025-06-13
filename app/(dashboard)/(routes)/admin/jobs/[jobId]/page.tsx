import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  Building2,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JobPublishAction } from "./_components/job-publish-actions";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { CategoryForm } from "./_components/category-form";
import { ShortDescription } from "./_components/short-description";
import { ShiftTimingForm } from "./_components/shift-timing-mode";
import { HourlyRateForm } from "./_components/horuly-rate-form";
import { WorkModeForm } from "./_components/work-mode-form";
import { YearsOfExperienceForm } from "./_components/work-experience-form";
import { JobDescription } from "./_components/job-description";
import { TagsForm } from "./_components/tags-form";
import { CompanyForm } from "./_components/company-form";

import type { Job } from "@/lib/generated/prisma";

export default async function JobDetailsPage({
  params,
}: {
  params: { jobId: string };
}) {
  const jobId = params.jobId;

  // Validate MongoDB ObjectId format
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(jobId)) {
    return redirect("/admin/jobs");
  }

  const { userId } = await auth();
  if (!userId) return redirect("/");

  const job: Job | null = await db.job.findUnique({
    where: {
      id: jobId,
      userId,
    },
  });

  if (!job) return redirect("/admin/jobs");

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const requiredFields = [job.title, job.description, job.categoryId];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href="/admin/jobs">
        <div className="flex items-center gap-3 text-sm text-neutral-500 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Job setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>

        <JobPublishAction
          jobId={jobId}
          isPublished={job.isPublished}
          disabled={!isComplete}
        />
      </div>

      {!job.isPublished && (
        <Banner
          variant={"warning"}
          label="This job is not published yet. You can publish it once all required fields are completed."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2 mb-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your job</h2>
          </div>

          <TitleForm initialData={job} jobId={job.id} />

          <CategoryForm
            initialData={{ categoryId: job.categoryId || undefined }}
            jobId={job.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          <ShortDescription initialData={job} jobId={job.id} />
          <ShiftTimingForm initialData={job} jobId={job.id} />
          <HourlyRateForm initialData={job} jobId={job.id} />
          <WorkModeForm initialData={job} jobId={job.id} />
          <YearsOfExperienceForm initialData={job} jobId={job.id} />
          <JobDescription initialData={job} jobId={job.id} />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2 mb-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl text-neutral-700">Job Requirements</h2>
            </div>
            <TagsForm initialData={job} jobId={job.id} />
          </div>

          <div>
            <div className="flex items-center gap-x-2 mb-2">
              <IconBadge icon={Building2} />
              <h2 className="text-xl text-neutral-700">Company Details</h2>
            </div>

            <CompanyForm
              initialData={job}
              jobId={job.id}
              options={companies.map((company) => ({
                label: company.name,
                value: company.id,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
