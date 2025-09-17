import { Suspense } from "react";
import { SecurityAnalysisTemplate } from "@/components/templates";
import { SecurityAnalysisSkeleton } from "@/components/organisms";

export default function Home() {
  return (
    <Suspense fallback={<SecurityAnalysisSkeleton />}>
      <SecurityAnalysisTemplate />
    </Suspense>
  );
}
