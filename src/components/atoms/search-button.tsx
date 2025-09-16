"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchButtonProps } from "@/lib/types";

export function SearchButton({
  onClick,
  isLoading,
  disabled,
}: SearchButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="bg-blue-600 hover:bg-blue-700"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
      ) : (
        <Search className="h-4 w-4" />
      )}
    </Button>
  );
}
