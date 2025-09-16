"use client";

import { Input } from "@/components/ui/input";
import { SearchInputProps } from "@/lib/types/components";

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  isLoading,
}: SearchInputProps) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      className="flex-1"
      disabled={isLoading}
    />
  );
}
