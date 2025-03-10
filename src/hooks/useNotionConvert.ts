import { useState } from "react";
import { toast } from "sonner";
import { notionApiService } from "@/lib/api/notion";
import { OutputFormat } from "@/types";

interface UseNotionConverterProps {
  isConnected: boolean;
  localIntegrationKey?: string;
}

/**
 * Hook for managing Notion page conversions
 */
export function useNotionConverter({
  isConnected,
  localIntegrationKey,
}: UseNotionConverterProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [convertedContent, setConvertedContent] = useState<string | null>(null);

  // Convert a Notion page
  const convertPage = async (
    pageId: string,
    format: OutputFormat,
  ): Promise<boolean> => {
    if (!isConnected || !pageId) {
      return false;
    }

    setIsConverting(true);
    setConvertedContent(null);

    try {
      // Pass integration key for unauthenticated users
      const content = await notionApiService.convertPage(
        pageId,
        format,
        localIntegrationKey,
      );
      setConvertedContent(content);
      return true;
    } catch (error) {
      let errorMessage = "Failed to convert Notion page";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      return false;
    } finally {
      setIsConverting(false);
    }
  };

  return {
    isConverting,
    convertedContent,
    convertPage,
    setConvertedContent,
  };
}
