"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchForm, FileUpload, Base64Input } from "@/components/molecules";
import { SearchType } from "@/lib/types";

interface InputSourceProps {
  onSearch: (type: SearchType, query: string) => void;
  isLoading: boolean;
}

export function InputSource({ onSearch, isLoading }: InputSourceProps) {
  const [activeTab, setActiveTab] = useState("search");

  const handleFileSelect = (content: string) => {
    // Detecta se é um package.json
    try {
      const parsed = JSON.parse(content);
      if (parsed.dependencies || parsed.devDependencies || parsed.name) {
        onSearch("package-json", content);
      } else {
        onSearch("file-upload", content);
      }
    } catch {
      onSearch("file-upload", content);
    }
  };

  const handleBase64Submit = (content: string) => {
    onSearch("base64-input", content);
  };

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="gradient-border">
        <Card className="shadow-xl bg-card border-0 m-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Security Analysis
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Choose your analysis method below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="base64">Paste Data</TabsTrigger>
                <TabsTrigger value="package">Package.json</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="mt-6">
                <SearchForm onSearch={onSearch} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="upload" className="space-y-4 mt-6">
                <p className="text-sm text-muted-foreground text-center">
                  Upload a leaked data JSON file to analyze its contents
                </p>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  disabled={isLoading}
                />
              </TabsContent>

              <TabsContent value="base64" className="space-y-4 mt-6">
                <p className="text-sm text-muted-foreground text-center">
                  Paste base64 encoded leaked data to decode and analyze
                </p>
                <Base64Input
                  onBase64Submit={handleBase64Submit}
                  disabled={isLoading}
                />
              </TabsContent>

              <TabsContent value="package" className="space-y-4 mt-6">
                <p className="text-sm text-muted-foreground text-center">
                  Upload your package.json content to check for infected
                  dependencies
                </p>
                <FileUpload
                  onFileSelect={(content) => onSearch("package-json", content)}
                  disabled={isLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
