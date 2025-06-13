import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";

// Define banner styles with improved dark theme contrast
const bannerVariants = cva(
  "border text-sm flex items-center w-full rounded-lg shadow-md px-4 py-3",
  {
    variants: {
      variant: {
        warning: "bg-yellow-100/10 border-yellow-300 text-yellow-200",
        success: "bg-emerald-800/20 border-emerald-500 text-emerald-300",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

// Icon mapping
const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

export const Banner = ({ variant, label }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="w-4 h-4 mr-2 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
};