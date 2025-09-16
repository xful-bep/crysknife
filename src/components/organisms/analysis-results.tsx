"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SystemInfoCard } from "@/components/molecules";
import { ModuleAnalysis } from "./module-analysis";
import { CompromisedData, SearchType } from "@/lib/types";
import {
  isSystemCompromised,
  getSecurityRecommendations,
} from "@/lib/utils/security-helpers";
import { cn } from "@/lib/utils";

interface AnalysisResultsProps {
  results: CompromisedData;
  searchType: SearchType | null;
  searchQuery: string;
}

export function AnalysisResults({
  results,
  searchType,
  searchQuery,
}: AnalysisResultsProps) {
  const isCompromised = isSystemCompromised(results);
  const recommendations = getSecurityRecommendations(results);

  // Generate display text based on search type
  const getDisplayText = () => {
    switch (searchType) {
      case "github-account":
        return `GitHub account: ${searchQuery}`;
      case "npm-account":
        return `NPM account: ${searchQuery}`;
      case "npm-package":
        return `NPM package: ${searchQuery}`;
      case "npm-repo":
        return `NPM repository: ${searchQuery}`;
      case "package-json":
        return "Package.json analysis";
      case "file-upload":
        return "Uploaded JSON file";
      case "base64-input":
        return "Decoded base64 data";
      default:
        return searchQuery;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card
        className={cn("shadow-xl", {
          "border border-red-600": isCompromised,
          "border border-green-600": !isCompromised,
        })}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isCompromised ? (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
              <div>
                <CardTitle
                  className={cn("mb-2", {
                    "text-red-600": isCompromised,
                    "text-green-600": !isCompromised,
                  })}
                >
                  {isCompromised
                    ? "⚠️ COMPROMISED DETECTED"
                    : "✅ No Threats Found"}
                </CardTitle>
                <CardDescription>
                  Analysis results for:{" "}
                  <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {getDisplayText()}
                  </code>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Information */}
          <SystemInfoCard system={results.system} />

          {/* Compromised Modules */}
          <ModuleAnalysis modules={results.modules} />

          {/* Recommendations */}
          {isCompromised && recommendations.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-semibold">
                    Immediate Actions Required:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {recommendations.map(
                      (recommendation: string, index: number) => (
                        <li key={index}>{recommendation}</li>
                      )
                    )}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Infected Packages Summary */}
          {results.modules?.npm?.infectedPackages &&
            results.modules.npm.infectedPackages.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-semibold text-red-600">
                      🚨 CRITICAL SECURITY ALERT
                    </div>
                    <p className="text-sm">
                      Your system contains{" "}
                      <strong>
                        {results.modules.npm.infectedPackages.length}
                      </strong>{" "}
                      infected package(s) from a known malware campaign. These
                      packages may have:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                      <li>Stolen your environment variables and tokens</li>
                      <li>Exfiltrated sensitive data to external servers</li>
                      <li>Compromised your development environment</li>
                    </ul>
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                      <div className="font-medium text-red-800 dark:text-red-200 mb-2">
                        Infected Packages Found:
                      </div>
                      <div className="space-y-1">
                        {results.modules.npm.infectedPackages.map(
                          (pkg, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <code className="text-sm font-mono bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded">
                                {pkg.name}
                                {pkg.detectedVersion &&
                                  `@${pkg.detectedVersion}`}
                              </code>
                              <span className="text-xs text-red-600 dark:text-red-400">
                                Known vulnerable versions:{" "}
                                {pkg.versions.join(", ")}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
