"use client";

import { CompromisedData } from "@/lib/types/analysis";
import { createCleanCompromisedData } from "@/lib/utils/analysis";
import {
  checkMalwareIndicators,
  findInfectedPackagesInText,
  isPackageInfected,
  INFECTED_PACKAGE_MAP,
} from "@/lib/data/infected-packages";

interface InfectedPackageInfo {
  name: string;
  versions: string[];
  detectedVersion?: string;
  category: string;
}

interface LeakedData {
  system?: {
    platform: string;
    architecture: string;
    platformDetailed: string;
    architectureDetailed: string;
  };
  environment?: Record<string, string | number | boolean>;
  modules?: Record<string, unknown>;
}

/**
 * Analisa dados de ambiente JSON para detectar pacotes infectados e indicadores de malware
 */
export async function analyzeEnvironmentData(
  data: Record<string, unknown>
): Promise<CompromisedData> {
  console.log("Analyzing environment data for infected packages");

  try {
    const result = createCleanCompromisedData();
    const leakedData = data as LeakedData;

    // Se os dados têm a estrutura esperada do leak
    if (leakedData.system && leakedData.environment && leakedData.modules) {
      result.system = leakedData.system;
      result.environment = Object.fromEntries(
        Object.entries(leakedData.environment).map(([k, v]) => [k, String(v)])
      );

      // Verifica indicadores de malware no ambiente
      const malwareCheck = checkMalwareIndicators(leakedData.environment);

      // Verifica pacotes infectados mencionados no environment
      const infectedPackages: InfectedPackageInfo[] = [];

      // Verifica npm_package_name e npm_package_version
      const npmPackageName = String(
        leakedData.environment.npm_package_name || ""
      );
      const npmPackageVersion = String(
        leakedData.environment.npm_package_version || ""
      );

      if (npmPackageName) {
        const infectionCheck = isPackageInfected(
          npmPackageName,
          npmPackageVersion
        );
        if (infectionCheck.infected) {
          const infectedPkg = INFECTED_PACKAGE_MAP.get(npmPackageName);
          infectedPackages.push({
            name: npmPackageName,
            versions: infectionCheck.infectedVersions || [],
            detectedVersion: npmPackageVersion,
            category: infectedPkg?.category || "unknown",
          });
        }
      }

      // Verifica npm_package_resolved para URLs de pacotes infectados
      const npmPackageResolved = String(
        leakedData.environment.npm_package_resolved || ""
      );
      if (npmPackageResolved) {
        const foundInText = findInfectedPackagesInText(npmPackageResolved);
        for (const pkg of foundInText) {
          const existingPkg = infectedPackages.find((p) => p.name === pkg.name);
          if (!existingPkg) {
            infectedPackages.push({
              name: pkg.name,
              versions: pkg.versions,
              category: pkg.category,
            });
          }
        }
      }

      // Busca por pacotes infectados em todo o conteúdo do environment
      const environmentText = JSON.stringify(leakedData.environment);
      const foundInEnvironment = findInfectedPackagesInText(environmentText);

      for (const pkg of foundInEnvironment) {
        const existingPkg = infectedPackages.find((p) => p.name === pkg.name);
        if (!existingPkg) {
          infectedPackages.push({
            name: pkg.name,
            versions: pkg.versions,
            category: pkg.category,
          });
        }
      }

      // Se encontrou pacotes infectados ou indicadores de malware
      if (infectedPackages.length > 0 || malwareCheck.hasMalware) {
        result.modules.npm = {
          authenticated: !!npmPackageName,
          username: String(
            leakedData.environment.USER || leakedData.environment.USERNAME || ""
          ),
          suspicious: true,
          suspiciousReasons: [
            ...malwareCheck.indicators,
            ...infectedPackages.map(
              (pkg) => `Infected package detected: ${pkg.name}`
            ),
          ],
          infectedPackages: infectedPackages,
          malwareIndicators: malwareCheck.indicators,
        };
      }

      return result;
    }

    // Se não tem a estrutura esperada, tenta analisar como texto
    const dataText = JSON.stringify(data);
    const foundPackages = findInfectedPackagesInText(dataText);

    // Criar um ambiente seguro para verificação de malware
    const safeEnvironment: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(data)) {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        safeEnvironment[key] = value;
      }
    }
    const malwareCheck = checkMalwareIndicators(safeEnvironment);

    if (foundPackages.length > 0 || malwareCheck.hasMalware) {
      result.modules.npm = {
        authenticated: false,
        username: null,
        suspicious: true,
        suspiciousReasons: [
          ...malwareCheck.indicators,
          ...foundPackages.map(
            (pkg) => `Infected package found in data: ${pkg.name}`
          ),
        ],
        infectedPackages: foundPackages.map((pkg) => ({
          name: pkg.name,
          versions: pkg.versions,
          category: pkg.category,
        })),
        malwareIndicators: malwareCheck.indicators,
      };
    }

    return result;
  } catch (error) {
    console.error("Error analyzing environment data:", error);
    throw error;
  }
}

/**
 * Analisa o conteúdo de um package.json para detectar pacotes infectados
 */
export async function analyzePackageJson(
  packageJsonContent: string
): Promise<CompromisedData> {
  console.log("Analyzing package.json for infected packages");

  try {
    const packageJson = JSON.parse(packageJsonContent);
    const result = createCleanCompromisedData();

    result.system = {
      platform: "npm",
      architecture: "unknown",
      platformDetailed: "package-json",
      architectureDetailed: "unknown",
    };

    const infectedPackages: InfectedPackageInfo[] = [];
    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
      ...packageJson.optionalDependencies,
    };

    // Verifica cada dependência
    for (const [packageName, version] of Object.entries(allDependencies)) {
      const versionStr = String(version).replace(/^[\^~>=<]/, ""); // Remove version prefixes
      const infectionCheck = isPackageInfected(packageName, versionStr);

      if (infectionCheck.infected) {
        const infectedPkg = INFECTED_PACKAGE_MAP.get(packageName);
        infectedPackages.push({
          name: packageName,
          versions: infectionCheck.infectedVersions || [],
          detectedVersion: versionStr,
          category: infectedPkg?.category || "unknown",
        });
      }
    }

    if (infectedPackages.length > 0) {
      result.modules.npm = {
        authenticated: false,
        username: null,
        suspicious: true,
        suspiciousReasons: infectedPackages.map(
          (pkg) =>
            `Infected package in dependencies: ${pkg.name}@${pkg.detectedVersion}`
        ),
        infectedPackages: infectedPackages,
      };
    }

    return result;
  } catch (error) {
    console.error("Error analyzing package.json:", error);
    throw error;
  }
}
