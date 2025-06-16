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
import { Pencil, Mail } from "lucide-react";
import { UserProfile } from "@/lib/generated/prisma";

interface EmailFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const EmailForm = ({ initialData, userId }: EmailFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayEmail, setDisplayEmail] = useState(initialData?.email || "");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData?.email || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/users/${userId}`, values);
      toast.success("Email updated successfully");
      setDisplayEmail(values.email);
      setIsEditing(false);
    } catch {
      toast.error("Failed to update email");
    }
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-600/40 rounded-xl p-6 hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Mail className="w-5 h-5 text-gray-400 mr-2" />
          <span className="font-medium text-white">Email Address</span>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
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
        <div className="space-y-2">
          {displayEmail ? (
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600/30">
              <p className="text-gray-300 break-all">{displayEmail}</p>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 bg-gray-900/30 rounded-lg border border-gray-600/20 border-dashed">
              <Mail className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm">No email address provided</p>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoFocus
                      disabled={isSubmitting}
                      placeholder="Enter your email address"
                      {...field}
                      type="email"
                      className="bg-gray-900/50 border-gray-600/50 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-gray-500/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-3 pt-2">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-all duration-200"
              >
                {isSubmitting ? "Saving..." : "Save Email"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};