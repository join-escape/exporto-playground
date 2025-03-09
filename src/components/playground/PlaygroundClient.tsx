"use client";

import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { RiQuestionLine } from "react-icons/ri";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { AuthModal } from "@/components/auth/AuthModal";
import { ConnectWorkspace } from "@/components/notion/ConnectWorkspace";
import { ConversionForm } from "@/components/conversion/ConversionForm";
import { ConvertedContent } from "@/components/conversion/ConvertedContent";
import { useAuth } from "@/providers/AuthProvider";
import { NotionConnectionStatus, NotionPage, OutputFormat } from "@/types";

// Simulated page data for demonstration
const samplePages: NotionPage[] = [
  { id: "page1", title: "Getting Started Guide" },
  { id: "page2", title: "Project Roadmap" },
  { id: "page3", title: "Meeting Notes" },
  { id: "page4", title: "Product Requirements" },
  { id: "page5", title: "Weekly Updates" },
  { id: "page6", title: "Design System" },
];

// Simulated conversion output
const sampleOutput = `
# Getting Started Guide

## Introduction

Welcome to our product! This guide will help you get started quickly.

## Installation

\`\`\`bash
npm install @company/product
\`\`\`

## Basic Usage

\`\`\`javascript
import { initialize } from '@company/product';

initialize({
  apiKey: 'your-api-key',
  environment: 'production'
});
\`\`\`

## Features

- **Feature 1**: Description of feature 1
- **Feature 2**: Description of feature 2
- **Feature 3**: Description of feature 3

## Next Steps

Check out our [documentation](https://example.com/docs) for more information.
`;

export default function PlaygroundClient() {
  const { user } = useAuth();

  // State management
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<NotionConnectionStatus>({
      isConnected: false,
    });
  const [selectedPageId, setSelectedPageId] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("markdown");
  const [convertedContent, setConvertedContent] = useState<string | null>(null);
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset state when user changes
  useEffect(() => {
    if (!user) {
      setConnectionStatus({ isConnected: false });
      setSelectedPageId("");
      setConvertedContent(null);
    }
  }, [user]);

  // Handle Notion workspace connection
  const connectNotion = (integrationKey?: string) => {
    setConnectionStatus({
      isConnected: true,
      workspace: {
        id: "workspace_1",
        name: "ABCD Workspace",
      },
    });
    console.log({ integrationKey });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Handle disconnecting from Notion
  const disconnectNotion = () => {
    setConnectionStatus({ isConnected: false });
    setSelectedPageId("");
    setConvertedContent(null);
  };

  // Handle conversion
  const handleConvert = () => {
    if (selectedPageId) {
      setIsConverting(true);
      // Simulate conversion process
      setTimeout(() => {
        setConvertedContent(sampleOutput);
        setIsConverting(false);
      }, 800);
    }
  };

  return (
    <div className="bg-background">
      {/* Header */}
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration and Controls */}
          <div className="space-y-6">
            {/* Configuration Section */}
            <Collapsible
              open={!isConfigCollapsed}
              onOpenChange={(open) => setIsConfigCollapsed(!open)}
              className="border rounded-lg"
            >
              <div className="px-4 py-3 flex justify-between items-center border-b">
                <div className="flex items-center">
                  <h2 className="text-lg font-medium">Configuration</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-6 w-6 cursor-pointer"
                        >
                          <RiQuestionLine className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Connect to your Notion workspace to access and convert
                          your pages
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    {isConfigCollapsed ? "Expand" : "Collapse"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="p-4 space-y-4">
                  <ConnectWorkspace
                    isAuthenticated={!!user}
                    connectionStatus={connectionStatus}
                    onConnect={connectNotion}
                    onDisconnect={disconnectNotion}
                    onAuthRequest={() => setAuthModalOpen(true)}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Convert Section */}
            <ConversionForm
              isConnected={connectionStatus.isConnected}
              pages={samplePages}
              selectedPageId={selectedPageId}
              selectedFormat={outputFormat}
              isConverting={isConverting}
              onSelectPage={setSelectedPageId}
              onSelectFormat={setOutputFormat}
              onConvert={handleConvert}
            />
          </div>

          {/* Right Column - Conversion Output */}
          <ConvertedContent
            content={convertedContent}
            isAuthenticated={!!user}
            isConnectedToNotion={connectionStatus.isConnected}
            showSuccess={showSuccess}
            onAuth={() => setAuthModalOpen(true)}
          />
        </div>
      </main>

      {/* Authentication Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
