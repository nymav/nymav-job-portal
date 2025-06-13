"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Lightbulb, Loader2 } from "lucide-react";
import getGenerativeAIResponse from "@/scripts/aistudio";
import type { Job } from "@/lib/generated/prisma";

interface ShortDescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  short_description: z.string().min(1, { message: "Short description is required" }),
});

export const ShortDescription = ({ initialData, jobId }: ShortDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      short_description: initialData.short_description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Short description updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Failed to update short description");
    }
  };

  const toggleEditing = () => setIsEditing((cur) => !cur);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const promptText = `Generate a short description for the job position: ${prompt}`;
      const generated = await getGenerativeAIResponse(promptText);
      form.setValue("short_description", generated);
      form.trigger("short_description");
    } catch {
      toast.error("Failed to generate description");
    } finally {
      setIsPrompting(false);
    }
  };

  return (
    <div className="mt-6 border border-purple-700 bg-black/30 rounded-md p-6 text-purple-300">
      <div className="flex items-center justify-between font-semibold">
        Short Description
        <Button onClick={toggleEditing} variant="ghost" className="text-purple-400 hover:text-purple-300">
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <p className="mt-2 text-sm italic text-purple-600">{initialData.short_description || "No short description provided"}</p>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
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
              <Button onClick={handlePromptGeneration} variant="outline" className="text-purple-400 hover:text-purple-300">
                <Lightbulb className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-purple-500 text-right mb-2">Note: keyword is enough to generate description</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="Short description"
                        {...field}
                        className="bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500"
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