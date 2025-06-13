"use client";

import type { UserProfile, Resumes } from "@/lib/generated/prisma";
import { useEffect, useState } from "react";
import { Model } from "./model";
import Box from "../box";
import { Mail, Phone, FileText } from "lucide-react";

interface ApplyProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onConfirmAction: (selectedResumeId: string, contactEmail: string) => void;
  loading: boolean;
  userProfile: UserProfile & { resumes: Resumes[] };
}

export const ApplyModel = ({
  isOpen,
  onCloseAction,
  onConfirmAction,
  loading,
  userProfile,
}: ApplyProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    userProfile.resumes.length > 0 ? userProfile.resumes[0].id : ""
  );
  const [contactEmail, setContactEmail] = useState<string>(userProfile.email ?? "");
  const [contactPhone, setContactPhone] = useState<string>(userProfile.contact ?? "");

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      setSelectedResumeId(userProfile.resumes.length > 0 ? userProfile.resumes[0].id : "");
      setContactEmail(userProfile.email ?? "");
      setContactPhone(userProfile.contact ?? "");
    }
  }, [isOpen, userProfile]);

  if (!isMounted) return null;

  const handleConfirmClick = () => {
    if (!selectedResumeId) return alert("No resume found.");
    if (!contactEmail) return alert("Please enter your contact email.");
    onConfirmAction(selectedResumeId, contactEmail);
  };

  const resumeName =
    userProfile.resumes.find((r) => r.id === selectedResumeId)?.name ?? "No Resume Found";

  return (
    <Model
      title="Confirm Your Application"
      description="Review and confirm your details before applying."
      isOpen={isOpen}
      onClose={onCloseAction}
    >
      <Box className="space-y-6 w-full max-w-lg text-sm sm:text-base bg-gradient-to-b from-[#1f1027] via-[#1a0923] to-[#120015] p-6 rounded-xl shadow-lg border border-purple-900">
        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Your Contact Details</h3>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-300" />
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full p-2 rounded-md bg-black/60 text-white border border-purple-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Email"
            />
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-purple-300" />
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full p-2 rounded-md bg-black/60 text-white border border-purple-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Phone (optional)"
            />
          </div>
        </div>

        {/* Resume Display */}
        <div className="pt-2">
          <h3 className="font-semibold text-white text-lg mb-2">Resume</h3>
          {userProfile.resumes.length === 0 ? (
            <p className="text-yellow-400">You have not uploaded any resumes.</p>
          ) : (
            <div className="flex items-center gap-2 bg-black/40 px-4 py-3 rounded-lg border border-purple-800">
              <FileText className="w-5 h-5 text-purple-400" />
              <span className="text-purple-200 font-medium">{resumeName}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-purple-800">
          <button
            onClick={onCloseAction}
            disabled={loading}
            className="px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmClick}
            disabled={loading || userProfile.resumes.length === 0}
            className="px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Applying..." : "Confirm & Apply"}
          </button>
        </div>
      </Box>
    </Model>
  );
};