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
import { Pencil } from "lucide-react";
import type { Job } from "@/lib/generated/prisma";

interface HourlyRateFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  hourlyRate: z.string().min(1, { message: "Hourly rate is required" }),
});

export const HourlyRateForm = ({ initialData, jobId }: HourlyRateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hourlyRate: initialData.hourlyRate || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Hourly rate updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Failed to update hourly rate");
    }
  };

  const toggleEditing = () => setIsEditing((cur) => !cur);

  return (
    <div className="mt-6 border border-purple-700 bg-black/30 rounded-md p-6 text-purple-300">
      <div className="flex items-center justify-between font-semibold">
        Hourly Rate
        <Button onClick={toggleEditing} variant="ghost" className="text-purple-400 hover:text-purple-300">
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm mt-2">{initialData.hourlyRate ? `$${initialData.hourlyRate}/hr` : "$0/hr"}</p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter hourly rate"
                      disabled={isSubmitting}
                      {...field}
                      className="bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit" className="bg-purple-800 hover:bg-purple-900 text-white">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};