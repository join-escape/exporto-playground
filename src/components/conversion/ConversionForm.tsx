"use client";

import { Button } from "@/components/ui/button";
import { PageCombobox } from "@/components/notion/PageCombobox";
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
  selectedPageId: string;
  selectedFormat: OutputFormat;
  isConverting: boolean;
  onSelectPage: (pageId: string) => void;
  onSelectFormat: (format: OutputFormat) => void;
  onConvert: () => void;
  loadPages: (query: string) => Promise<NotionPage[]>;
}

export function ConversionForm({
  isConnected,
  selectedPageId,
  selectedFormat,
  isConverting,
  onSelectPage,
  onSelectFormat,
  onConvert,
  loadPages,
}: ConversionFormProps) {
  return (
    <div className="space-y-4">
      <PageCombobox
        disabled={!isConnected}
        selectedPageId={selectedPageId}
        onSelectPage={onSelectPage}
        loadPages={loadPages}
      />
      <OutputSelector
        disabled={!isConnected}
        selectedFormat={selectedFormat}
        onSelectFormat={onSelectFormat}
      />
      <Button
        className="w-full cursor-pointer"
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
    </div>
  );
}
