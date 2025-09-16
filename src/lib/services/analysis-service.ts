import { AnalysisRequest, AnalysisResponse } from "@/lib/types/analysis";

export class AnalysisService {
  private static readonly BASE_URL = "/api";

  static async analyzeTarget(
    request: AnalysisRequest
  ): Promise<AnalysisResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred during analysis");
    }
  }
}
