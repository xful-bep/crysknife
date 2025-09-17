import { CompromisedData } from "@/lib/types/analysis";

export const isSystemCompromised = (data: CompromisedData | null): boolean => {
  if (!data) return false;

  return !!(
    data.modules.github?.authenticated ||
    data.modules.npm?.authenticated ||
    data.modules.npm?.infectedPackages?.length ||
    data.modules.npm?.malwareIndicators?.length ||
    data.modules.aws?.secrets?.length ||
    data.modules.gcp?.secrets?.length
  );
};

export const hasSecurityConcerns = (data: CompromisedData | null): boolean => {
  if (!data) return false;

  return !!(
    isSystemCompromised(data) ||
    data.modules.npm?.suspicious ||
    data.modules.npm?.suspiciousPackages?.length ||
    data.modules.npm?.malwareIndicators?.length
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
  const hasInfectedPackages = !!data.modules.npm?.infectedPackages?.length;
  const hasSecurityConcerns = !!(
    data.modules.npm?.suspicious ||
    data.modules.npm?.suspiciousPackages?.length ||
    data.modules.npm?.malwareIndicators?.length
  );

  if (hasInfectedPackages) return "critical";
  if (hasTokens && hasSecrets) return "critical";
  if (hasTokens || hasSecrets) return "warning";
  if (isSystemCompromised(data)) return "warning";
  if (hasSecurityConcerns) return "warning";

  return "safe";
};

export const getSecurityRecommendations = (
  data: CompromisedData | null
): string[] => {
  if (!data || !hasSecurityConcerns(data)) return [];

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

  if (data.modules.npm?.infectedPackages?.length) {
    recommendations.push(
      "Remove all infected packages from your dependencies immediately",
      "Audit your environment variables and secrets for potential data theft",
      "Check for any unauthorized network connections or data exfiltration"
    );
  }

  if (
    data.modules.npm?.suspicious &&
    !data.modules.npm?.infectedPackages?.length
  ) {
    recommendations.push(
      "Review the flagged NPM packages carefully before using them",
      "Consider using alternative packages with better security track records",
      "Monitor for security updates and patches from the package maintainers"
    );
  }

  if (data.modules.aws?.secrets?.length) {
    recommendations.push("Rotate all AWS credentials and review access logs");
  }

  if (data.modules.gcp?.secrets?.length) {
    recommendations.push("Rotate all GCP credentials and review access logs");
  }

  if (isSystemCompromised(data)) {
    recommendations.push(
      "Run a full security scan on your development environment",
      "Check for unauthorized repositories or packages in your accounts"
    );
  }

  return recommendations;
};
