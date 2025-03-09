"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageSelector } from "@/components/notion/PageSelector";
import { OutputSelector } from "./OutputSelector";
import { RiQuestionLine } from "react-icons/ri";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NotionPage, OutputFormat } from "@/types";

interface ConversionFormProps {
  isConnected: boolean;
  pages: NotionPage[];
  selectedPageId: string;
  selectedFormat: OutputFormat;
  isConverting: boolean;
  onSelectPage: (pageId: string) => void;
  onSelectFormat: (format: OutputFormat) => void;
  onConvert: () => void;
}

export function ConversionForm({
  isConnected,
  pages,
  selectedPageId,
  selectedFormat,
  isConverting,
  onSelectPage,
  onSelectFormat,
  onConvert,
}: ConversionFormProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <CardTitle className="text-lg">Convert</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1 h-6 w-6">
                  <RiQuestionLine className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Select a page from your Notion workspace and convert it to
                  your desired format
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <PageSelector
          disabled={!isConnected}
          pages={pages}
          selectedPageId={selectedPageId}
          onSelectPage={onSelectPage}
        />
        <OutputSelector
          disabled={!isConnected}
          selectedFormat={selectedFormat}
          onSelectFormat={onSelectFormat}
        />
        <Button
          className="w-full"
          disabled={!isConnected || !selectedPageId}
          onClick={onConvert}
        >
          {isConverting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Converting...
            </span>
          ) : (
            "Convert →"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
