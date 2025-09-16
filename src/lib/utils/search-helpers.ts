import { SearchType } from "@/lib/types/analysis";

export const getSearchTypeIcon = (searchType: SearchType) => {
  switch (searchType) {
    case "github-account":
      return "github";
    case "npm-account":
    case "npm-package":
    case "npm-repo":
      return "package";
    default:
      return "globe";
  }
};

export const getSearchTypePlaceholder = (searchType: SearchType): string => {
  switch (searchType) {
    case "github-account":
      return "Enter GitHub username...";
    case "npm-account":
      return "Enter NPM username...";
    case "npm-package":
      return "Enter NPM package name...";
    case "npm-repo":
      return "Enter NPM repository name...";
    default:
      return "Enter search term...";
  }
};

export const getSearchTypeLabel = (searchType: SearchType): string => {
  switch (searchType) {
    case "github-account":
      return "GitHub Account";
    case "npm-account":
      return "NPM Account";
    case "npm-package":
      return "NPM Package";
    case "npm-repo":
      return "NPM Repository";
    default:
      return "Unknown";
  }
};
