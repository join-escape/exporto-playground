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
import { FiLoader } from "react-icons/fi";

interface ConversionFormProps {
  isConnected: boolean;
  selectedPageId: string;
  selectedFormat: OutputFormat;
  isConverting: boolean;
  onSelectPage: (pageId: string) => void;
  onSelectFormat: (format: OutputFormat) => void;
  onConvert: () => void;
  loadPages: (query: string) => Promise<NotionPage[]>;
  isLoading: boolean;
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
  isLoading,
}: ConversionFormProps) {
  return (
    <div className="space-y-4">
      <PageCombobox
        disabled={!isConnected || isConverting}
        selectedPageId={selectedPageId}
        onSelectPage={onSelectPage}
        loadPages={loadPages}
        isLoading={isLoading}
      />
      <OutputSelector
        disabled={!isConnected || isConverting}
        selectedFormat={selectedFormat}
        onSelectFormat={onSelectFormat}
      />
      <Button
        className="w-full cursor-pointer"
        disabled={!isConnected || !selectedPageId || isConverting}
        onClick={onConvert}
      >
        {isConverting ? (
          <span className="flex items-center gap-2">
            <FiLoader className="animate-spin h-4 w-4" />
            Converting...
          </span>
        ) : (
          "Convert →"
        )}
      </Button>
    </div>
  );
}
