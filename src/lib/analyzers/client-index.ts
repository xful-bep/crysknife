"use client";

import { CompromisedData, SearchType } from "@/lib/types/analysis";
import { analyzeGitHubAccountClient } from "./client-github";
import { analyzeNpmAccountClient, analyzeNpmPackageClient } from "./client-npm";
import {
  analyzeEnvironmentData,
  analyzePackageJson,
} from "./client-environment";

/**
 * Client-side recursive base64 decode function
 * Works in browser environment using atob()
 */
function clientRecursiveBase64Decode(
  content: string,
  iteration: number = 1,
  maxIterations: number = 5,
  username: string
): CompromisedData | null {
  console.log(`Starting iteration ${iteration} for ${username}`);
  console.log(`Content length: ${content.length}`);
  console.log(`Content preview: ${content.substring(0, 100)}...`);

  if (iteration > maxIterations) {
    console.log(`Max iterations (${maxIterations}) reached for ${username}`);
    return null;
  }

  try {
    // Clean content for the first iteration
    const cleanContent = iteration === 1 ? content.replace(/\s/g, "") : content;
    console.log(`Clean content length: ${cleanContent.length}`);

    // Decode base64 using browser's atob
    const decoded = atob(cleanContent);
    console.log(
      `Iteration ${iteration} decode successful for ${username}, Length: ${decoded.length}`
    );
    console.log(`Decoded preview: ${decoded.substring(0, 200)}...`);

    // Try to parse as JSON
    try {
      const parsed = JSON.parse(decoded) as CompromisedData;
      console.log(`JSON parsing successful for iteration ${iteration}`);
      console.log(`Parsed object keys:`, Object.keys(parsed));

      // Validate structure - check for system and either modules or environment
      if (parsed.system && (parsed.modules || parsed.environment)) {
        console.log(
          `Successfully decoded data after ${iteration} iteration(s) for ${username}`
        );
        console.log(
          "Environment vars count:",
          Object.keys(parsed.environment || {}).length
        );
        console.log("Modules found:", Object.keys(parsed.modules || {}));
        return parsed;
      } else {
        console.log(
          `Iteration ${iteration}: Parsed JSON but invalid structure for ${username}`
        );
        console.log(
          `Has system: ${!!parsed.system}, Has modules: ${!!parsed.modules}, Has environment: ${!!parsed.environment}`
        );
        console.log("Trying next iteration with decoded content as new base64");
        return clientRecursiveBase64Decode(
          decoded,
          iteration + 1,
          maxIterations,
          username
        );
      }
    } catch (jsonError) {
      console.log(`Iteration ${iteration}: JSON parse failed for ${username}`);
      console.log("JSON parse error:", jsonError);
      console.log("Trying next iteration with decoded content as new base64");
      // If JSON parsing fails, try decoding again
      return clientRecursiveBase64Decode(
        decoded,
        iteration + 1,
        maxIterations,
        username
      );
    }
  } catch (decodeError) {
    console.error(
      `Iteration ${iteration}: Base64 decode failed for ${username}:`,
      decodeError instanceof Error ? decodeError.message : String(decodeError)
    );
    return null;
  }
}

/**
 * Analyze data from uploaded file or base64 input
 */
export async function analyzeDataContent(
  content: string
): Promise<CompromisedData> {
  try {
    // Parse the JSON content directly (for file uploads)
    const data = JSON.parse(content);

    // Check if it's a package.json file
    if (data.dependencies || data.devDependencies || data.name) {
      return await analyzePackageJson(content);
    }

    // Otherwise, analyze as environment data
    return await analyzeEnvironmentData(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON format in the provided data");
    }
    throw error;
  }
}

/**
 * Analyze base64 encoded data using recursive decoding
 */
export async function analyzeBase64Content(
  base64Content: string
): Promise<CompromisedData> {
  try {
    // Use the client-side recursive base64 decode function
    const decoded = clientRecursiveBase64Decode(
      base64Content,
      1,
      5,
      "base64-analysis"
    );

    if (!decoded) {
      throw new Error(
        "Failed to decode base64: Invalid format or max iterations reached"
      );
    }

    // Use the environment analyzer to check for infected packages
    return await analyzeEnvironmentData(
      decoded as unknown as Record<string, unknown>
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to analyze base64 content");
  }
}

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

      case "file-upload":
        result = await analyzeDataContent(query);
        break;

      case "base64-input":
        result = await analyzeBase64Content(query);
        break;

      case "package-json":
        result = await analyzePackageJson(query);
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
