"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import z from "zod";

interface CompanyNameProps {
  initialData: {
    name: string;
  };
  companyId: string;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const CompanyName = ({ initialData, companyId }: CompanyNameProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company name updated successfully");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while updating the company name");
    }
  };

  const toggleEditing = () => setIsEditing((cur) => !cur);

  return (
    <div className="mt-6 border border-purple-700 bg-black/20 rounded-xl p-5 text-purple-300 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">Company name</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleEditing}
          className="text-purple-400 hover:text-purple-300 px-2"
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm mt-2 text-purple-400">{initialData.name}</p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Enter company name"
                      className="bg-black/30 border border-purple-700 text-purple-300 placeholder-purple-600 focus-visible:ring-purple-600"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-3">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-purple-700 hover:bg-purple-800 text-white transition"
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