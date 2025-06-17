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
  MapPin,
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
      className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-sm hover:bg-gray-800/70 hover:border-gray-600/60 hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full h-full flex flex-col justify-between group"
    >
      {/* Header */}
      <Box className="justify-between items-start mb-4">
        <p className="text-sm text-gray-400 font-medium">
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
          onClick={onClickSaveJob}
          aria-label="Toggle Bookmark"
        >
          {isBookmarkedLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SavedIcon className={cn("w-4 h-4", isSavedByUser && "text-white fill-white")} />
          )}
        </Button>
      </Box>

      {/* Title & Company */}
      <Box className="items-start mb-4">
        <div className="w-full">
          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gray-100 transition-colors truncate">
            {job.title}
          </h3>
          {company && (
            <Link
              href={`/company/${company.id}`}
              className="text-sm text-gray-400 hover:text-white hover:underline transition-colors inline-flex items-center"
            >
              <BriefcaseBusiness className="w-4 h-4 mr-1" />
              {company.name}
            </Link>
          )}
        </div>
      </Box>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-3 mb-4 text-gray-300 text-sm">
        {job.shiftTiming && (
          <div className="flex items-center bg-gray-800/60 px-3 py-1 rounded-lg">
            <BriefcaseBusiness className="w-4 h-4 mr-2" />
            {formattedString(job.shiftTiming)}
          </div>
        )}
        {job.workMode && (
          <div className="flex items-center bg-gray-800/60 px-3 py-1 rounded-lg">
            <MapPin className="w-4 h-4 mr-2" />
            {formattedString(job.workMode)}
          </div>
        )}
        {job.hourlyRate && (
          <div className="flex items-center bg-gray-800/60 px-3 py-1 rounded-lg">
            <Currency className="w-4 h-4 mr-2" />
            {`${formattedString(job.hourlyRate)} $/hr`}
          </div>
        )}
        {job.yearsOfExperience && (
          <div className="flex items-center bg-gray-800/60 px-3 py-1 rounded-lg">
            <Network className="w-4 h-4 mr-2" />
            {formattedString(job.yearsOfExperience)}
          </div>
        )}
        {job.category?.name && (
          <div className="flex items-center bg-gray-800/60 px-3 py-1 rounded-lg">
            <Layers className="w-4 h-4 mr-2" />
            {job.category.name}
          </div>
        )}
      </div>

      {/* Description */}
      {job.short_description && (
        <CardDescription className="text-sm mb-4 text-gray-300 leading-relaxed line-clamp-3">
          {job.short_description}
        </CardDescription>
      )}

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {job.tags.slice(0, 4).map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="bg-gray-800/80 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-700/50"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 4 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{job.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-auto">
        <Link href={`/search/${job.id}`} className="w-full">
          <Button
            className="w-full bg-gray-800/80 hover:bg-gray-700/90 text-white border border-gray-600/40 hover:border-gray-500/60 hover:scale-105 transition-all duration-200 shadow-lg"
            variant="outline"
          >
            View Details
          </Button>
        </Link>
        <Button
          className="w-full text-black bg-white hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg font-semibold"
          variant="default"
          onClick={onClickSaveJob}
          disabled={isBookmarkedLoading}
        >
          {isBookmarkedLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <SavedIcon className="w-4 h-4 mr-2" />
          )}
          {isSavedByUser ? "Saved" : "Save Job"}
        </Button>
      </div>
    </motion.div>
  );
};