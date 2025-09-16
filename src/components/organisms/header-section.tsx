"use client";

import { Logo } from "@/components/atoms";

export function HeaderSection() {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center mb-6">
        <Logo className="h-16 w-16 text-blue-600 dark:text-blue-400 mr-4" />
        <h1 className="text-6xl font-bold gradient-text leading-tight py-2">
          Crysknife
        </h1>
      </div>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-4 max-w-3xl mx-auto">
        A security analysis tool to detect Shai-Hulud malware infections across
        GitHub and NPM ecosystems
      </p>
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
          Client-Side Analysis
        </span>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
          Privacy-First
        </span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
        Check if your accounts, packages, or repositories have been compromised
        by scanning for malicious data patterns
      </p>
    </div>
  );
}
