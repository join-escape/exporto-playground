"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SiNotion } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IntegrationKeyInput } from "./IntegrationKeyInput";
import { NotionConnectionStatus } from "@/types";
import { FiInfo } from "react-icons/fi";

interface ConnectWorkspaceProps {
  isAuthenticated: boolean;
  connectionStatus: NotionConnectionStatus;
  onConnect: (integrationKey?: string) => void;
  onDisconnect: () => void;
  onAuthRequest: () => void;
}

export function ConnectWorkspace({
  isAuthenticated,
  connectionStatus,
  onConnect,
  onDisconnect,
  onAuthRequest,
}: ConnectWorkspaceProps) {
  const [integrationKey, setIntegrationKey] = useState("");

  const handleConnect = () => {
    if (isAuthenticated) {
      onConnect();
    } else {
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
            Connected to{" "}
            <span className="font-medium text-foreground">
              {connectionStatus.workspace?.name || "Notion Workspace"}
            </span>
          </div>
          <Button variant="destructive" size="sm" onClick={onDisconnect}>
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
            >
              <SiNotion className="h-4 w-4" />
              <span>Connect Notion Workspace</span>
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
