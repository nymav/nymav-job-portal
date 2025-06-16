"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import type { UserProfile, Resumes } from "@/lib/generated/prisma";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil, FileText, ExternalLink } from "lucide-react";

interface ResumeFormProps {
  initialData?: UserProfile & { resumes: Resumes[] };
  userId: string;
}

const formSchema = z.object({
  resumeUrl: z.string().url({ message: "Enter a valid URL" }),
});

export const ResumeForm = ({ initialData, userId }: ResumeFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const activeResume = initialData?.resumes?.find(
    (r) => r.id === initialData?.activeResumeId
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeUrl: activeResume?.url || "",
    },
  });

  const resumeUrl = useWatch({
    control: form.control,
    name: "resumeUrl",
  });

  const [previewUrl, setPreviewUrl] = useState(resumeUrl || "");

  useEffect(() => {
    setPreviewUrl(resumeUrl || "");
  }, [resumeUrl]);

  const { isSubmitting, isValid } = form.formState;

  const isPdf = (url: string) => url.toLowerCase().endsWith(".pdf");
  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);

  const toggleEditing = () => setIsEditing((cur) => !cur);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const resumeRes = await axios.post("/api/resumes", {
        name: "Resume",
        url: values.resumeUrl,
        userProfileId: userId,
      });

      const newResume = resumeRes.data;

      await axios.patch(`/api/users/${userId}`, {
        activeResumeId: newResume.id,
      });

      toast.success("Resume updated successfully");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update resume");
    }
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-600/40 rounded-xl p-6 hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-gray-400 mr-2" />
          <span className="font-medium text-white">Resume Document</span>
        </div>
        <Button
          onClick={toggleEditing}
          variant="ghost"
          className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="space-y-3">
          {previewUrl ? (
            <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3 border border-gray-600/30">
              <span className="text-sm text-gray-300 truncate mr-2">Resume uploaded</span>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View Resume
              </a>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-900/30 rounded-lg border border-gray-600/20 border-dashed">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm">No resume uploaded yet</p>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="resumeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Paste resume URL (Google Drive, Dropbox, etc.)"
                      className="bg-gray-900/50 border-gray-600/50 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-gray-500/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewUrl && (
              <div className="bg-gray-900/50 border border-gray-600/40 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Preview</h4>
                {isPdf(previewUrl) ? (
                  <iframe
                    src={previewUrl}
                    title="Resume PDF Preview"
                    className="w-full h-64 rounded border border-gray-600/30"
                  />
                ) : isImage(previewUrl) ? (
                  <img
                    src={previewUrl}
                    alt="Resume Preview"
                    className="max-h-64 mx-auto rounded border border-gray-600/30"
                  />
                ) : (
                  <div className="text-center py-4">
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Resume Link
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-x-3 pt-2">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-all duration-200"
              >
                {isSubmitting ? "Saving..." : "Save Resume"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};