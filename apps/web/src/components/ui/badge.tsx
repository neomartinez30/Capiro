import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700",
        secondary: "bg-gray-50 text-cool-grey",
        outline: "border border-gray-300 text-gray-700",
        success: "bg-status-approved-bg text-status-approved",
        warning: "bg-status-review-bg text-status-review",
        destructive: "bg-red-50 text-red-700",
        draft: "bg-status-draft-bg text-status-draft",
        review: "bg-status-review-bg text-status-review",
        approved: "bg-status-approved-bg text-status-approved",
        submitted: "bg-status-submitted-bg text-status-submitted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
