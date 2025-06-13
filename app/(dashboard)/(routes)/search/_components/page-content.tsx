"use client";

import type { Category, Company, Job } from "@/lib/generated/prisma";
import { motion, AnimatePresence } from "framer-motion";
import { JobCardItem } from "./job-card-item";

type ExtendedJob = Job & {
  company: Company | null;
  category?: Category | null;
  savedUsers?: string[];
};

interface PageContentProps {
  jobs: ExtendedJob[];
  userId: string | null;
}

export const PageContent = ({ jobs, userId }: PageContentProps) => {
  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col w-full h-[60vh]">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.05,
            delay: 0.3,
            staggerChildren: 0.05,
            when: "beforeChildren",
          }}
          className="text-2xl md:text-4xl font-mono text-neutral-500"
        >
          {"404 - Not Found".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </div>
    );
  }

  return (
    <section
      className="pt-6 w-full"
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <AnimatePresence>
        <motion.div
          layout
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        >
          {jobs.map((job) => (
            <JobCardItem key={job.id} job={job} userId={userId} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};