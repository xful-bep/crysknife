export type SearchType =
  | "github-account"
  | "npm-account"
  | "npm-package"
  | "npm-repo"
  | "file-upload"
  | "base64-input";

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
      suspicious?: boolean;
      suspiciousReasons?: string[];
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
