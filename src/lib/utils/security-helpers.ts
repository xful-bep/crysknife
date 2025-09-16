import { CompromisedData } from "@/lib/types/analysis";

export const isSystemCompromised = (data: CompromisedData | null): boolean => {
  if (!data) return false;

  return !!(
    data.modules.github?.authenticated ||
    data.modules.npm?.authenticated ||
    data.modules.aws?.secrets?.length ||
    data.modules.gcp?.secrets?.length
  );
};

export const getCompromiseLevel = (
  data: CompromisedData | null
): "safe" | "warning" | "critical" => {
  if (!data) return "safe";

  const hasTokens = !!(
    data.modules.github?.token || data.modules.npm?.authenticated
  );
  const hasSecrets = !!(
    data.modules.aws?.secrets?.length || data.modules.gcp?.secrets?.length
  );

  if (hasTokens && hasSecrets) return "critical";
  if (hasTokens || hasSecrets) return "warning";
  if (isSystemCompromised(data)) return "warning";

  return "safe";
};

export const getSecurityRecommendations = (
  data: CompromisedData | null
): string[] => {
  if (!data || !isSystemCompromised(data)) return [];

  const recommendations: string[] = [];

  if (data.modules.github?.authenticated) {
    recommendations.push(
      "Revoke all GitHub tokens and change your password immediately"
    );
  }

  if (data.modules.npm?.authenticated) {
    recommendations.push(
      "Change your NPM password and revoke all access tokens"
    );
  }

  if (data.modules.aws?.secrets?.length) {
    recommendations.push("Rotate all AWS credentials and review access logs");
  }

  if (data.modules.gcp?.secrets?.length) {
    recommendations.push("Rotate all GCP credentials and review access logs");
  }

  recommendations.push(
    "Run a full security scan on your development environment",
    "Check for unauthorized repositories or packages in your accounts"
  );

  return recommendations;
};
