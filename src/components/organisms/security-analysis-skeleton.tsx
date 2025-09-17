"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SecurityAnalysisSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-16">
          {/* Header Section Skeleton */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto mb-2" />
            <Skeleton className="h-6 w-[500px] mx-auto" />
          </div>

          {/* Input Source Skeleton */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="gradient-border">
              <Card className="shadow-xl bg-card border-0 m-0">
                <CardHeader>
                  <Skeleton className="h-8 w-48 mx-auto mb-2" />
                  <Skeleton className="h-6 w-64 mx-auto" />
                </CardHeader>
                <CardContent>
                  {/* Tabs Skeleton */}
                  <div className="grid w-full grid-cols-4 gap-1 mb-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  {/* Search Form Skeleton */}
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-80 mx-auto" />
                    <div className="flex gap-3">
                      <Skeleton className="h-10 w-48" />
                      <div className="flex-1 flex gap-2">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Information Section Skeleton */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="space-y-2 mt-4">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-36" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="space-y-2 mt-4">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-28" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <footer className="mt-16 border-t bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <Skeleton className="h-5 w-20" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-16" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-18" />
                <Skeleton className="h-4 w-22" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-20" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-40" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
