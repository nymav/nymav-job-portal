import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { columns, CompanyColumns } from "./_components/columns";

const CompaniesOverviewPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCompanies: CompanyColumns[] = companies.map((company) => ({
    id: company.id,
    name: company.name || "",
    createdAt: company.createdAt.toLocaleDateString(),
  }));

  return (
    <div className="p-6 bg-black/30 text-purple-300 min-h-screen rounded-md shadow-md  border-purple-700">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-purple-400">Your Companies</h1>
        <Link href="/admin/companies/create">
          <Button className="bg-purple-800 hover:bg-purple-900 text-white">
            <Plus className="w-5 h-5 mr-2" />
            New Company
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={formattedCompanies}
          searchKey="name"
        />
      </div>
    </div>
  );
};

export default CompaniesOverviewPage;