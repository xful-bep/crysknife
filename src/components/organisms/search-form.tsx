"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchTypeSelect, SearchInput } from "@/components/molecules";
import { SearchButton } from "@/components/atoms";
import { SearchType } from "@/lib/types";
import { getSearchTypePlaceholder } from "@/lib/utils/search-helpers";

interface SearchFormProps {
  onSearch: (type: SearchType, query: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [searchType, setSearchType] = useState<SearchType>("github-account");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    onSearch(searchType, searchQuery.trim());
  };

  const handleTypeChange = (value: string) => {
    setSearchType(value as SearchType);
  };

  const placeholder = getSearchTypePlaceholder(searchType);

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="gradient-border">
        <Card className="shadow-xl bg-card border-0 m-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Security Analysis
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Select what you want to analyze and enter the details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <SearchTypeSelect
                value={searchType}
                onValueChange={handleTypeChange}
              />

              <div className="flex-1 flex gap-2">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={handleSearch}
                  placeholder={placeholder}
                  isLoading={isLoading}
                />
                <SearchButton
                  onClick={handleSearch}
                  isLoading={isLoading}
                  disabled={!searchQuery.trim()}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
