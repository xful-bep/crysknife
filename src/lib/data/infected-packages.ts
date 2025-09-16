/**
 * Lista de pacotes NPM comprometidos em incidente de segurança
 * Fonte: Relatório de segurança de setembro 2025
 */

export interface InfectedPackage {
  name: string;
  versions: string[];
  category: string;
}

export const INFECTED_PACKAGES: InfectedPackage[] = [
  {
    name: "angulartics2",
    versions: ["14.1.2"],
    category: "angular",
  },
  {
    name: "@ctrl/deluge",
    versions: ["7.2.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/golang-template",
    versions: ["1.4.3"],
    category: "ctrl",
  },
  {
    name: "@ctrl/magnet-link",
    versions: ["4.0.4"],
    category: "ctrl",
  },
  {
    name: "@ctrl/ngx-codemirror",
    versions: ["7.0.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/ngx-csv",
    versions: ["6.0.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/ngx-emoji-mart",
    versions: ["9.2.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/ngx-rightclick",
    versions: ["4.0.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/qbittorrent",
    versions: ["9.7.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/react-adsense",
    versions: ["2.0.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/shared-torrent",
    versions: ["6.3.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/tinycolor",
    versions: ["4.1.1", "4.1.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/torrent-file",
    versions: ["4.1.2"],
    category: "ctrl",
  },
  {
    name: "@ctrl/transmission",
    versions: ["7.3.1"],
    category: "ctrl",
  },
  {
    name: "@ctrl/ts-base32",
    versions: ["4.0.2"],
    category: "ctrl",
  },
  {
    name: "encounter-playground",
    versions: ["0.0.5"],
    category: "misc",
  },
  {
    name: "json-rules-engine-simplified",
    versions: ["0.2.4", "0.2.1"],
    category: "misc",
  },
  {
    name: "koa2-swagger-ui",
    versions: ["5.11.2", "5.11.1"],
    category: "koa",
  },
  {
    name: "@nativescript-community/gesturehandler",
    versions: ["2.0.35"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/sentry",
    versions: ["4.6.43"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/text",
    versions: ["1.6.13"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-collectionview",
    versions: ["6.0.6"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-drawer",
    versions: ["0.1.30"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-image",
    versions: ["4.5.6"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-material-bottomsheet",
    versions: ["7.2.72"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-material-core",
    versions: ["7.2.76"],
    category: "nativescript",
  },
  {
    name: "@nativescript-community/ui-material-core-tabs",
    versions: ["7.2.76"],
    category: "nativescript",
  },
  {
    name: "ngx-color",
    versions: ["10.0.2"],
    category: "angular",
  },
  {
    name: "ngx-toastr",
    versions: ["19.0.2"],
    category: "angular",
  },
  {
    name: "ngx-trend",
    versions: ["8.0.1"],
    category: "angular",
  },
  {
    name: "react-complaint-image",
    versions: ["0.0.35"],
    category: "react",
  },
  {
    name: "react-jsonschema-form-conditionals",
    versions: ["0.3.21"],
    category: "react",
  },
  {
    name: "react-jsonschema-form-extras",
    versions: ["1.0.4"],
    category: "react",
  },
  {
    name: "rxnt-authentication",
    versions: ["0.0.6"],
    category: "rxnt",
  },
  {
    name: "rxnt-healthchecks-nestjs",
    versions: ["1.0.5"],
    category: "rxnt",
  },
  {
    name: "rxnt-kue",
    versions: ["1.0.7"],
    category: "rxnt",
  },
  {
    name: "swc-plugin-component-annotate",
    versions: ["1.9.2"],
    category: "swc",
  },
  {
    name: "ts-gaussian",
    versions: ["3.0.6"],
    category: "typescript",
  },
];

// Mapas para verificação rápida
export const INFECTED_PACKAGE_NAMES = new Set(
  INFECTED_PACKAGES.map((pkg) => pkg.name)
);

export const INFECTED_PACKAGE_MAP = new Map(
  INFECTED_PACKAGES.map((pkg) => [pkg.name, pkg])
);

// Indicadores de comprometimento
export const MALWARE_INDICATORS = {
  bundleHash:
    "46faab8ab153fae6e80e7cca38eab363075bb524edd79e42269217a083628f09",
  webhookEndpoint: "webhook.site/bb8ca5f6-4175-45d2-b042-fc9ebb8170b7",
  lifecycleScript: "node bundle.js",
};

/**
 * Verifica se um pacote está na lista de infectados
 */
export function isPackageInfected(
  packageName: string,
  version?: string
): {
  infected: boolean;
  infectedVersions?: string[];
  specificVersion?: boolean;
} {
  const pkg = INFECTED_PACKAGE_MAP.get(packageName);

  if (!pkg) {
    return { infected: false };
  }

  if (!version) {
    return {
      infected: true,
      infectedVersions: pkg.versions,
    };
  }

  const isSpecificVersionInfected = pkg.versions.includes(version);

  return {
    infected: isSpecificVersionInfected,
    infectedVersions: pkg.versions,
    specificVersion: isSpecificVersionInfected,
  };
}

/**
 * Verifica se uma string contém referências a pacotes infectados
 */
export function findInfectedPackagesInText(text: string): InfectedPackage[] {
  const found: InfectedPackage[] = [];

  for (const pkg of INFECTED_PACKAGES) {
    if (text.includes(pkg.name)) {
      found.push(pkg);
    }
  }

  return found;
}

/**
 * Verifica se o ambiente contém indicadores de malware
 */
export function checkMalwareIndicators(
  environment: Record<string, string | number | boolean>
): {
  hasMalware: boolean;
  indicators: string[];
} {
  const indicators: string[] = [];

  // Verifica script de lifecycle
  if (environment.npm_lifecycle_script === MALWARE_INDICATORS.lifecycleScript) {
    indicators.push("Malicious lifecycle script detected");
  }

  // Verifica pacotes infectados no environment
  for (const [key, value] of Object.entries(environment)) {
    const valueStr = String(value).toLowerCase();

    // Verifica hash do bundle.js
    if (valueStr.includes(MALWARE_INDICATORS.bundleHash)) {
      indicators.push("Malicious bundle.js hash detected");
    }

    // Verifica endpoint de exfiltração
    if (valueStr.includes(MALWARE_INDICATORS.webhookEndpoint)) {
      indicators.push("Data exfiltration endpoint detected");
    }

    // Verifica pacotes infectados
    for (const pkg of INFECTED_PACKAGES) {
      if (
        key.includes("npm_package_name") &&
        valueStr === pkg.name.toLowerCase()
      ) {
        indicators.push(`Infected package detected: ${pkg.name}`);
      }

      if (
        key.includes("npm_package_resolved") &&
        valueStr.includes(pkg.name.toLowerCase())
      ) {
        indicators.push(`Infected package in resolved URL: ${pkg.name}`);
      }
    }
  }

  return {
    hasMalware: indicators.length > 0,
    indicators,
  };
}
