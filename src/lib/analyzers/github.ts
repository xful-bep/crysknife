import { CompromisedData } from "@/lib/types/analysis";
import {
  recursiveBase64Decode,
  createCleanCompromisedData,
  createSuspiciousCompromisedData,
} from "@/lib/utils/analysis";

/**
 * Analyzes a GitHub account for Shai-Hulud malware presence
 */
export async function analyzeGitHubAccount(
  username: string
): Promise<CompromisedData> {
  console.log("Analyzing GitHub account:", username);

  try {
    // Check for Shai-Hulud repository pattern
    const repoUrl = `https://api.github.com/repos/${username}/Shai-Hulud`;
    const repoResponse = await fetch(repoUrl, {
      headers: {
        "User-Agent": "Crysknife-Analysis-Tool",
      },
    });

    if (repoResponse.status === 404) {
      // No Shai-Hulud repo found - likely clean
      return createCleanCompromisedData();
    }

    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.status}`);
    }

    // Check for data.json file in main branch
    const dataUrl = `https://api.github.com/repos/${username}/Shai-Hulud/contents/data.json`;
    const dataResponse = await fetch(dataUrl, {
      headers: {
        "User-Agent": "Crysknife-Analysis-Tool",
      },
    });

    if (dataResponse.status === 404) {
      // Repo exists but no data.json - suspicious but not conclusive
      return {
        ...createCleanCompromisedData(),
        modules: {
          github: {
            authenticated: false,
            username: {},
          },
        },
      };
    }

    if (!dataResponse.ok) {
      throw new Error(`GitHub API error: ${dataResponse.status}`);
    }

    const fileData = await dataResponse.json();

    if (fileData.content) {
      // Use recursive decoder with up to 5 iterations
      const malwareData = recursiveBase64Decode(
        fileData.content,
        1,
        5,
        username
      );

      if (malwareData) {
        return malwareData;
      } else {
        console.warn(
          `Failed to decode data for ${username} after all attempts`
        );
      }
    }

    // Found suspicious patterns but couldn't decode properly
    return createSuspiciousCompromisedData();
  } catch (error) {
    console.error("Error analyzing GitHub account:", error);
    throw error;
  }
}
