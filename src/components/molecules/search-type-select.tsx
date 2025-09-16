"use client";

import { Users, Package, Globe } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchSelectProps } from "@/lib/types";

export function SearchTypeSelect({ value, onValueChange }: SearchSelectProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "github-account":
        return <SiGithub className="h-4 w-4" />;
      case "npm-account":
        return <Users className="h-4 w-4" />;
      case "npm-package":
        return <Package className="h-4 w-4" />;
      case "npm-repo":
        return <Globe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-48">
        <div className="flex items-center gap-2">
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="github-account">
          <div className="flex items-center gap-2">
            <SiGithub className="h-4 w-4" />
            GitHub Account
          </div>
        </SelectItem>
        <SelectItem value="npm-account">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            NPM Account
          </div>
        </SelectItem>
        <SelectItem value="npm-package">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            NPM Package
          </div>
        </SelectItem>
        <SelectItem value="npm-repo">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            NPM Repository
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
