"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

export const JobPublishAction = ({ disabled, jobId, isPublished }: JobPublishActionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/jobs/${jobId}/unpublish`);
        toast.success("Job unpublished");
      } else {
        await axios.patch(`/api/jobs/${jobId}/publish`);
        toast.success("Job published");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/jobs/${jobId}`);
      toast.success("Job deleted");
      router.refresh();
      router.push("/admin/jobs");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-3">
      <Button variant="outline" size="sm" onClick={onClick} disabled={disabled || isLoading}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button variant="destructive" size="icon" onClick={onDelete} disabled={isLoading}>
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};