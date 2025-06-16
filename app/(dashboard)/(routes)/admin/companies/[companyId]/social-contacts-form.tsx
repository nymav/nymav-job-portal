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
import { Textarea } from "@/components/ui/textarea";
import { Company } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import z from "zod";

interface CompanySocialContactsFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  mail: z.string().min(1, { message: "Email is required" }),
  website: z.string().min(1, { message: "Website is required" }),
  linkedIn: z.string().min(1, { message: "LinkedIn is required" }),
  address_line_1: z.string().min(1, { message: "Address Line 1 is required" }),
  address_line_2: z.string().min(1, { message: "Address Line 2 is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipcode: z.string().min(1, { message: "Zipcode is required" }),
});

export const CompanySocialContactsForm = ({
  initialData,
  companyId,
}: CompanySocialContactsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail: initialData?.mail || "",
      website: initialData?.website || "",
      linkedIn: initialData?.linkedIn || "",
      address_line_1: initialData?.address_line_1 || "",
      address_line_2: initialData?.address_line_2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipcode: initialData?.zipcode || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company socials updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong while updating.");
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <div className="mt-6 border border-purple-700 bg-black/30 rounded-md p-6 text-purple-300">
      <div className="font-semibold flex items-center justify-between">
        Company Socials
        <Button
          onClick={toggleEditing}
          variant="ghost"
          className="text-purple-400 hover:text-purple-300"
        >
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          {[
            ["Email", initialData.mail],
            ["Website", initialData.website],
            ["LinkedIn", initialData.linkedIn],
            ["Address Line 1", initialData.address_line_1],
            ["Address Line 2", initialData.address_line_2],
            ["City", initialData.city],
            ["State", initialData.state],
            ["Zipcode", initialData.zipcode],
          ].map(([label, value]) => (
            <p key={label}>
              <span className="text-purple-400">{label}: </span>
              {value || <span className="italic text-purple-600">Not provided</span>}
            </p>
          ))}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
            {["mail", "website", "linkedIn"].map((fieldName) => (
              <FormField
                key={fieldName}
                name={fieldName as keyof z.infer<typeof formSchema>}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder={fieldName[0].toUpperCase() + fieldName.slice(1)}
                        {...field}
                        className="bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {["address_line_1", "address_line_2"].map((fieldName) => (
              <FormField
                key={fieldName}
                name={fieldName as keyof z.infer<typeof formSchema>}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder={fieldName.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        {...field}
                        className="bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="grid grid-cols-3 gap-4">
              {["city", "state", "zipcode"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  name={fieldName as keyof z.infer<typeof formSchema>}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder={fieldName[0].toUpperCase() + fieldName.slice(1)}
                          {...field}
                          className="bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500 focus-visible:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

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