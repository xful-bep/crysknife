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
        // Use the processed package information from the analysis results
        const npmModule = results.modules?.npm;

        // Extract clean package name (remove any version from packageName field)
        let cleanPackageName = npmModule?.packageName || searchQuery;

        // If packageName contains a version, extract just the package name part
        if (cleanPackageName.includes("@")) {
          if (cleanPackageName.startsWith("@")) {
            // Scoped package like @ctrl/package@version
            const lastAtIndex = cleanPackageName.lastIndexOf("@");
            if (lastAtIndex > 0) {
              cleanPackageName = cleanPackageName.substring(0, lastAtIndex);
            }
          } else {
            // Regular package like package@version
            cleanPackageName = cleanPackageName.split("@")[0];
          }
        }

        const versionText = npmModule?.detectedVersion
          ? `@${npmModule.detectedVersion}`
          : "";

        // Check if this is the latest version by seeing if user didn't specify a version
        // When user searches without version, we show latest, so add "(latest)" indicator
        const userSpecifiedVersion =
          searchQuery.includes("@") && !searchQuery.endsWith("@latest");
        const latestIndicator =
          !userSpecifiedVersion && npmModule?.detectedVersion
            ? " (latest)"
            : "";

        return `NPM package: ${cleanPackageName}${versionText}${latestIndicator}`;
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

  // Check if this is a package with infected history but clean current version
  const hasInfectedHistory = results.modules?.npm?.hasInfectedHistory || false;
  const isPackageAnalysis = searchType === "npm-package";

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
                    ? searchType === "npm-account"
                      ? "⚠️ POSSIBLY COMPROMISED"
                      : "⚠️ COMPROMISED DETECTED"
                    : hasInfectedHistory && isPackageAnalysis
                    ? "✅ No Threats Found (Current Version)"
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

          {/* Special warning for packages with infected history but clean current version */}
          {hasInfectedHistory && isPackageAnalysis && !isCompromised && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                    ⚠️ Package Security Advisory
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    While the current version appears clean, this package has a
                    history of security incidents. Consider using alternative
                    packages with better security track records.
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                    <strong>Recommendation:</strong> Monitor this package for
                    security updates and consider migrating to a more secure
                    alternative when possible.
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Compromised Modules */}
          <ModuleAnalysis modules={results.modules} searchType={searchType} />

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
