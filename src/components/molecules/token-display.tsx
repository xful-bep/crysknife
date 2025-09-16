import { StatusBadge } from "@/components/atoms/status-badge";
import { TokenDisplayProps } from "@/lib/types/components";
import { maskToken } from "@/lib/utils/report-helpers";

export function TokenDisplay({ token, type }: TokenDisplayProps) {
  // Check if this is a sanitized/redacted token
  const isSanitized = token.includes("***") || token === "***REDACTED***";
  const displayToken = isSanitized ? token : maskToken(token);

  const getSeverityColor = (tokenType: string) => {
    const lowerType = tokenType.toLowerCase();
    return ["github", "npm", "aws", "gcp"].includes(lowerType)
      ? "destructive"
      : "secondary";
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <StatusBadge variant={getSeverityColor(type)}>
        {type.toUpperCase()} TOKEN
      </StatusBadge>

      <code className="flex-1 font-mono text-sm bg-white dark:bg-slate-800 px-2 py-1 rounded border">
        {displayToken}
      </code>

      <div className="flex gap-1">
        {isSanitized && (
          <div className="flex items-center text-xs text-amber-600 dark:text-amber-400 mr-2">
            <span>🔒 Protected</span>
          </div>
        )}
      </div>
    </div>
  );
}
