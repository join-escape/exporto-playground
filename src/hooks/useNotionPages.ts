import { useState } from "react";
import { toast } from "sonner";
import { notionApiService } from "@/lib/api/notion";
import { NotionPage } from "@/types";

interface UseNotionPagesProps {
  isConnected: boolean;
  localIntegrationKey?: string;
}

/**
 * Hook for managing Notion pages
 */
export function useNotionPages({
  isConnected,
  localIntegrationKey,
}: UseNotionPagesProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Search for Notion pages
  const searchPages = async (query: string): Promise<NotionPage[]> => {
    if (!isConnected) {
      return [];
    }

    setIsLoading(true);
    try {
      // Pass integration key for unauthenticated users
      const pages = await notionApiService.searchPages(
        query,
        localIntegrationKey,
      );
      return pages;
    } catch (error) {
      let errorMessage = "Failed to search Notion pages";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    searchPages,
  };
}
