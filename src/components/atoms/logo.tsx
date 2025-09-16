"use client";

import { Shield } from "lucide-react";

interface LogoProps {
  className?: string;
}

export function Logo({
  className = "h-16 w-16 text-blue-600 dark:text-blue-400",
}: LogoProps) {
  return <Shield className={className} />;
}
