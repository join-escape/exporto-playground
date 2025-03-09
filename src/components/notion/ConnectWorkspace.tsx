"use client";

import { useState } from "react";
import { SiNotion } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { IntegrationKeyInput } from "./IntegrationKeyInput";
import { NotionConnectionStatus } from "@/types";

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
              onClick={() => (isAuthenticated ? onConnect() : onAuthRequest())}
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
            onVerify={() => onConnect(integrationKey)}
            onAuthRequest={onAuthRequest}
          />
        </>
      )}
    </div>
  );
}
