"use client";

import React, { useState, useEffect } from "react";
import type { Company, Job, Resumes, UserProfile, Category } from "@/lib/generated/prisma";
import { ApplyModel } from "@/components/ui/apply-model";
import toast from "react-hot-toast";
import axios from "axios";
import { Banner } from "@/components/banner";
import { useMemo } from "react";
import { 
  BriefcaseBusiness, 
  Currency, 
  MapPin, 
  Network, 
  Calendar,
  Building2,
  Layers,
  FileText,
  BookmarkCheck,
  Bookmark,
  ExternalLink
} from "lucide-react";

interface JobWithExtras extends Job {
  company: Company | null;
  category: Category | null;
}

interface JobDetailsPageContentProps {
  job: JobWithExtras;
  jobId: string;
  userProfileInitial: (UserProfile & { resumes: Resumes[]; appliedJobs?: { jobId: string }[] }) | null;
  currentUserId?: string | null;
}

export const JobDetailsPageContent = ({
  job,
  jobId,
  userProfileInitial,
  currentUserId,
}: JobDetailsPageContentProps) => {
  const [userProfile, setUserProfile] = useState(userProfileInitial);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const applied = useMemo(() => {
    return userProfile?.appliedJobs?.some((applied) => applied.jobId === jobId) ?? false;
  }, [userProfile, jobId]);
  const isSaved = job.savedUsers?.includes(currentUserId ?? "") ?? false;

  const handleApplyClick = () => {
    if (!currentUserId) {
      toast.error("Please log in to apply for this job.");
      return;
    }
    setApplyModalOpen(true);
  };

  const handleConfirmApply = async (resumeId: string, contactEmail: string) => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/users/${currentUserId}/appliedJobs`, {
        jobId,
        resumeId,
        contactEmail,
      });

      setUserProfile(response.data);

      await axios.post("/api/thankyou", {
        fullName: userProfile?.fullName,
        email: response.data.email,
      });

      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Something went wrong while applying.");
    } finally {
      setApplyModalOpen(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {job.title}
            </h1>
            {job.company && (
              <div className="flex items-center text-gray-300 text-lg mb-2">
                <Building2 className="w-5 h-5 mr-2" />
                {job.company.name}
              </div>
            )}
            {job.category && (
              <div className="flex items-center text-gray-400 text-base">
                <Layers className="w-4 h-4 mr-2" />
                {job.category.name}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl text-sm font-medium ${
              isSaved 
                ? 'bg-white text-black' 
                : 'bg-gray-800/60 text-gray-300 border border-gray-700/50'
            }`}>
              {isSaved ? (
                <><BookmarkCheck className="w-4 h-4 inline mr-1" />Saved</>
              ) : (
                <><Bookmark className="w-4 h-4 inline mr-1" />Not Saved</>
              )}
            </div>
          </div>
        </div>

        {/* Job Meta Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {job.shiftTiming && (
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <BriefcaseBusiness className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <div className="text-sm text-gray-500">Shift</div>
              <div className="text-white font-medium">{job.shiftTiming}</div>
            </div>
          )}
          {job.workMode && (
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <div className="text-sm text-gray-500">Work Mode</div>
              <div className="text-white font-medium">{job.workMode}</div>
            </div>
          )}
          {job.hourlyRate && (
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <Currency className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <div className="text-sm text-gray-500">Rate</div>
              <div className="text-white font-medium">${job.hourlyRate}/hr</div>
            </div>
          )}
          {job.yearsOfExperience && (
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <Network className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <div className="text-sm text-gray-500">Experience</div>
              <div className="text-white font-medium">{job.yearsOfExperience}</div>
            </div>
          )}
        </div>

        {/* Posted Date */}
        <div className="flex items-center text-gray-400 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Posted on {new Date(job.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-3" />
          Job Description
        </h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
            {job.description || "No detailed description provided for this position."}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-lg">
        <div className="text-center">
          {currentUserId ? (
            <button
              onClick={handleApplyClick}
              disabled={applied || loading}
              className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                applied
                  ? "bg-gray-700/80 cursor-not-allowed text-gray-400 border border-gray-600"
                  : "bg-white text-black hover:bg-gray-100 hover:scale-105 shadow-2xl"
              }`}
            >
              {applied ? "✓ Application Submitted" : "Apply for This Job"}
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 mb-4 text-lg">Ready to take your career to the next level?</p>
              <button className="px-12 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                Sign In to Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Resumes Section */}
      {userProfile && userProfile.resumes.length > 0 && (
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-3" />
            Your Resumes
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userProfile.resumes.map((resume) => (
              <div key={resume.id} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-700/60 transition-colors">
                <a
                  href={resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-white hover:text-gray-200 transition-colors group"
                >
                  <span className="font-medium truncate">{resume.name}</span>
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {userProfile && (
        <ApplyModel
          isOpen={applyModalOpen}
          onCloseAction={() => setApplyModalOpen(false)}
          onConfirmAction={handleConfirmApply}
          loading={loading}
          userProfile={userProfile}
        />
      )}

      {/* Success Banner */}
      {applied && (
        <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <Banner variant="success" label="Thank you for applying! We'll be in touch soon." />
        </div>
      )}
    </div>
  );
};