"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil, Lightbulb, Loader2, X } from "lucide-react";
import getGenerativeAIResponse from "@/scripts/aistudio";
import type { Job } from "@/lib/generated/prisma";

interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
});

export const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags || []);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tags: jobTags },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Tags updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Failed to update tags");
    }
  };

  const toggleEditing = () => setIsEditing((cur) => !cur);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const promptText = `Generate a list of 10 relevant keywords related to the job profession "${prompt}". Return as JSON array.`;
      const data = await getGenerativeAIResponse(promptText);

      let cleaned = data.replace(/^json\s*/, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed)) {
        const newTags = parsed.filter((tag: string) => !jobTags.includes(tag));
        setJobTags((prev) => [...prev, ...newTags]);
      }
    } catch {
      toast.error("Failed to generate tags");
    } finally {
      setIsPrompting(false);
    }
  };

  const handleTagRemove = (index: number) => {
    setJobTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-6 border border-purple-700 bg-black/30 rounded-md p-6 text-purple-300">
      <div className="flex items-center justify-between font-semibold">
        Job Tags
        <Button onClick={toggleEditing} variant="ghost" className="text-purple-400 hover:text-purple-300">
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <div className="flex flex-wrap gap-2 mt-2">
          {jobTags.length > 0 ? (
            jobTags.map((tag, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 whitespace-nowrap rounded-md bg-purple-700 px-2 py-1 text-xs"
              >
                {tag}
              </div>
            ))
          ) : (
            <p className="italic text-purple-600">No tags</p>
          )}
        </div>
      )}

      {isEditing && (
        <>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Enter position"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isPrompting}
              className="bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500"
            />
            {isPrompting ? (
              <Button disabled variant="outline" className="text-purple-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button
                onClick={handlePromptGeneration}
                variant="outline"
                className="text-purple-400 hover:text-purple-300"
              >
                <Lightbulb className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-purple-500 text-right mt-1">Note: keyword is enough to generate tags</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {jobTags.map((tag, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 whitespace-nowrap rounded-md bg-purple-700 px-2 py-1 text-xs"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-0 h-auto"
                  onClick={() => handleTagRemove(idx)}
                >
                  <X className="w-3 h-3 text-purple-300" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setJobTags([]);
                onSubmit({ tags: [] });
              }}
              disabled={isSubmitting}
              className="text-purple-400"
            >
              Clear All
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => onSubmit({ tags: jobTags })}
              className="bg-purple-800 hover:bg-purple-900 text-white"
            >
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};