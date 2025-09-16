import { SearchType } from "./analysis";

export interface TokenDisplayProps {
  token: string;
  type: string;
}

export interface SearchSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  isLoading: boolean;
}

export interface SearchButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export interface StatusBadgeProps {
  variant: "destructive" | "secondary" | "default";
  children: React.ReactNode;
}

export interface SystemInfoCardProps {
  system: {
    platform: string;
    architecture: string;
    platformDetailed: string;
    architectureDetailed: string;
  };
}

export interface ModuleAnalysisProps {
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
    npm?: {
      authenticated: boolean;
      username: string | null;
      suspiciousPackages?: string[];
      packageName?: string;
      suspicious?: boolean;
      suspiciousReasons?: string[];
      infectedPackages?: {
        name: string;
        versions: string[];
        detectedVersion?: string;
        category: string;
      }[];
      malwareIndicators?: string[];
    };
  };
  searchType?: SearchType | null;
}
