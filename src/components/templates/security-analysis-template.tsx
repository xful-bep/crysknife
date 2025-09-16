"use client";

import { useState } from "react";
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

  const handleSearch = async (type: SearchType, query: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setCurrentSearchType(type);
    setCurrentSearchQuery(query);

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <HeaderSection />

          <InputSource onSearch={handleSearch} isLoading={isLoading} />

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
