export type SearchType =
  | "github-account"
  | "npm-account"
  | "npm-package"
  | "file-upload"
  | "base64-input"
  | "package-json";

export interface CompromisedData {
  system: {
    platform: string;
    architecture: string;
    platformDetailed: string;
    architectureDetailed: string;
  };
  environment: Record<string, string>;
  modules: {
    github?: {
      authenticated: boolean;
      token?: string;
      username?: Record<string, unknown>;
    };
    aws?: {
      secrets: unknown[];
    };
    gcp?: {
      secrets: unknown[];
    };
    truffleHog?: {
      available: boolean;
      installed: boolean;
      version: string | null;
      platform: {
        platform: string;
        architecture: string;
      };
      results: {
        success: boolean;
        error?: string;
        executionTime: number;
      };
    };
    npm?: {
      authenticated: boolean;
      username: string | null;
      suspiciousPackages?: string[];
      packageName?: string;
      detectedVersion?: string; // Version of the package being analyzed
      suspicious?: boolean;
      suspiciousReasons?: string[];
      hasInfectedHistory?: boolean; // Flag to indicate package has infected versions in history but current is clean
      infectedPackages?: {
        name: string;
        versions: string[];
        detectedVersion?: string;
        category: string;
      }[];
      malwareIndicators?: string[];
    };
  };
}

export interface AnalysisRequest {
  type: SearchType;
  query: string;
}

export interface AnalysisResponse {
  data: CompromisedData | null;
  error?: string;
}

export interface SearchFormData {
  type: SearchType;
  query: string;
}

export interface SecurityReport {
  timestamp: string;
  searchType: SearchType;
  searchQuery: string;
  analysis: CompromisedData;
  isCompromised: boolean;
}
