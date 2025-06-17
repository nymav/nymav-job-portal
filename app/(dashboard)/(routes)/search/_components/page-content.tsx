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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.05,
              delay: 0.3,
              staggerChildren: 0.05,
              when: "beforeChildren",
            }}
            className="text-3xl md:text-5xl font-bold text-gray-400 mb-4 block"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {"No Jobs Found".split("").map((char, index) => (
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
          <p className="text-gray-500 text-lg">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <section
      className="pt-8 w-full"
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <AnimatePresence>
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        >
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <JobCardItem job={job} userId={userId} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};