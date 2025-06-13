"use client";

import { Category, Company, Job } from "@/lib/generated/prisma";
import { CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import Box from "@/components/box";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookmarkCheck,
  Bookmark,
  BriefcaseBusiness,
  Currency,
  Layers,
  Loader2,
  Network,
} from "lucide-react";
import { cn, formattedString } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface JobCardItemProps {
  job: Job & { company: Company | null; category?: Category | null; savedUsers?: string[] };
  userId: string | null;
}

export const JobCardItem = ({ job, userId }: JobCardItemProps) => {
  const company = job.company;
  const [isBookmarkedLoading, setIsBookmarkedLoading] = useState(false);
  const isSavedByUser = Boolean(userId && job.savedUsers?.includes(userId));
  const SavedIcon = isSavedByUser ? BookmarkCheck : Bookmark;
  const router = useRouter();
  

  const onClickSaveJob = async () => {
    if (!userId) {
      toast.error("Please sign in to save jobs.");
      return;
    }

    try {
      setIsBookmarkedLoading(true);
      if (isSavedByUser) {
        await axios.patch(`/api/jobs/${job.id}/removeJobFromCollection`);
        toast.success("Job removed from saved jobs.");
      } else {
        await axios.patch(`/api/jobs/${job.id}/savedJobToCollection`);
        toast.success("Job saved for later.");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while saving the job.");
    } finally {
      setIsBookmarkedLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-gray-700 bg-black/20 backdrop-blur p-5 shadow-sm hover:shadow-xl transition duration-300 w-full h-full flex flex-col justify-between"
    >
      {/* Header */}
      <Box className="justify-between items-start">
        <p className="text-sm text-purple-300">
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="text-purple-400 hover:text-purple-300"
          onClick={onClickSaveJob}
          aria-label="Toggle Bookmark"
        >
          {isBookmarkedLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SavedIcon className="w-4 h-4" />
          )}
        </Button>
      </Box>

      {/* Title & Company */}
      <Box className="items-start mt-2">
        <div className="w-full">
          <p className="text-purple-400 font-semibold text-base truncate">
            {job.title}
          </p>
          {company && (
            <Link
              href={`/company/${company.id}`}
              className="text-xs text-purple-500 hover:underline"
            >
              {company.name}
            </Link>
          )}
        </div>
      </Box>

      {/* Meta Info */}
      <Box className="flex flex-wrap gap-2 mt-3 text-purple-300 text-xs">
        {job.shiftTiming && (
          <div className="flex items-center">
            <BriefcaseBusiness className="w-4 h-4 mr-1" />
            {formattedString(job.shiftTiming)}
          </div>
        )}
        {job.workMode && (
          <div className="flex items-center">
            <Layers className="w-4 h-4 mr-1" />
            {formattedString(job.workMode)}
          </div>
        )}
        {job.hourlyRate && (
          <div className="flex items-center">
            <Currency className="w-4 h-4 mr-1" />
            {`${formattedString(job.hourlyRate)} $/hr`}
          </div>
        )}
        {job.yearsOfExperience && (
          <div className="flex items-center">
            <Network className="w-4 h-4 mr-1" />
            {formattedString(job.yearsOfExperience)}
          </div>
        )}
        {job.category?.name && (
          <div className="flex items-center">
            <Layers className="w-4 h-4 mr-1" />
            {job.category.name}
          </div>
        )}
      </Box>

      {/* Description */}
      {job.short_description && (
        <CardDescription className="text-xs mt-3 text-gray-300 leading-snug">
          {job.short_description}
        </CardDescription>
      )}

      {/* Tags */}
      {job.tags?.length > 0 && (
        <Box className="flex flex-wrap gap-2 mt-3">
          {job.tags.slice(0, 6).map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </Box>
      )}

      {/* Actions */}
      <Box className="flex flex-col gap-2 mt-4">
        <Link href={`/search/${job.id}`} className="w-full">
          <Button
            className="w-full border-purple-500 text-purple-400 hover:text-white hover:bg-purple-500/10"
            variant="outline"
          >
            Details
          </Button>
        </Link>
        <Button
          className="w-full text-white bg-purple-800 hover:bg-purple-900"
          variant="default"
          onClick={onClickSaveJob}
        >
          {isSavedByUser ? "Saved" : "Save for later"}
        </Button>
      </Box>
    </motion.div>
  );
};