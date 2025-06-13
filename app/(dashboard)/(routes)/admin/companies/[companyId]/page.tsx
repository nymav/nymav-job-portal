

import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyName } from "./name-form";
import { CompanyDescriptionForm } from "./description-form";
import { CompanySocialContactsForm } from "./social-contacts-form";
import { CompanyOverviewForm } from "./company-overview";
import { WhyJoinUsForm } from "./why-join-us-form";
import type { Metadata } from "next"; // if you want to export metadata
import type { FC } from "react";

// Fix type for the function argument
interface CompanyPageProps {
  params: {
    companyId: string;
  };
}

const CompanyEditPage = async ({ params }: CompanyPageProps) => {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const isCreateMode = params.companyId === "create";

  if (!isCreateMode && !/^[0-9a-fA-F]{24}$/.test(params.companyId)) {
    return redirect("/admin/companies");
  }

  let company = null;

  if (!isCreateMode) {
    company = await db.company.findFirst({
      where: {
        id: params.companyId,
        userId,
      },
    });

    if (!company) return redirect("/admin/companies");
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const requiredFields = company
    ? [
        company.name,
        company.description,
        company.website,
        company.linkedIn,
        company.address_line_1,
        company.address_line_2,
        company.city,
        company.state,
        company.overview,
        company.whyJoinUs,
      ]
    : [];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = company ? `(${completedFields}/${totalFields})` : "(0/0)";
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6 bg-black/30 rounded-lg text-purple-300 min-h-screen">
      <Link href="/admin/companies">
        <div className="flex items-center gap-3 text-sm text-purple-400 hover:text-purple-300 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium text-purple-400">
            {isCreateMode ? "Create new company" : "Company setup"}
          </h1>
          {!isCreateMode && (
            <span className="text-sm text-purple-400">
              Complete All Fields {completionText}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2 mb-4">
            <IconBadge icon={LayoutDashboard} variant="default" size="default" />
            <h2 className="text-xl text-purple-300">
              {isCreateMode ? "Start setting up your company" : "Customize your company"}
            </h2>
          </div>

          {!isCreateMode && company && (
            <CompanyName
              initialData={{ name: company.name }}
              companyId={company.id}
            />
          )}

          {!isCreateMode && company && (
            <CompanyDescriptionForm
              initialData={company}
              companyId={company.id}
            />
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Network} variant="default" size="default" />
              <h2 className="text-xl text-purple-300">Company social contacts</h2>
            </div>

            {company && (
              <CompanySocialContactsForm initialData={company} companyId={company.id} />
            )}
          </div>
        </div>

        <div className="col-span-2">
          {company && (
            <CompanyOverviewForm initialData={company} companyId={company.id} />
          )}
        </div>
        {company && (
          <WhyJoinUsForm initialData={company} companyId={company.id} />
        )}
      </div>
    </div>
  );
};

export default CompanyEditPage;