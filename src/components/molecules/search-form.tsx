"use client";

import { useState } from "react";
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
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Select what you want to analyze and enter the details below
      </p>
      <div className="flex gap-3">
        <SearchTypeSelect value={searchType} onValueChange={handleTypeChange} />

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
    </div>
  );
}
