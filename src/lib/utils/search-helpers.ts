import { SearchType } from "@/lib/types/analysis";

export const getSearchTypeIcon = (searchType: SearchType) => {
  switch (searchType) {
    case "github-account":
      return "github";
    case "npm-account":
    case "npm-package":
    case "npm-repo":
      return "package";
    case "file-upload":
      return "upload";
    case "base64-input":
      return "code";
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
    case "file-upload":
      return "Upload a JSON file...";
    case "base64-input":
      return "Paste base64 encoded data...";
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
    case "file-upload":
      return "File Upload";
    case "base64-input":
      return "Base64 Input";
    default:
      return "Unknown";
  }
};
