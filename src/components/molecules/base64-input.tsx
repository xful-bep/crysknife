"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Base64InputProps {
  onBase64Submit: (content: string) => void;
  disabled?: boolean;
  className?: string;
}

export function Base64Input({
  onBase64Submit,
  disabled = false,
  className,
}: Base64InputProps) {
  const [base64Value, setBase64Value] = useState("");

  const handleInputChange = (value: string) => {
    setBase64Value(value);
  };

  const handleSubmit = () => {
    if (base64Value.trim()) {
      // Pass the base64 value directly to the analyzer
      // The analyzer will handle the recursive decoding and show errors if needed
      onBase64Submit(base64Value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && base64Value.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="base64-input" className="text-sm font-medium">
          Base64 Encoded Data
        </Label>
        <Textarea
          id="base64-input"
          placeholder="Paste your base64 encoded leaked data here..."
          value={base64Value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="min-h-[120px] max-h-[300px] resize-none overflow-y-auto"
        />

        <p className="text-xs text-muted-foreground">
          Press Ctrl+Enter to analyze, or use the button below
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!base64Value.trim() || disabled}
        className="w-full"
      >
        Analyze Base64 Data
      </Button>
    </div>
  );
}
