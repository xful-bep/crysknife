// Security utility functions for safe data handling
// Note: Download functionality removed for security reasons to prevent data exfiltration

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

export const maskToken = (token: string): string => {
  if (token.length <= 8) return "*".repeat(token.length);
  return (
    token.substring(0, 4) +
    "*".repeat(Math.max(0, token.length - 8)) +
    token.substring(token.length - 4)
  );
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
