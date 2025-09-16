// disabled to avoid rate-limiting from third-party APIs

import { NextRequest, NextResponse } from "next/server";
import { AnalysisRequest, CompromisedData } from "@/lib/types/analysis";
import { sanitizeCompromisedData } from "@/lib/utils/analysis";
import { performAnalysis } from "@/lib/analyzers";

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { type, query } = body;

    if (!query?.trim()) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    console.log(`Starting ${type} analysis for:`, query);

    // Perform the analysis using the appropriate analyzer
    const analysisResult: CompromisedData = await performAnalysis(type, query);

    // Sanitize sensitive data before sending to client
    const sanitizedResult = sanitizeCompromisedData(analysisResult);

    console.log(`Analysis completed for ${query}:`, {
      platform: sanitizedResult.system.platform,
      envCount: Object.keys(sanitizedResult.environment).length,
      modules: Object.keys(sanitizedResult.modules),
    });

    return NextResponse.json({ data: sanitizedResult });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Analysis failed",
        data: null,
      },
      { status: 500 }
    );
  }
}
