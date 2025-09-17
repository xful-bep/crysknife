"use client";

import { useState } from "react";
import { Package, Globe, AlertTriangle, Copy, ChevronDown } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { TokenDisplay } from "@/components/molecules";
import { StatusBadge } from "@/components/atoms";
import { ModuleAnalysisProps } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InfectedPackage {
  name: string;
  versions: string[];
  detectedVersion?: string;
  category: string;
}

type PackageManager = "npm" | "yarn" | "pnpm";

export function ModuleAnalysis({ modules, searchType }: ModuleAnalysisProps) {
  const [selectedPackageManager, setSelectedPackageManager] =
    useState<PackageManager>("npm");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getRemovalCommands = (
    packages: InfectedPackage[],
    packageManager: PackageManager
  ): string => {
    const packageNames = packages.map((pkg) => pkg.name);
    switch (packageManager) {
      case "npm":
        return `npm uninstall ${packageNames.join(" ")}`;
      case "yarn":
        return `yarn remove ${packageNames.join(" ")}`;
      case "pnpm":
        return `pnpm remove ${packageNames.join(" ")}`;
      default:
        return `npm uninstall ${packageNames.join(" ")}`;
    }
  };

  const getCacheCommand = (packageManager: PackageManager): string => {
    switch (packageManager) {
      case "npm":
        return "npm cache clean --force";
      case "yarn":
        return "yarn cache clean";
      case "pnpm":
        return "pnpm store prune";
      default:
        return "npm cache clean --force";
    }
  };
  if (!modules || Object.values(modules).every((v) => v == void 0)) {
    return null;
  }

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
                <Alert
                  variant="default"
                  className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <div className="space-y-4">
                      <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                        ⚠️ PACKAGES WITH COMPROMISED HISTORY
                      </div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        {searchType === "npm-account"
                          ? "These packages associated with this account have had compromised versions in the past. Latest versions appear clean, but use with caution:"
                          : "The following packages have had compromised versions in the past:"}
                      </div>

                      {/* Package List with Version Badges */}
                      <div className="space-y-3">
                        {modules.npm.infectedPackages.map(
                          (pkg: InfectedPackage, index: number) => (
                            <div
                              key={index}
                              className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <code className="text-sm font-mono font-semibold text-yellow-800 dark:text-yellow-200">
                                  {pkg.name}
                                </code>
                                <Badge
                                  variant="outline"
                                  className="text-xs border-yellow-300 text-yellow-700"
                                >
                                  {pkg.category}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {pkg.versions.map((version, vIndex) => (
                                  <Badge
                                    key={vIndex}
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    {version}
                                  </Badge>
                                ))}
                              </div>
                              <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                                <strong>⚠️ Historical compromise:</strong> If
                                you are using any of the red-marked versions,
                                immediately update to the latest version or
                                remove the package.
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <div className="text-xs text-yellow-600 dark:text-yellow-400 p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                        <strong>⚠️ Security Advisory:</strong> Even though the
                        latest versions appear clean, these packages have a
                        history of security incidents. Consider using
                        alternative packages with better security track records.
                        If you must use these packages, ensure you&apos;re on
                        the latest version and monitor for security updates.
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

            {/* All User Packages List - Show for npm-account searches */}
            {searchType === "npm-account" &&
              modules.npm.suspiciousPackages &&
              modules.npm.suspiciousPackages.length > 0 && (
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Package className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <div className="space-y-4">
                      <div className="font-semibold text-blue-800 dark:text-blue-200">
                        📦 ALL PACKAGES BY THIS ACCOUNT (
                        {modules.npm.suspiciousPackages.length})
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        Complete list of packages published by this NPM account:
                      </div>

                      {/* Package Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {modules.npm.suspiciousPackages
                          .filter(
                            (pkg: string) =>
                              !modules.npm?.infectedPackages?.some(
                                (infected: InfectedPackage) =>
                                  infected.name === pkg
                              )
                          )
                          .map((packageName: string, index: number) => (
                            <div
                              key={index}
                              className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                            >
                              <code className="text-sm font-mono text-blue-800 dark:text-blue-200">
                                {packageName}
                              </code>
                            </div>
                          ))}
                      </div>

                      {/* Show infected packages count if any */}
                      {modules.npm?.infectedPackages &&
                        modules.npm.infectedPackages.length > 0 && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                            <strong>Note:</strong>{" "}
                            {modules.npm.infectedPackages.length} package(s)
                            with compromised history are shown separately above.
                          </div>
                        )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

            {/* Package Manager Selector and Commands - Only show when there are infected packages */}
            {searchType === "npm-account" &&
              modules.npm.infectedPackages &&
              modules.npm.infectedPackages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      Package Management Commands
                    </span>
                  </div>

                  {/* Package Manager Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Package Manager:
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          {selectedPackageManager}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setSelectedPackageManager("npm")}
                        >
                          npm
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedPackageManager("yarn")}
                        >
                          yarn
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedPackageManager("pnpm")}
                        >
                          pnpm
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Remove All Infected Packages Command */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Remove All Infected Packages:
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            getRemovalCommands(
                              modules.npm?.infectedPackages || [],
                              selectedPackageManager
                            )
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-sm">
                      {getRemovalCommands(
                        modules.npm?.infectedPackages || [],
                        selectedPackageManager
                      )}
                    </div>
                  </div>

                  {/* Cache Clear Command */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Clear Package Manager Cache:
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            getCacheCommand(selectedPackageManager)
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-sm">
                      {getCacheCommand(selectedPackageManager)}
                    </div>
                  </div>
                </div>
              )}

            {/* Suspicious Packages for NPM Account (non-infected) */}
            {searchType === "npm-account" &&
              modules.npm.suspicious &&
              modules.npm.suspiciousPackages &&
              modules.npm.suspiciousPackages.length > 0 &&
              (!modules.npm.infectedPackages ||
                modules.npm.infectedPackages.length === 0) && (
                <Alert
                  variant="default"
                  className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                        ⚠️ PACKAGES FOUND FOR REVIEW
                      </div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        Found {modules.npm.suspiciousPackages.length} packages
                        associated with this account. These should be reviewed
                        for legitimacy:
                      </div>
                      <div className="grid gap-2">
                        {modules.npm.suspiciousPackages
                          .slice(0, 10)
                          .map((pkg: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-yellow-100 dark:bg-yellow-800/20 rounded border border-yellow-200 dark:border-yellow-700"
                            >
                              <Package className="h-4 w-4 text-yellow-600" />
                              <code className="text-sm font-mono text-yellow-800 dark:text-yellow-200">
                                {pkg}
                              </code>
                            </div>
                          ))}
                        {modules.npm.suspiciousPackages.length > 10 && (
                          <div className="text-xs text-yellow-600 dark:text-yellow-400">
                            ... and {modules.npm.suspiciousPackages.length - 10}{" "}
                            more packages
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                        <strong>Recommendation:</strong> Review these packages
                        to ensure they are legitimate and published by the
                        account owner. Be cautious of any packages that seem
                        suspicious or unrelated to the user&apos;s known work.
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
