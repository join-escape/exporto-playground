import { NotionConnectionStatus, NotionPage, OutputFormat } from "@/types";

/**
 * Service for communicating with the Notion API endpoints
 */
export const notionApiService = {
  /**
   * Initiate OAuth flow with Notion
   * @returns URL to redirect to for OAuth
   */
  async initiateOAuth(): Promise<string> {
    try {
      const response = await fetch("/api/notion/oauth");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to initiate OAuth");
      }

      const data = await response.json();
      return data.authUrl;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to initiate OAuth: ${error.message}`);
      }
      throw new Error("Failed to initiate OAuth");
    }
  },

  /**
   * Connect to Notion using an integration key
   * @param integrationKey The Notion integration key
   * @returns Connection status
   */
  async connectWithKey(
    integrationKey: string,
  ): Promise<NotionConnectionStatus> {
    try {
      const response = await fetch("/api/notion/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ integrationKey }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to connect to Notion");
      }

      const data = await response.json();
      return {
        isConnected: true,
        workspace: {
          id: data.workspaceId,
          name: data.workspaceName,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to connect to Notion: ${error.message}`);
      }
      throw new Error("Failed to connect to Notion");
    }
  },

  /**
   * Get the connection status for the current user
   * @returns Connection status
   */
  async getConnectionStatus(): Promise<NotionConnectionStatus> {
    try {
      const response = await fetch("/api/notion/status");

      if (!response.ok) {
        return { isConnected: false };
      }

      return await response.json();
    } catch (error) {
      // Default to not connected on error
      return { isConnected: false };
    }
  },

  /**
   * Disconnect from Notion
   */
  async disconnect(): Promise<void> {
    await fetch("/api/notion/disconnect", {
      method: "POST",
    });
  },

  /**
   * Search for Notion pages
   * @param query Search query
   * @param integrationKey Optional integration key for unauthenticated users
   * @returns List of matching pages
   */
  async searchPages(
    query: string,
    integrationKey?: string,
  ): Promise<NotionPage[]> {
    try {
      const endpoint = `/api/notion/pages/search?query=${encodeURIComponent(query)}`;

      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Add integration key to body if provided (for unauthenticated users)
      if (integrationKey) {
        options.method = "POST";
        options.body = JSON.stringify({ integrationKey });
      }

      const response = await fetch(endpoint, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to search pages");
      }

      const data = await response.json();
      return data.pages || [];
    } catch (error) {
      console.error("Error searching pages:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to search pages: ${error.message}`);
      }
      throw new Error("Failed to search pages");
    }
  },

  /**
   * Convert a Notion page to the specified format
   * @param pageId The ID of the page to convert
   * @param format The output format
   * @param integrationKey Optional integration key for unauthenticated users
   * @returns The converted content
   */
  async convertPage(
    pageId: string,
    format: OutputFormat,
    integrationKey?: string,
  ): Promise<string> {
    try {
      const response = await fetch("/api/notion/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId,
          format,
          ...(integrationKey && { integrationKey }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to convert page");
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error("Error converting page:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to convert page: ${error.message}`);
      }
      throw new Error("Failed to convert page");
    }
  },
};
