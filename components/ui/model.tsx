"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModelProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Model = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModelProps) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent
        className="bg-gradient-to-b from-[#1f1027] via-[#1a0923] to-[#120015] border border-purple-900 shadow-xl rounded-xl text-white max-w-lg w-full p-6"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-300">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};