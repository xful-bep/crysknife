"use client";

import { Package, Globe } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { TokenDisplay } from "@/components/molecules";
import { StatusBadge } from "@/components/atoms";
import { ModuleAnalysisProps } from "@/lib/types";

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
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5" />
              <span className="font-medium">NPM</span>
            </div>
            <StatusBadge
              variant={modules.npm.authenticated ? "destructive" : "secondary"}
            >
              {modules.npm.authenticated
                ? "Authenticated"
                : "Not Authenticated"}
            </StatusBadge>
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
