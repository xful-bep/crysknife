"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import {
  HeaderSection,
  InputSource,
  AnalysisResults,
  InformationSection,
  Footer,
} from "@/components/organisms";
import { SearchType, CompromisedData } from "@/lib/types";
import { performClientAnalysis } from "@/lib/analyzers/client-index";

export function SecurityAnalysisTemplate() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CompromisedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchType, setCurrentSearchType] = useState<SearchType | null>(
    null
  );
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  // Function to update URL with search parameters and create history entry
  const updateURL = useCallback(
    (type: SearchType, query: string, createHistoryEntry: boolean = true) => {
      const params = new URLSearchParams();
      params.set("search-type", type);
      params.set("query", query);
      const newUrl = `/?${params.toString()}`;

      if (createHistoryEntry) {
        // Create a new history entry for browser back/forward navigation
        router.push(newUrl);
      } else {
        // Replace current entry without creating history (for initial load)
        router.replace(newUrl);
      }
    },
    [router]
  );

  const handleSearch = useCallback(
    async (
      type: SearchType,
      query: string,
      isFromURLChange: boolean = false
    ) => {
      setIsLoading(true);
      setError(null);
      setResults(null);
      setCurrentSearchType(type);
      setCurrentSearchQuery(query);

      // Update URL with new search parameters
      const currentSearchType = searchParams.get("search-type");
      const currentQuery = searchParams.get("query");
      if (currentSearchType !== type || currentQuery !== query) {
        // Don't create history entry if this search is triggered by URL change (back/forward)
        updateURL(type, query, !isFromURLChange);
      }

      try {
        // Use client-side analysis instead of server API
        const data = await performClientAnalysis(type, query);
        setResults(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes("rate limit")) {
          setError(
            `Rate limit exceeded. Each user has 60 GitHub API requests per hour. Please wait before trying again.`
          );
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Analysis failed. Please try again."
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [updateURL, searchParams]
  );

  // Effect to handle URL parameters on mount and when they change
  useEffect(() => {
    const parseURLParams = () => {
      // Method 1: search-type=xxx&query=xxx format
      const searchType = searchParams.get("search-type") as SearchType;
      const query = searchParams.get("query");

      if (searchType && query) {
        return { type: searchType, query };
      }

      // Method 2: direct parameter format (npm-package=xxx, github-account=xxx, etc.)
      const npmPackage = searchParams.get("npm-package");
      if (npmPackage) {
        return { type: "npm-package" as SearchType, query: npmPackage };
      }

      const npmAccount = searchParams.get("npm-account");
      if (npmAccount) {
        return { type: "npm-account" as SearchType, query: npmAccount };
      }

      const githubAccount = searchParams.get("github-account");
      if (githubAccount) {
        return { type: "github-account" as SearchType, query: githubAccount };
      }

      return null;
    };

    const urlParams = parseURLParams();
    if (urlParams) {
      // Check if this is different from current state
      const isDifferentSearch =
        urlParams.type !== currentSearchType ||
        urlParams.query !== currentSearchQuery;

      if (isDifferentSearch) {
        // This is a URL change (possibly from back/forward navigation)
        // Pass true to indicate this is from URL change
        handleSearch(urlParams.type, urlParams.query, true);
      }
    }
  }, [searchParams, currentSearchType, currentSearchQuery, handleSearch]);

  // Wrapper function for user-initiated searches (from UI components)
  const handleUserSearch = useCallback(
    (type: SearchType, query: string) => {
      // User-initiated searches should create history entries
      handleSearch(type, query, false);
    },
    [handleSearch]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <HeaderSection />

          <InputSource
            onSearch={handleUserSearch}
            isLoading={isLoading}
            initialSearchType={currentSearchType}
            initialQuery={currentSearchQuery}
          />

          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {results && (
            <AnalysisResults
              results={results}
              searchType={currentSearchType}
              searchQuery={currentSearchQuery}
            />
          )}

          <InformationSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}
