"use client";

import React, { useState, useEffect } from "react";
import type { Company, Job, Resumes, UserProfile, Category } from "@/lib/generated/prisma";
import { ApplyModel } from "@/components/ui/apply-model";
import toast from "react-hot-toast";
import axios from "axios";
import { Banner } from "@/components/banner";
import { useMemo } from "react";
import { currentUser } from "@clerk/nextjs/server";

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
      alert("Please log in to apply.");
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

      // Update userProfile state with response data (updated profile including appliedJobs)
      setUserProfile(response.data);

      await axios.post("/api/thankyou", {
        fullName: userProfile?.fullName,
        email: response.data.email,
      });

      toast.success("Job applied");
    } catch (error) {
      toast.error("Something went wrong while applying.");
    } finally {
      setApplyModalOpen(false);
      setLoading(false);
    }
  };

  return (
    <section
      className="space-y-10 max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg font-sans text-gray-100"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Job Info */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-purple-400">{job.title}</h1>
        <p className="text-sm text-gray-400 mt-1 font-medium">
          {job.company ? job.company.name : "Unknown Company"}
        </p>
        {job.category && (
          <p className="text-sm mt-2 italic text-indigo-400 font-semibold">
            Category: {job.category.name}
          </p>
        )}
        <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-300 text-lg">
          {job.description || "No description provided."}
        </p>
      </div>

      {/* Job Details */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 border-b border-purple-700 pb-2">Job Details</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-400 text-lg">
          <li><strong>Shift Timing:</strong> {job.shiftTiming || "Not specified"}</li>
          <li><strong>Hourly Rate:</strong> {job.hourlyRate || "Not specified"}</li>
          <li><strong>Work Mode:</strong> {job.workMode || "Not specified"}</li>
          <li><strong>Years of Experience:</strong> {job.yearsOfExperience || "Not specified"}</li>
          <li><strong>Posted On:</strong> {new Date(job.createdAt).toLocaleDateString()}</li>
          <li>
            <strong>Status:</strong>{" "}
            {isSaved ? (
              <span className="text-green-400 font-semibold">Saved</span>
            ) : (
              <span className="text-gray-500">Not saved</span>
            )}
          </li>
        </ul>
      </div>

      {/* Apply Button */}
      <div>
        {currentUserId ? (
          <>
            <button
              onClick={handleApplyClick}
              disabled={applied}
              className={`px-8 py-3 rounded-md font-semibold transition-colors duration-300 ${
                applied
                  ? "bg-gray-700 cursor-not-allowed text-gray-400"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              } shadow-lg`}
            >
              {applied ? "Applied" : "Apply"}
            </button>
            {/* Optional debug note */}
            {/* <p className="text-xs mt-1">
              Debug: applied={applied.toString()}, currentUserId={currentUserId}
            </p> */}
          </>
        ) : (
          <p className="text-yellow-400 font-medium">Log in to apply for this job.</p>
        )}
      </div>

      {/* User Resumes */}
      {userProfile && (
        <div>
          <h2 className="text-2xl font-semibold mb-3 border-b border-purple-700 pb-2">Your Resumes</h2>
          {userProfile.resumes.length === 0 ? (
            <p className="text-gray-500">You have no uploaded resumes.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {userProfile.resumes.map((resume) => (
                <li key={resume.id}>
                  <a
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {resume.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
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
      {applied && <Banner variant="success" label="Thank you for applying!" />}
    </section>
  );
};
