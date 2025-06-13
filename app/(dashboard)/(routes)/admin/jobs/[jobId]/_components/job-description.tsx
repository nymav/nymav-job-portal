"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil, Lightbulb, Loader2, Copy } from "lucide-react";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import getGenerativeAIResponse from "@/scripts/aistudio";
import type { Job } from "@/lib/generated/prisma";

interface JobDescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

export const JobDescription = ({ initialData, jobId }: JobDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState("");
  const [skills, setSkills] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job description updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Failed to update job description");
    }
  };

  const toggleEditing = () => setIsEditing((cur) => !cur);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const prompt = `Generate a detailed job description for the position: ${position}. Skills: ${skills}`;
      const data = await getGenerativeAIResponse(prompt);
      const cleaned = data.replace(/^'|'$/g, "").replace(/[\*\#]/g, "");
      setAiValue(cleaned);
      form.setValue("description", cleaned);
      form.trigger("description");
    } catch {
      toast.error("Failed to generate description");
    } finally {
      setIsPrompting(false);
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mt-6 border border-purple-700 bg-black/30 rounded-md p-6 text-purple-300">
      <div className="flex items-center justify-between font-semibold">
        Job Description
        <Button onClick={toggleEditing} variant="ghost" className="text-purple-400 hover:text-purple-300">
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-2">
          {initialData.description ? (
            <Preview value={initialData.description} />
          ) : (
            <p className="text-sm italic text-purple-600">No description provided</p>
          )}
        </div>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <Input
              placeholder="Enter position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="flex-1 bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500"
              disabled={isSubmitting || isPrompting}
            />
            <Input
              placeholder="Skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="flex-1 bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500"
              disabled={isSubmitting || isPrompting}
            />
            {isPrompting ? (
              <Button disabled variant="outline" className="text-purple-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button onClick={handlePromptGeneration} variant="outline" className="text-purple-400 hover:text-purple-300">
                <Lightbulb className="w-4 h-4" />
              </Button>
            )}
          </div>
          {aiValue && (
            <div className="relative mt-4 w-full max-h-96 overflow-y-auto rounded-md bg-black/20 p-3 text-purple-300">
              {aiValue}
              <Button
                variant="outline"
                size="icon"
                onClick={onCopy}
                className="absolute top-3 right-3 text-purple-300 border border-purple-600"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </>
      )}
    </div>
  );
};