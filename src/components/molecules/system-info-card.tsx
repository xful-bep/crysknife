"use client";

import { Shield } from "lucide-react";
import { SystemInfoCardProps } from "@/lib/types/components";

export function SystemInfoCard({ system }: SystemInfoCardProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Shield className="h-4 w-4" />
        System Information
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded">
          <div className="font-medium">Platform</div>
          <div className="text-slate-600 dark:text-slate-300">
            {system.platform}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded">
          <div className="font-medium">Architecture</div>
          <div className="text-slate-600 dark:text-slate-300">
            {system.architecture}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded">
          <div className="font-medium">Detailed Platform</div>
          <div className="text-slate-600 dark:text-slate-300">
            {system.platformDetailed}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded">
          <div className="font-medium">Detailed Arch</div>
          <div className="text-slate-600 dark:text-slate-300">
            {system.architectureDetailed}
          </div>
        </div>
      </div>
    </div>
  );
}
