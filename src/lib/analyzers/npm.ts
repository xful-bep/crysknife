import { CompromisedData } from "@/lib/types/analysis";
import { createCleanCompromisedData } from "@/lib/utils/analysis";
import {
  INFECTED_PACKAGE_NAMES,
  isPackageInfected,
  INFECTED_PACKAGE_MAP,
  MALWARE_INDICATORS,
} from "@/lib/data/infected-packages";

/**
 * Analyzes an NPM account for malicious packages
 */
export async function analyzeNpmAccount(
  username: string
): Promise<CompromisedData> {
  console.log("Analyzing NPM account:", username);

  try {
    // Check NPM registry for user packages
    const userUrl = `https://registry.npmjs.org/-/user/org.couchdb.user:${username}`;
    const userResponse = await fetch(userUrl);

    if (userResponse.status === 404) {
      return createCleanCompromisedData();
    }

    if (!userResponse.ok) {
      throw new Error(`NPM API error: ${userResponse.status}`);
    }

    // Get user's packages
    const packagesUrl = `https://registry.npmjs.org/-/user/${username}/package`;
    const packagesResponse = await fetch(packagesUrl);

    if (packagesResponse.ok) {
      const packages = await packagesResponse.json();

      // Check for infected packages from the known list
      const infectedPackages = Object.keys(packages).filter((pkg) =>
        INFECTED_PACKAGE_NAMES.has(pkg)
      );

      if (infectedPackages.length > 0) {
        return {
          ...createCleanCompromisedData(),
          modules: {
            npm: {
              authenticated: true,
              username: username,
              suspiciousPackages: infectedPackages,
              infectedPackages: infectedPackages.map((pkg) => {
                const infectedPkg = INFECTED_PACKAGE_MAP.get(pkg);
                return {
                  name: pkg,
                  versions: infectedPkg?.versions || [],
                  category: infectedPkg?.category || "unknown",
                };
              }),
            },
          },
        };
      }
    }

    return {
      ...createCleanCompromisedData(),
      modules: {
        npm: {
          authenticated: false,
          username: null,
        },
      },
    };
  } catch (error) {
    console.error("Error analyzing NPM account:", error);
    throw error;
  }
}

/**
 * Analyzes an NPM package for malicious content
 */
export async function analyzeNpmPackage(
  packageName: string
): Promise<CompromisedData> {
  console.log("Analyzing NPM package:", packageName);

  try {
    // Parse package name and version if provided
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

    // Remove "latest" version as we'll get it from NPM
    if (versionToCheck === "latest") {
      versionToCheck = undefined;
    }

    // Only check specific version if one was provided (and not "latest")
    if (versionToCheck) {
      const infectionCheck = isPackageInfected(
        packageNameToCheck,
        versionToCheck
      );

      if (infectionCheck.infected) {
        const infectedPkg = INFECTED_PACKAGE_MAP.get(packageNameToCheck);
        return {
          system: {
            platform: "npm",
            architecture: "unknown",
            platformDetailed: "npm-package",
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
    }

    // Use the package name without version for the API call
    const packageUrl = `https://registry.npmjs.org/${packageNameToCheck}`;
    const packageResponse = await fetch(packageUrl);

    if (packageResponse.status === 404) {
      return createCleanCompromisedData();
    }

    if (!packageResponse.ok) {
      throw new Error(`NPM API error: ${packageResponse.status}`);
    }

    const packageData = await packageResponse.json();

    // Get the latest version from NPM response
    const latestVersion = packageData["dist-tags"]?.latest;

    // Check if the latest version is infected
    const latestVersionCheck = isPackageInfected(
      packageNameToCheck,
      latestVersion
    );

    if (latestVersionCheck.infected) {
      const infectedPkg = INFECTED_PACKAGE_MAP.get(packageNameToCheck);
      return {
        system: {
          platform: "npm",
          architecture: "unknown",
          platformDetailed: "npm-package",
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
              `This package is part of a known security incident (version ${latestVersion})`,
            ],
            infectedPackages: [
              {
                name: packageNameToCheck,
                versions: latestVersionCheck.infectedVersions || [],
                detectedVersion: latestVersion,
                category: infectedPkg?.category || "unknown",
              },
            ],
          },
        },
      };
    }

    // Check if the package has ANY infected versions (even if latest is clean)
    const anyVersionCheck = isPackageInfected(packageNameToCheck);

    if (anyVersionCheck.infected) {
      return {
        system: {
          platform: "npm",
          architecture: "unknown",
          platformDetailed: "npm-package",
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
              `⚠️ This package has compromised versions in its history: ${anyVersionCheck.infectedVersions?.join(
                ", "
              )}`,
              `Latest version ${latestVersion} appears to be clean, but use with caution`,
              `Consider using an alternative package to avoid potential security risks`,
            ],
            // Only mark as suspiciousPackages, not infectedPackages
            // since the current latest version is clean
            suspiciousPackages: [packageNameToCheck],
          },
        },
      };
    }

    // Check for malware indicators from the infected packages data
    const description = packageData.description?.toLowerCase() || "";
    const readme = packageData.readme?.toLowerCase() || "";
    const keywords = packageData.keywords?.join(" ").toLowerCase() || "";

    const searchText = `${description} ${readme} ${keywords}`;
    const foundIndicators: string[] = [];

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
          platformDetailed: "npm-package",
          architectureDetailed: "unknown",
        },
        environment: {},
        modules: {
          npm: {
            authenticated: false,
            username: packageData.author?.name || null,
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
        platformDetailed: "npm-package",
        architectureDetailed: "unknown",
      },
      environment: {},
      modules: {
        npm: {
          authenticated: false,
          username: null,
        },
      },
    };
  } catch (error) {
    console.error("Error analyzing NPM package:", error);
    throw error;
  }
}
