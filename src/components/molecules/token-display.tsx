import { StatusBadge } from "@/components/atoms/status-badge";
import { TokenDisplayProps } from "@/lib/types/components";
import { maskToken } from "@/lib/utils/report-helpers";

export function TokenDisplay({ token, type }: TokenDisplayProps) {
  // Check if this is a sanitized/redacted token
  const isSanitized = token.includes("***") || token === "***REDACTED***";
  const displayToken = isSanitized ? token : maskToken(token);

  // Check if the token is a YouTube URL
  const isYouTubeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname === "www.youtube.com" ||
        urlObj.hostname === "youtube.com" ||
        urlObj.hostname === "youtu.be"
      );
    } catch {
      return false;
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);

      // Standard YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
      if (urlObj.pathname === "/watch" && urlObj.searchParams.has("v")) {
        return urlObj.searchParams.get("v");
      }

      // Short YouTube URL: https://youtu.be/VIDEO_ID
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1); // Remove leading slash
      }

      return null;
    } catch {
      return null;
    }
  };

  const getSeverityColor = (tokenType: string) => {
    const lowerType = tokenType.toLowerCase();
    return ["github", "npm", "aws", "gcp"].includes(lowerType)
      ? "destructive"
      : "secondary";
  };

  const isYouTube = !isSanitized && isYouTubeUrl(token);
  const videoId = isYouTube ? getYouTubeVideoId(token) : null;

  return (
    <div className="space-y-3">
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
          {isYouTube && (
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mr-2">
              <span>🎵 YouTube Link</span>
            </div>
          )}
        </div>
      </div>

      {/* YouTube iframe for Rick Roll easter egg */}
      {isYouTube && videoId && (
        <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="mb-3 text-center">
            <h4 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-1">
              🎵 Easter Egg Detected!
            </h4>
            <p className="text-sm text-red-600 dark:text-red-400">
              Looks like someone left us a musical surprise instead of
              credentials...
            </p>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="mt-3 text-center text-xs text-slate-600 dark:text-slate-400">
            <p>
              🎭 This appears to be a harmless prank rather than actual stolen
              credentials.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
