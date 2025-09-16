"use client";

import { CompromisedData } from "@/lib/types/analysis";
import { createCleanCompromisedData } from "@/lib/utils/analysis";

/**
 * Client-side NPM account analyzer
 * Runs in the browser to distribute rate limiting per user
 */
export async function analyzeNpmAccountClient(
  username: string
): Promise<CompromisedData> {
  console.log("Client-side analyzing NPM account:", username);

  try {
    // Get user info from NPM API
    const userUrl = `https://registry.npmjs.org/-/user/org.couchdb.user:${username}`;
    const userResponse = await fetch(userUrl);

    if (userResponse.status === 404) {
      return createCleanCompromisedData();
    }

    if (!userResponse.ok) {
      if (userResponse.status === 429) {
        throw new Error(
          `NPM API rate limit exceeded. Please wait before trying again. (Status: ${userResponse.status})`
        );
      }
      throw new Error(`NPM API error: ${userResponse.status}`);
    }

    // Get user's packages
    const packagesUrl = `https://registry.npmjs.org/-/user/${username}/package`;
    const packagesResponse = await fetch(packagesUrl);

    if (!packagesResponse.ok) {
      if (packagesResponse.status === 429) {
        throw new Error(
          `NPM API rate limit exceeded. Please wait before trying again. (Status: ${packagesResponse.status})`
        );
      }
      // User exists but no packages or API error - return clean result
      return createCleanCompromisedData();
    }

    const packages = await packagesResponse.json();

    // Check for suspicious package patterns
    const suspiciousPatterns = [
      "shai-hulud",
      "Shai-Hulud",
      "SHAI-HULUD",
      "token-grab",
      "env-steal",
      "credential-harvest",
      "auth-steal",
    ];

    const foundSuspiciousPackages = Object.keys(packages).filter((pkg) =>
      suspiciousPatterns.some((pattern) =>
        pkg.toLowerCase().includes(pattern.toLowerCase())
      )
    );

    if (foundSuspiciousPackages.length > 0) {
      console.warn(`Suspicious NPM packages found: ${foundSuspiciousPackages}`);
      return {
        ...createCleanCompromisedData(),
        modules: {
          npm: {
            authenticated: true,
            username: username,
            suspiciousPackages: foundSuspiciousPackages,
          },
        },
      };
    }

    return createCleanCompromisedData();
  } catch (error) {
    console.error("Error analyzing NPM account:", error);
    throw error;
  }
}

/**
 * Client-side NPM package analyzer
 * Runs in the browser to distribute rate limiting per user
 */
export async function analyzeNpmPackageClient(
  packageName: string
): Promise<CompromisedData> {
  console.log("Client-side analyzing NPM package:", packageName);

  try {
    const packageUrl = `https://registry.npmjs.org/${encodeURIComponent(
      packageName
    )}`;
    const response = await fetch(packageUrl);

    if (response.status === 404) {
      return createCleanCompromisedData();
    }

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          `NPM API rate limit exceeded. Please wait before trying again. (Status: ${response.status})`
        );
      }
      throw new Error(`NPM API error: ${response.status}`);
    }

    const packageData = await response.json();

    // Check for malware indicators
    const suspiciousKeywords = [
      "shai-hulud",
      "credential",
      "token stealer",
      "env steal",
      "github token",
      "npm token",
      "auth harvest",
      "password grab",
    ];

    const description = packageData.description?.toLowerCase() || "";
    const readme = packageData.readme?.toLowerCase() || "";
    const keywords = packageData.keywords?.join(" ").toLowerCase() || "";

    const searchText = `${description} ${readme} ${keywords}`;

    const foundSuspiciousContent = suspiciousKeywords.some((keyword) =>
      searchText.includes(keyword)
    );

    if (foundSuspiciousContent) {
      return {
        system: {
          platform: "npm",
          architecture: "unknown",
          platformDetailed: "npm-registry",
          architectureDetailed: "unknown",
        },
        environment: {},
        modules: {
          npm: {
            authenticated: false,
            username: null,
            packageName: packageName,
            suspicious: true,
            suspiciousReasons: suspiciousKeywords.filter((keyword) =>
              searchText.includes(keyword)
            ),
          },
        },
      };
    }

    return {
      system: {
        platform: "npm",
        architecture: "unknown",
        platformDetailed: "npm-registry",
        architectureDetailed: "unknown",
      },
      environment: {},
      modules: {
        npm: {
          authenticated: false,
          username: null,
          packageName: packageName,
          suspicious: false,
        },
      },
    };
  } catch (error) {
    console.error("Error analyzing NPM package:", error);
    throw error;
  }
}
