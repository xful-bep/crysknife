"use client";

import { CompromisedData } from "@/lib/types/analysis";
import { createCleanCompromisedData } from "@/lib/utils/analysis";
import {
  INFECTED_PACKAGE_NAMES,
  isPackageInfected,
  INFECTED_PACKAGE_MAP,
} from "@/lib/data/infected-packages";

/**
 * Client-side NPM account analyzer
 * Runs in the browser to distribute rate limiting per user
 */
export async function analyzeNpmAccountClient(
  username: string
): Promise<CompromisedData> {
  console.log("Client-side analyzing NPM account:", username);

  try {
    // Use NPM's search API to find packages by author
    // This is more reliable and has better CORS support
    const searchUrl = `https://registry.npmjs.org/-/v1/search?text=author:${encodeURIComponent(
      username
    )}&size=250`;
    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      if (searchResponse.status === 429) {
        throw new Error(
          `NPM API rate limit exceeded. Please wait before trying again. (Status: ${searchResponse.status})`
        );
      }
      if (searchResponse.status === 404) {
        return createCleanCompromisedData();
      }
      throw new Error(`NPM API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    // Extract package names from search results
    const packages: Record<
      string,
      { name: string; author?: { name: string } }
    > = {};
    if (searchData.objects && Array.isArray(searchData.objects)) {
      searchData.objects.forEach(
        (obj: { package: { name: string; author?: { name: string } } }) => {
          if (obj.package && obj.package.name) {
            packages[obj.package.name] = obj.package;
          }
        }
      );
    }

    // If no packages found, try alternative approach with direct user lookup
    if (Object.keys(packages).length === 0) {
      try {
        // Fallback: try to get user profile (this may not work due to CORS)
        const userUrl = `https://www.npmjs.com/~${username}`;
        await fetch(userUrl, { mode: "no-cors" });
        // Note: no-cors mode means we can't read the response, but we can detect if the user exists
        // This is a limitation of browser-based access to NPM
      } catch {
        // Ignore errors from the fallback attempt
      }
      return createCleanCompromisedData();
    }

    // Check for infected packages from the known list
    const infectedPackages = Object.keys(packages)
      .filter((pkg) => INFECTED_PACKAGE_NAMES.has(pkg))
      .map((pkg) => {
        const infectedPkg = INFECTED_PACKAGE_MAP.get(pkg);
        return {
          name: pkg,
          versions: infectedPkg?.versions || [],
          category: infectedPkg?.category || "unknown",
        };
      });

    // Get all packages found through search for potential review
    const allFoundPackages = Object.keys(packages);

    if (infectedPackages.length > 0) {
      console.warn(`Infected NPM packages found:`, infectedPackages);
      return {
        ...createCleanCompromisedData(),
        modules: {
          npm: {
            authenticated: true,
            username: username,
            suspiciousPackages: infectedPackages.map((pkg) => pkg.name),
            infectedPackages: infectedPackages,
          },
        },
      };
    }

    // If no infected packages but packages were found, show as potentially concerning for account searches
    if (allFoundPackages.length > 0) {
      return {
        ...createCleanCompromisedData(),
        modules: {
          npm: {
            authenticated: true,
            username: username,
            suspiciousPackages: allFoundPackages,
            packageName: undefined,
            suspicious: true,
            suspiciousReasons: [
              `Found ${allFoundPackages.length} packages associated with this account. These should be reviewed for potential security concerns.`,
            ],
          },
        },
      };
    }

    return createCleanCompromisedData();
  } catch (error) {
    console.error("Error analyzing NPM account:", error);

    // Check if it's a CORS or network error
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        `Failed to fetch NPM account data. This might be due to network issues or API limitations. ` +
          `The NPM registry API may have CORS restrictions for browser-based requests.`
      );
    }

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
    // First check if this is an infected package and parse name/version
    let packageNameToCheck = packageName;
    let versionToCheck: string | undefined;

    // Handle package@version format
    if (packageName.includes("@") && !packageName.startsWith("@")) {
      const parts = packageName.split("@");
      packageNameToCheck = parts[0];
      versionToCheck = parts[1];
    } else if (
      packageName.startsWith("@") &&
      packageName.lastIndexOf("@") > 0
    ) {
      // Handle scoped packages like @ctrl/package@version
      const lastAtIndex = packageName.lastIndexOf("@");
      packageNameToCheck = packageName.substring(0, lastAtIndex);
      versionToCheck = packageName.substring(lastAtIndex + 1);
    }

    // Check infection status before making API call
    const infectionCheck = isPackageInfected(
      packageNameToCheck,
      versionToCheck
    );

    // If infected, return immediately without API call
    if (infectionCheck.infected) {
      const infectedPkg = INFECTED_PACKAGE_MAP.get(packageNameToCheck);
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
            suspiciousReasons: [
              `This package is part of a known security incident`,
            ],
            infectedPackages: [
              {
                name: packageNameToCheck,
                versions: infectionCheck.infectedVersions || [],
                detectedVersion: versionToCheck,
                category: infectedPkg?.category || "unknown",
              },
            ],
          },
        },
      };
    }

    // Use the package name without version for the API call
    const packageUrl = `https://registry.npmjs.org/${encodeURIComponent(
      packageNameToCheck
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

    // Check for malware indicators from the infected packages data
    const description = packageData.description?.toLowerCase() || "";
    const readme = packageData.readme?.toLowerCase() || "";
    const keywords = packageData.keywords?.join(" ").toLowerCase() || "";

    const searchText = `${description} ${readme} ${keywords}`;
    const foundIndicators: string[] = [];

    // Import malware indicators
    const { MALWARE_INDICATORS } = await import("@/lib/data/infected-packages");

    // Check for bundle hash
    if (searchText.includes(MALWARE_INDICATORS.bundleHash)) {
      foundIndicators.push("Malicious bundle.js hash detected");
    }

    // Check for webhook endpoint
    if (searchText.includes(MALWARE_INDICATORS.webhookEndpoint)) {
      foundIndicators.push("Data exfiltration endpoint detected");
    }

    // Check for lifecycle script
    if (searchText.includes(MALWARE_INDICATORS.lifecycleScript)) {
      foundIndicators.push("Malicious lifecycle script detected");
    }

    if (foundIndicators.length > 0) {
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
            suspiciousReasons: foundIndicators,
            malwareIndicators: foundIndicators,
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

    // Check if it's a CORS or network error
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        `Failed to fetch NPM package data for "${packageName}". This might be due to network issues or the package doesn't exist.`
      );
    }

    throw error;
  }
}
