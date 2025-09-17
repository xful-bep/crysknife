import { CompromisedData } from "@/lib/types/analysis";

/**
 * Helper function to sanitize object values recursively
 */
function sanitizeObjectValues(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] =
        value.length > 8
          ? `${value.substring(0, 4)}***${value.substring(value.length - 4)}`
          : "***REDACTED***";
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeObjectValues(value as Record<string, unknown>);
    } else {
      result[key] = "***REDACTED***";
    }
  }

  return result;
}

/**
 * Function to sanitize sensitive data for safe display
 */
export function sanitizeCompromisedData(
  data: CompromisedData
): CompromisedData {
  // Deep clone the data to avoid mutating the original
  const sanitized = JSON.parse(JSON.stringify(data)) as CompromisedData;

  // Sanitize environment variables that look like secrets
  Object.keys(sanitized.environment).forEach((key) => {
    const value = sanitized.environment[key];
    const lowerKey = key.toLowerCase();
    const lowerValue = value.toLowerCase();

    // Check if it's likely a secret
    if (
      lowerKey.includes("token") ||
      lowerKey.includes("key") ||
      lowerKey.includes("secret") ||
      lowerKey.includes("password") ||
      lowerKey.includes("auth") ||
      lowerValue.includes("token") ||
      lowerValue.includes("key") ||
      lowerValue.includes("secret") ||
      value.length > 50 // Long values might be tokens/keys
    ) {
      sanitized.environment[key] =
        value.length > 8
          ? `${value.substring(0, 3)}***${value.substring(value.length - 3)}`
          : "***REDACTED***";
    }
  });

  // Sanitize GitHub token (but preserve YouTube URLs for easter eggs)
  if (sanitized.modules?.github?.token) {
    const token = sanitized.modules.github.token;

    // Check if it's a YouTube URL - if so, don't sanitize it
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

    if (!isYouTubeUrl(token)) {
      sanitized.modules.github.token =
        token.length > 8
          ? `${token.substring(0, 4)}***${token.substring(token.length - 4)}`
          : "***REDACTED***";
    }
    // If it's a YouTube URL, leave it as-is for the easter egg
  }

  // Sanitize AWS secrets
  if (
    sanitized.modules?.aws?.secrets &&
    Array.isArray(sanitized.modules.aws.secrets)
  ) {
    sanitized.modules.aws.secrets = sanitized.modules.aws.secrets.map(
      (secret: unknown) => {
        if (typeof secret === "string") {
          return secret.length > 8
            ? `${secret.substring(0, 4)}***${secret.substring(
                secret.length - 4
              )}`
            : "***REDACTED***";
        } else if (typeof secret === "object" && secret !== null) {
          // For complex objects, recursively sanitize
          return sanitizeObjectValues(secret as Record<string, unknown>);
        }
        return "***REDACTED***";
      }
    );
  }

  // Sanitize GCP secrets
  if (
    sanitized.modules?.gcp?.secrets &&
    Array.isArray(sanitized.modules.gcp.secrets)
  ) {
    sanitized.modules.gcp.secrets = sanitized.modules.gcp.secrets.map(
      (secret: unknown) => {
        if (typeof secret === "string") {
          return secret.length > 8
            ? `${secret.substring(0, 4)}***${secret.substring(
                secret.length - 4
              )}`
            : "***REDACTED***";
        } else if (typeof secret === "object" && secret !== null) {
          return sanitizeObjectValues(secret as Record<string, unknown>);
        }
        return "***REDACTED***";
      }
    );
  }

  // Sanitize NPM username if it contains sensitive patterns
  if (
    sanitized.modules?.npm?.username &&
    typeof sanitized.modules.npm.username === "string"
  ) {
    const username = sanitized.modules.npm.username;
    // Only mask if it looks like it might contain sensitive data (tokens, keys, etc.)
    if (
      username.includes("token") ||
      username.includes("key") ||
      username.includes("secret") ||
      username.length > 20
    ) {
      sanitized.modules.npm.username =
        username.length > 8
          ? `${username.substring(0, 4)}***${username.substring(
              username.length - 4
            )}`
          : "***REDACTED***";
    }
  }

  return sanitized;
}

/**
 * Recursively decodes base64 content up to maxIterations times
 * until valid JSON is found or max iterations reached
 */
export function recursiveBase64Decode(
  content: string,
  iteration: number = 1,
  maxIterations: number = 5,
  username: string
): CompromisedData | null {
  if (iteration > maxIterations) {
    console.log(`Max iterations (${maxIterations}) reached for ${username}`);
    return null;
  }

  try {
    // Clean content for the first iteration
    const cleanContent = iteration === 1 ? content.replace(/\s/g, "") : content;

    // Decode base64
    const decoded = Buffer.from(cleanContent, "base64").toString("utf-8");
    console.log(
      `Iteration ${iteration} decode successful for ${username}, Length: ${decoded.length}`
    );

    // Try to parse as JSON
    try {
      const parsed = JSON.parse(decoded) as CompromisedData;

      // Validate structure
      if (parsed.system && parsed.modules) {
        console.log(
          `Successfully decoded data after ${iteration} iteration(s) for ${username}`
        );
        console.log(
          "Environment vars count:",
          Object.keys(parsed.environment || {}).length
        );
        console.log("Modules found:", Object.keys(parsed.modules));
        return parsed;
      } else {
        console.log(
          `Iteration ${iteration}: Parsed JSON but invalid structure for ${username}, trying next iteration`
        );
        return recursiveBase64Decode(
          decoded,
          iteration + 1,
          maxIterations,
          username
        );
      }
    } catch {
      console.log(
        `Iteration ${iteration}: JSON parse failed for ${username}, trying next iteration`
      );
      // If JSON parsing fails, try decoding again
      return recursiveBase64Decode(
        decoded,
        iteration + 1,
        maxIterations,
        username
      );
    }
  } catch (decodeError) {
    console.error(
      `Iteration ${iteration}: Base64 decode failed for ${username}:`,
      decodeError instanceof Error ? decodeError.message : String(decodeError)
    );
    return null;
  }
}

/**
 * Creates a default clean CompromisedData structure
 */
export function createCleanCompromisedData(): CompromisedData {
  return {
    system: {
      platform: "unknown",
      architecture: "unknown",
      platformDetailed: "unknown",
      architectureDetailed: "unknown",
    },
    environment: {},
    modules: {},
  };
}

/**
 * Creates a fallback CompromisedData structure for suspicious but undecodable accounts
 */
export function createSuspiciousCompromisedData(): CompromisedData {
  return {
    system: {
      platform: "unknown",
      architecture: "unknown",
      platformDetailed: "unknown",
      architectureDetailed: "unknown",
    },
    environment: {},
    modules: {
      github: {
        authenticated: true,
        token: "***REDACTED***",
        username: {},
      },
    },
  };
}
