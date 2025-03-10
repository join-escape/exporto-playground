import { useState, useEffect } from "react";
import { toast } from "sonner";
import { notionApiService } from "@/lib/api/notion";
import { NotionConnectionStatus } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { useSearchParams } from "next/navigation";

/**
 * Hook for managing Notion connection state
 */
export function useNotionConnection() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [connectionStatus, setConnectionStatus] =
    useState<NotionConnectionStatus>({
      isConnected: false,
    });
  const [localIntegrationKey, setLocalIntegrationKey] = useState<string>("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Check connection status when authenticated user changes
  useEffect(() => {
    if (user) {
      checkConnectionStatus();
    } else {
      // Reset connection status when logged out
      setConnectionStatus({ isConnected: false });
    }
  }, [user]);

  // Handle OAuth success parameters in URL
  useEffect(() => {
    const success = searchParams.get("success");
    const workspace = searchParams.get("workspace");

    if (success === "notion-connected" && workspace) {
      // Update local state to reflect the new connection
      setConnectionStatus({
        isConnected: true,
        workspace: {
          id: "oauth-connected",
          name: decodeURIComponent(workspace),
        },
      });
    }
  }, [searchParams]);

  // Check if user is connected to Notion
  const checkConnectionStatus = async () => {
    if (!user) return;

    setIsCheckingStatus(true);
    try {
      const status = await notionApiService.getConnectionStatus();
      setConnectionStatus(status);
    } catch (error) {
      console.error("Error checking Notion connection status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Connect to Notion with OAuth (only for authenticated users)
  const connectWithOAuth = async () => {
    if (!user) {
      toast.error("You must be signed in to connect with OAuth");
      return false;
    }

    setIsConnecting(true);
    try {
      const authUrl = await notionApiService.initiateOAuth();
      window.location.href = authUrl;
      return true;
    } catch (error) {
      let errorMessage = "Failed to connect to Notion";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect to Notion with integration key
  const connectWithKey = async (key: string) => {
    setIsConnecting(true);
    try {
      const status = await notionApiService.connectWithKey(key);

      if (user) {
        setConnectionStatus(status);
        setLocalIntegrationKey("");
      } else {
        setConnectionStatus(status);
        setLocalIntegrationKey(key);
      }

      return true;
    } catch (error) {
      let errorMessage = "Failed to connect to Notion";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from Notion
  const disconnect = async () => {
    setIsDisconnecting(true);
    try {
      if (user) {
        await notionApiService.disconnect();
      }
      setConnectionStatus({ isConnected: false });
      setLocalIntegrationKey("");
      return true;
    } catch (error) {
      toast.error("Failed to disconnect from Notion");
      return false;
    } finally {
      setIsDisconnecting(false);
    }
  };

  return {
    connectionStatus,
    isCheckingStatus,
    isConnecting,
    isDisconnecting,
    localIntegrationKey,
    connectWithKey,
    connectWithOAuth,
    disconnect,
    checkConnectionStatus,
  };
}
