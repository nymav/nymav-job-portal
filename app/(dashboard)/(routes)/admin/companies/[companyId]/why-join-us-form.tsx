"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Company } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil, Lightbulb, Loader2, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import z from "zod";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";

interface WhyJoinUsFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  whyJoinUs: z.string().min(1),
});

export const WhyJoinUsForm = ({ initialData, companyId }: WhyJoinUsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollname, setRollname] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whyJoinUs: initialData.whyJoinUs || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Description updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong while updating the description");
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const prompt = `Generate a compelling reason why someone should join the role: ${rollname}.`;

      const response = await getGenerativeAIResponse(prompt);
      const cleaned = response.replace(/^'|'$/g, "").replace(/[\*\#]/g, "");

      setAiValue(cleaned);
      form.setValue("whyJoinUs", cleaned, { shouldValidate: true });
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
      <div className="font-semibold flex items-center justify-between">
        Why Join Us
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
        <div className="mt-2">
          {initialData.whyJoinUs ? (
            <Preview value={initialData.whyJoinUs} />
          ) : (
            <p className="text-sm italic text-purple-600">No description provided</p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 my-2">
            <Input
              type="text"
              placeholder="Enter position"
              value={rollname}
              onChange={(e) => setRollname(e.target.value)}
              className="flex-1 bg-black/20 border-purple-700 text-purple-300 placeholder-purple-500 focus-visible:ring-purple-500"
              disabled={isSubmitting || isPrompting}
            />
            <Button
              onClick={handlePromptGeneration}
              variant="outline"
              className="text-purple-400 hover:text-purple-300"
              disabled={isPrompting}
            >
              {isPrompting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
            </Button>
          </div>

          {aiValue && (
            <div className="w-full h-96 max-h-96 rounded-md bg-black/20 overflow-y-scroll p-3 relative mt-4 text-purple-300">
              {aiValue}
              <Button
                className="absolute top-3 right-3 z-10 text-purple-300 border border-purple-600"
                variant="outline"
                size="icon"
                onClick={onCopy}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <Controller
                control={form.control}
                name="whyJoinUs"
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