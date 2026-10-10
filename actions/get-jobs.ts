import { db } from "@/lib/db";
import { Job, Prisma } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { subMonths, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

type GetJobsParams = {
  title?: string;
  categoryId?: string;
  shiftTiming?: string;
  workMode?: string;
  yearsOfExperience?: string;
  savedJobs?: boolean;
  createdAtFilter?: string;
};

export const GetJobs = async ({
  title,
  categoryId,
  shiftTiming,
  workMode,
  yearsOfExperience,
  savedJobs,
  createdAtFilter,
}: GetJobsParams): Promise<Job[]> => {
  const { userId } = await auth();
  if (savedJobs && !userId) return [];

  try {
    const whereClause: Prisma.JobWhereInput = {
      isPublished: true,
    };

    const andConditions: Prisma.JobWhereInput[] = [];

    if (title) {
      andConditions.push({
        title: {
          contains: title,
          mode: "insensitive",
        },
      });
    }

    if (categoryId) {
      const cleanCategoryId = categoryId.replace(/^ObjectId\((.*)\)$/, "$1").replace(/['"]+/g, "");
      andConditions.push({ categoryId: cleanCategoryId });
    }

    if (shiftTiming) {
      andConditions.push({ shiftTiming });
    }

    if (workMode) {
      andConditions.push({ workMode });
    }

    if (yearsOfExperience) {
      andConditions.push({ yearsOfExperience });
    }

    if (createdAtFilter) {
      const now = new Date();

      let from: Date | null = null;
      let to: Date | null = new Date();

      switch (createdAtFilter) {
        case "today":
          from = startOfDay(now);
          to = endOfDay(now);
          break;
        case "yesterday":
          from = startOfDay(subDays(now, 1));
          to = endOfDay(subDays(now, 1));
          break;
        case "thisWeek":
          from = startOfWeek(now, { weekStartsOn: 1 }); // Monday
          to = endOfWeek(now, { weekStartsOn: 1 });
          break;
        case "lastWeek":
          from = startOfWeek(subDays(now, 7), { weekStartsOn: 1 });
          to = endOfWeek(subDays(now, 7), { weekStartsOn: 1 });
          break;
        case "lastMonth":
          from = startOfMonth(subMonths(now, 1));
          to = endOfMonth(subMonths(now, 1));
          break;
        default:
          break;
      }

      if (from && to) {
        andConditions.push({
          createdAt: {
            gte: from,
            lte: to,
          },
        });
      }
    }

    if (savedJobs && userId) andConditions.push({ savedUsers: { has: userId } });

    if (andConditions.length > 0) {
      whereClause.AND = andConditions;
    }

    const jobs = await db.job.findMany({
      where: whereClause,
      include: {
        company: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return jobs;
  } catch (error) {
    console.error("❌ Failed to fetch jobs:", error);
    return [];
  }
};