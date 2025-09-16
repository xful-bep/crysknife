"use client";

import { Package, Globe, AlertTriangle, Shield } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { TokenDisplay } from "@/components/molecules";
import { StatusBadge } from "@/components/atoms";
import { ModuleAnalysisProps } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface InfectedPackage {
  name: string;
  versions: string[];
  detectedVersion?: string;
  category: string;
}

export function ModuleAnalysis({ modules }: ModuleAnalysisProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Package className="h-4 w-4" />
        Module Analysis
      </h3>
      <div className="space-y-3">
        {/* GitHub */}
        {modules.github && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="flex items-center gap-3">
                <SiGithub className="h-5 w-5" />
                <span className="font-medium">GitHub</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  variant={
                    modules.github.authenticated ? "destructive" : "secondary"
                  }
                >
                  {modules.github.authenticated
                    ? "Authenticated"
                    : "Not Authenticated"}
                </StatusBadge>
                {modules.github.token && (
                  <StatusBadge variant="destructive">Token Found</StatusBadge>
                )}
              </div>
            </div>
            {modules.github.token && (
              <TokenDisplay token={modules.github.token} type="GitHub" />
            )}
          </div>
        )}

        {/* NPM */}
        {modules.npm && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5" />
                <span className="font-medium">NPM</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  variant={
                    modules.npm.authenticated ? "destructive" : "secondary"
                  }
                >
                  {modules.npm.authenticated
                    ? "Authenticated"
                    : "Not Authenticated"}
                </StatusBadge>
                {modules.npm.suspicious && (
                  <StatusBadge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Suspicious
                  </StatusBadge>
                )}
              </div>
            </div>

            {/* Infected Packages */}
            {modules.npm.infectedPackages &&
              modules.npm.infectedPackages.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-semibold">
                        🚨 INFECTED PACKAGES DETECTED
                      </div>
                      <div className="text-sm">
                        The following packages are part of a known security
                        incident:
                      </div>
                      <div className="grid gap-2">
                        {modules.npm.infectedPackages.map(
                          (pkg: InfectedPackage, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                            >
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-red-600" />
                                <code className="text-sm font-mono">
                                  {pkg.name}
                                </code>
                                {pkg.detectedVersion && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    v{pkg.detectedVersion}
                                  </Badge>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {pkg.category}
                              </Badge>
                            </div>
                          )
                        )}
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                        <strong>Action Required:</strong> These packages contain
                        malicious code. Remove them immediately and check for
                        data exfiltration.
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

            {/* Malware Indicators */}
            {modules.npm.malwareIndicators &&
              modules.npm.malwareIndicators.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-semibold">
                        🔍 MALWARE INDICATORS FOUND
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {modules.npm.malwareIndicators.map(
                          (indicator: string, index: number) => (
                            <li
                              key={index}
                              className="text-red-600 dark:text-red-400"
                            >
                              {indicator}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

            {/* Suspicious Packages */}
            {modules.npm.suspiciousPackages &&
              modules.npm.suspiciousPackages.length > 0 && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                  <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Suspicious Packages Found:
                  </div>
                  <div className="space-y-1">
                    {modules.npm.suspiciousPackages.map(
                      (pkg: string, index: number) => (
                        <code
                          key={index}
                          className="block text-sm bg-yellow-100 dark:bg-yellow-900/40 px-2 py-1 rounded"
                        >
                          {pkg}
                        </code>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Suspicious Reasons */}
            {modules.npm.suspiciousReasons &&
              modules.npm.suspiciousReasons.length > 0 && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                  <div className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                    Security Concerns:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-orange-700 dark:text-orange-300">
                    {modules.npm.suspiciousReasons.map(
                      (reason: string, index: number) => (
                        <li key={index}>{reason}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* AWS */}
        {modules.aws && (
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5" />
              <span className="font-medium">AWS</span>
            </div>
            <StatusBadge
              variant={
                modules.aws.secrets?.length ? "destructive" : "secondary"
              }
            >
              {modules.aws.secrets?.length
                ? `${modules.aws.secrets.length} Secrets Found`
                : "No Secrets"}
            </StatusBadge>
          </div>
        )}

        {/* GCP */}
        {modules.gcp && (
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5" />
              <span className="font-medium">GCP</span>
            </div>
            <StatusBadge
              variant={
                modules.gcp.secrets?.length ? "destructive" : "secondary"
              }
            >
              {modules.gcp.secrets?.length
                ? `${modules.gcp.secrets.length} Secrets Found`
                : "No Secrets"}
            </StatusBadge>
          </div>
        )}
      </div>
    </div>
  );
}
