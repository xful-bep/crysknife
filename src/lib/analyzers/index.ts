import { CompromisedData } from "@/lib/types/analysis";
import { analyzeGitHubAccount } from "./github";
import { analyzeNpmAccount, analyzeNpmPackage } from "./npm";

export type AnalysisType =
  | "github-account"
  | "npm-account"
  | "npm-package"
  | "npm-repo";

/**
 * Main analysis dispatcher that routes to the appropriate analyzer
 */
export async function performAnalysis(
  type: AnalysisType,
  query: string
): Promise<CompromisedData> {
  switch (type) {
    case "github-account":
      return analyzeGitHubAccount(query);

    case "npm-account":
      return analyzeNpmAccount(query);

    case "npm-package":
      return analyzeNpmPackage(query);

    case "npm-repo":
      // For now, treat npm-repo the same as npm-package
      return analyzeNpmPackage(query);

    default:
      throw new Error(`Unsupported analysis type: ${type}`);
  }
}

// Re-export individual analyzers for direct use if needed
export { analyzeGitHubAccount } from "./github";
export { analyzeNpmAccount, analyzeNpmPackage } from "./npm";
