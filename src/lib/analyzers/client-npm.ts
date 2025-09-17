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
        (obj: {
          package: {
            name: string;
            author?: { name: string };
            maintainers?: Array<{ name: string }>;
          };
        }) => {
          if (obj.package && obj.package.name) {
            packages[obj.package.name] = obj.package;
          }
        }
      );
    }

    // If no packages found with author search, try a broader search with maintainer field
    if (Object.keys(packages).length === 0) {
      console.log(
        `No packages found with author:${username}, trying broader search...`
      );

      // Try searching with text containing the username
      const broaderSearchUrl = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(
        username
      )}&size=250`;

      try {
        const broaderResponse = await fetch(broaderSearchUrl);
        if (broaderResponse.ok) {
          const broaderData = await broaderResponse.json();
          if (broaderData.objects && Array.isArray(broaderData.objects)) {
            broaderData.objects.forEach(
              (obj: {
                package: {
                  name: string;
                  author?: { name: string };
                  maintainers?: Array<{ name: string }>;
                };
              }) => {
                if (obj.package && obj.package.name) {
                  // Check if username matches author or maintainers
                  const authorMatch =
                    obj.package.author?.name?.toLowerCase() ===
                    username.toLowerCase();
                  const maintainerMatch = obj.package.maintainers?.some(
                    (m) => m.name?.toLowerCase() === username.toLowerCase()
                  );

                  if (authorMatch || maintainerMatch) {
                    packages[obj.package.name] = obj.package;
                  }
                }
              }
            );
          }
        }
      } catch (error) {
        console.log("Broader search failed:", error);
      }
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
    const allFoundPackages = Object.keys(packages);
    console.log(
      `Found ${allFoundPackages.length} packages for user ${username}:`,
      allFoundPackages
    );
    console.log(
      `Checking against ${INFECTED_PACKAGE_NAMES.size} known infected packages`
    );

    const infectedPackages = allFoundPackages
      .filter((pkg) => {
        const isInfected = INFECTED_PACKAGE_NAMES.has(pkg);
        if (isInfected) {
          console.log(`🚨 INFECTED PACKAGE DETECTED: ${pkg}`);
        }
        return isInfected;
      })
      .map((pkg) => {
        const infectedPkg = INFECTED_PACKAGE_MAP.get(pkg);
        return {
          name: pkg,
          versions: infectedPkg?.versions || [],
          category: infectedPkg?.category || "unknown",
        };
      });

    console.log(
      `Found ${infectedPackages.length} infected packages:`,
      infectedPackages
    );

    // Additional check: Search for any infected packages that might be associated with this username
    // by checking each infected package directly via NPM API
    const additionalInfectedPackages: typeof infectedPackages = [];

    // If we found packages but none were infected, or if we found no packages at all,
    // do a direct check on known infected packages
    if (allFoundPackages.length === 0 || infectedPackages.length === 0) {
      console.log(
        `Performing direct check on known infected packages for user ${username}...`
      );

      // Get popular infected packages first (most likely to be tested)
      const priorityInfectedPackages = [
        "angulartics2",
        "ngx-bootstrap",
        "ngx-toastr",
        "ng2-file-upload",
        "@ctrl/ngx-codemirror",
        "@ctrl/ngx-csv",
        "@ctrl/react-adsense",
        "express-fileupload",
        "node-red-contrib-mqtt-broker",
      ].filter((pkg) => INFECTED_PACKAGE_NAMES.has(pkg));

      // Check priority packages first, then sample from remaining
      const sampleInfectedPackages = [
        ...priorityInfectedPackages,
        ...Array.from(INFECTED_PACKAGE_NAMES)
          .filter((pkg) => !priorityInfectedPackages.includes(pkg))
          .slice(0, 15),
      ];

      for (const packageName of sampleInfectedPackages) {
        try {
          const packageUrl = `https://registry.npmjs.org/${encodeURIComponent(
            packageName
          )}`;
          const packageResponse = await fetch(packageUrl);

          if (packageResponse.ok) {
            const packageData = await packageResponse.json();

            // Check if this user is the author or maintainer
            const authorName = packageData.author?.name || packageData.author;
            const isAuthor =
              typeof authorName === "string" &&
              authorName.toLowerCase() === username.toLowerCase();

            const isMaintainer = packageData.maintainers?.some(
              (m: { name: string } | string) => {
                const maintainerName = typeof m === "string" ? m : m.name;
                return maintainerName?.toLowerCase() === username.toLowerCase();
              }
            );

            if (isAuthor || isMaintainer) {
              console.log(
                `🚨 DIRECT INFECTED PACKAGE MATCH: ${packageName} is associated with user ${username}`
              );
              console.log(`- Author: ${authorName}, Is Author: ${isAuthor}`);
              console.log(
                `- Maintainers: ${JSON.stringify(
                  packageData.maintainers
                )}, Is Maintainer: ${isMaintainer}`
              );

              const infectedPkg = INFECTED_PACKAGE_MAP.get(packageName);
              additionalInfectedPackages.push({
                name: packageName,
                versions: infectedPkg?.versions || [],
                category: infectedPkg?.category || "unknown",
              });

              // Also add this package to the found packages list if it wasn't already there
              if (!packages[packageName]) {
                packages[packageName] = {
                  name: packageName,
                  author: { name: authorName },
                };
                allFoundPackages.push(packageName);
              }
            }
          }
        } catch (error) {
          console.log(`Failed to check package ${packageName}:`, error);
          // Continue checking other packages
        }
      }
    }

    // Combine both infected package lists
    const allInfectedPackages = [
      ...infectedPackages,
      ...additionalInfectedPackages,
    ];

    if (allInfectedPackages.length > 0) {
      console.warn(
        `🚨 SECURITY ALERT: Infected NPM packages found for user ${username}:`,
        allInfectedPackages
      );
      return {
        ...createCleanCompromisedData(),
        modules: {
          npm: {
            authenticated: false, // Only set to true if actual credentials are leaked
            username: username,
            suspiciousPackages: allFoundPackages, // All packages by the user
            infectedPackages: allInfectedPackages, // Only the infected ones
            suspicious: true,
            suspiciousReasons: [
              `⚠️ SECURITY ALERT: This account has published packages with compromised versions in their history.`,
              `${allInfectedPackages.length} package(s) have been identified with security incidents.`,
              `Review all packages from this account for potential security risks.`,
            ],
          },
        },
      };
    }

    console.log(`Total packages found: ${allFoundPackages.length}`);
    console.log(
      `Total infected packages detected: ${allInfectedPackages.length}`
    );

    // If no infected packages but packages were found, show account info without marking as compromised
    if (allFoundPackages.length > 0) {
      console.log(
        `No infected packages found, but ${allFoundPackages.length} packages are associated with user ${username}`
      );
      return {
        ...createCleanCompromisedData(),
        modules: {
          npm: {
            authenticated: false, // Don't mark as authenticated unless credentials are leaked
            username: username,
            suspiciousPackages: allFoundPackages,
            packageName: undefined,
            suspicious: false, // Not suspicious if no infected packages found
            suspiciousReasons: [
              `Found ${allFoundPackages.length} packages associated with this account. All packages appear clean.`,
            ],
          },
        },
      };
    }

    console.log(`No packages found for user ${username}`);

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
            platformDetailed: "npm-registry",
            architectureDetailed: "unknown",
          },
          environment: {},
          modules: {
            npm: {
              authenticated: false,
              username: null,
              packageName: packageName,
              detectedVersion: versionToCheck,
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
          platformDetailed: "npm-registry",
          architectureDetailed: "unknown",
        },
        environment: {},
        modules: {
          npm: {
            authenticated: false,
            username: null,
            packageName: packageName,
            detectedVersion: latestVersion,
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
          platformDetailed: "npm-registry",
          architectureDetailed: "unknown",
        },
        environment: {},
        modules: {
          npm: {
            authenticated: false,
            username: null,
            packageName: packageName,
            detectedVersion: latestVersion, // Include the detected version
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
            // Add flag to indicate this package has infected history but current version is clean
            hasInfectedHistory: true,
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
            detectedVersion: latestVersion, // For malware indicators case
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
          detectedVersion: latestVersion, // Include the detected version
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
