"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SiNotion } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IntegrationKeyInput } from "./IntegrationKeyInput";
import { NotionConnectionStatus } from "@/types";
import { FiInfo, FiLoader } from "react-icons/fi";

interface ConnectWorkspaceProps {
  isAuthenticated: boolean;
  connectionStatus: NotionConnectionStatus;
  onConnect: (integrationKey?: string) => void;
  onConnectOAuth: () => void;
  onDisconnect: () => void;
  onAuthRequest: () => void;
  isConnecting: boolean;
  isDisconnecting: boolean;
}

export function ConnectWorkspace({
  isAuthenticated,
  connectionStatus,
  onConnect,
  onConnectOAuth,
  onDisconnect,
  onAuthRequest,
  isConnecting,
  isDisconnecting,
}: ConnectWorkspaceProps) {
  const [integrationKey, setIntegrationKey] = useState("");

  const handleConnect = () => {
    if (isAuthenticated) {
      // If authenticated, initiate OAuth flow
      onConnectOAuth();
    } else {
      // If not authenticated, prompt to sign in
      onAuthRequest();
    }
  };

  const handleVerify = () => {
    if (!integrationKey || integrationKey.trim().length === 0) {
      toast.error("Please enter a valid integration key");
      return;
    }

    if (!integrationKey.startsWith("secret_")) {
      toast.error("Notion integration keys should start with 'secret_'");
      return;
    }

    onConnect(integrationKey);
  };

  return (
    <div className="space-y-4">
      {connectionStatus.isConnected ? (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {connectionStatus.workspace?.name ? (
              <>
                Connected to{" "}
                <span className="font-medium text-foreground">
                  {connectionStatus.workspace.name}
                </span>{" "}
                workspace
              </>
            ) : (
              <span className="font-medium text-foreground">
                Connected via Integration Key
              </span>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? (
              <FiLoader className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Disconnect
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-1">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <SiNotion className="h-4 w-4" />
              )}
              <span>
                {isAuthenticated
                  ? "Connect with Notion"
                  : "Sign in to Connect with Notion"}
              </span>
            </Button>
            <div className="text-center text-sm text-muted-foreground my-2">
              or
            </div>
          </div>
          <IntegrationKeyInput
            value={integrationKey}
            onChange={setIntegrationKey}
            onVerify={handleVerify}
            onAuthRequest={onAuthRequest}
            isLoading={isConnecting}
          />
        </>
      )}
      <Alert className="bg-primary/5 border-primary/20 text-primary flex justify-between items-center">
        <AlertDescription className="flex justify-between items-center">
          <FiInfo className="h-4 w-4 mr-2" />
          <span>
            Make sure that the integration has access to the target pages
          </span>
        </AlertDescription>
      </Alert>
    </div>
  );
}
