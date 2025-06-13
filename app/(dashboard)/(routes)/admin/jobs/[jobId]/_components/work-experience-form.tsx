"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Pencil } from "lucide-react";
import type { Job } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";

interface YearsOfExperienceFormProps {
  initialData: Job;
  jobId: string;
}

const options = [
  { value: "0-1", label: "0–1 years" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-7", label: "5–7 years" },
  { value: "7-10", label: "7–10 years" },
  { value: "10+", label: "10+ years" },
];

const formSchema = z.object({
  yearsOfExperience: z.string().min(1, { message: "Experience is required" }),
});

export const YearsOfExperienceForm = ({ initialData, jobId }: YearsOfExperienceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: initialData.yearsOfExperience || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Experience updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Failed to update experience");
    }
  };

  const toggleEditing = () => setIsEditing((cur) => !cur);

  const selectedOption = options.find((option) => option.value === initialData.yearsOfExperience);

  return (
    <div className="mt-6 border border-purple-700 bg-black/30 rounded-md p-6 text-purple-300">
      <div className="flex items-center justify-between font-semibold">
        Experience
        <Button onClick={toggleEditing} variant="ghost" className="text-purple-400 hover:text-purple-300">
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <p className={cn("text-sm mt-2", !initialData.yearsOfExperience && "text-purple-600 italic")}>
          {selectedOption?.label || "No experience added"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox heading="Experience" options={options} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="bg-purple-800 hover:bg-purple-900 text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};