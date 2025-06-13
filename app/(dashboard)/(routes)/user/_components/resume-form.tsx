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
import { Pencil } from "lucide-react";

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
    <div className="mt-6 border border-purple-700 bg-black/30 rounded-md p-6 text-purple-300">
      <div className="flex items-center justify-between font-semibold">
        <Button
          onClick={toggleEditing}
          variant="ghost"
          className="text-purple-400 hover:text-purple-300"
        >
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm mt-2 break-words">
          {previewUrl ? (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="underline">
              View Resume
            </a>
          ) : (
            "No resume linked"
          )}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="resumeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Paste resume URL"
                      className="bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewUrl && (
              <div className="mt-4 border border-purple-700 rounded p-2 bg-black/20">
                {isPdf(previewUrl) ? (
                  <iframe
                    src={previewUrl}
                    title="Resume PDF Preview"
                    className="w-full h-64"
                  />
                ) : isImage(previewUrl) ? (
                  <img
                    src={previewUrl}
                    alt="Resume Preview"
                    className="max-h-64 mx-auto"
                  />
                ) : (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Open Resume Link
                  </a>
                )}
              </div>
            )}

            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-purple-800 hover:bg-purple-900 text-white"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};