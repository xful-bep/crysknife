"use client";

import { CompromisedData, SearchType } from "@/lib/types/analysis";
import { analyzeGitHubAccountClient } from "./client-github";
import { analyzeNpmAccountClient, analyzeNpmPackageClient } from "./client-npm";

/**
 * Main client-side analyzer dispatcher
 * Routes analysis requests to appropriate client-side analyzers
 */
export async function performClientAnalysis(
  type: SearchType,
  query: string
): Promise<CompromisedData> {
  console.log(`Starting client-side ${type} analysis for: ${query}`);

  try {
    let result: CompromisedData;

    switch (type) {
      case "github-account":
        result = await analyzeGitHubAccountClient(query);
        break;

      case "npm-account":
        result = await analyzeNpmAccountClient(query);
        break;

      case "npm-package":
        result = await analyzeNpmPackageClient(query);
        break;

      default:
        throw new Error(`Unsupported analysis type: ${type}`);
    }

    const envCount = Object.keys(result.environment || {}).length;
    const modules = Object.keys(result.modules || {});

    console.log(`Client-side analysis completed for ${query}:`, {
      platform: result.system.platform,
      envCount,
      modules,
    });

    return result;
  } catch (error) {
    console.error(`Client-side analysis error:`, error);
    throw error;
  }
}

// Export individual analyzers for direct use if needed
export { analyzeGitHubAccountClient } from "./client-github";
export { analyzeNpmAccountClient, analyzeNpmPackageClient } from "./client-npm";
