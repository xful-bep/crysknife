"use client";

import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { StatusBadgeProps } from "@/lib/types";

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <ShadcnBadge variant={variant} className="shrink-0">
      {children}
    </ShadcnBadge>
  );
}
