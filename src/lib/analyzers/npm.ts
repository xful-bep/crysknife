import { CompromisedData } from "@/lib/types/analysis";
import { createCleanCompromisedData } from "@/lib/utils/analysis";

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

      // Look for suspicious package names or patterns
      const suspiciousPatterns = [
        "shai-hulud",
        "malware",
        "stealer",
        "token-grab",
      ];
      const hasSuspiciousPackages = Object.keys(packages).some((pkg) =>
        suspiciousPatterns.some((pattern) =>
          pkg.toLowerCase().includes(pattern)
        )
      );

      if (hasSuspiciousPackages) {
        return {
          ...createCleanCompromisedData(),
          modules: {
            npm: {
              authenticated: true,
              username: username,
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
    const packageUrl = `https://registry.npmjs.org/${packageName}`;
    const packageResponse = await fetch(packageUrl);

    if (packageResponse.status === 404) {
      return createCleanCompromisedData();
    }

    if (!packageResponse.ok) {
      throw new Error(`NPM API error: ${packageResponse.status}`);
    }

    const packageData = await packageResponse.json();

    // Check for malicious patterns
    const description = packageData.description?.toLowerCase() || "";
    const readme = packageData.readme?.toLowerCase() || "";
    const keywords = packageData.keywords?.join(" ").toLowerCase() || "";

    const maliciousPatterns = [
      "shai-hulud",
      "token stealer",
      "credential harvest",
      "github token",
      "npm token",
      "steal",
      "malware",
    ];

    const hasMatches = maliciousPatterns.some(
      (pattern) =>
        description.includes(pattern) ||
        readme.includes(pattern) ||
        keywords.includes(pattern)
    );

    if (hasMatches || packageName.toLowerCase().includes("shai-hulud")) {
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
            authenticated: true,
            username: packageData.author?.name || "unknown",
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
