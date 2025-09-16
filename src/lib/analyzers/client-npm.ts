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
    throw error;
  }
}
