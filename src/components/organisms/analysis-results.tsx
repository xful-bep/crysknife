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
import { CompromisedData } from "@/lib/types";
import {
  isSystemCompromised,
  getSecurityRecommendations,
} from "@/lib/utils/security-helpers";
import { cn } from "@/lib/utils";

interface AnalysisResultsProps {
  results: CompromisedData;
  searchQuery: string;
}

export function AnalysisResults({
  results,
  searchQuery,
}: AnalysisResultsProps) {
  const isCompromised = isSystemCompromised(results);
  const recommendations = getSecurityRecommendations(results);

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
                    {searchQuery}
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
        </CardContent>
      </Card>
    </div>
  );
}
