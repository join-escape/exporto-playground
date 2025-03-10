"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RiQuestionLine, RiCheckLine } from "react-icons/ri";
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

// Simulated page data for demonstration - will come from API in real implementation
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
  const [isConverting, setIsConverting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState<string>("step-1");

  // Reset state when user changes
  useEffect(() => {
    if (!user) {
      setConnectionStatus({ isConnected: false });
      setSelectedPageId("");
      setConvertedContent(null);
      setActiveStep("step-1");
    }
  }, [user]);

  // When connection status changes, update the active step
  useEffect(() => {
    if (connectionStatus.isConnected) {
      setActiveStep("step-2");
    } else {
      setActiveStep("step-1");
    }
  }, [connectionStatus.isConnected]);

  // Handle Notion workspace connection
  const connectNotion = (integrationKey?: string) => {
    setConnectionStatus({
      isConnected: true,
      workspace: {
        id: "workspace_1",
        name: "ABCD Workspace",
      },
    });

    toast.success("Connected to Notion workspace", {
      description: "Your workspace is now connected",
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    // Auto transition to step 2
    setActiveStep("step-2");
  };

  // Handle disconnecting from Notion
  const disconnectNotion = () => {
    setConnectionStatus({ isConnected: false });
    setSelectedPageId("");
    setConvertedContent(null);

    toast.info("Notion workspace disconnected");

    // Go back to step 1
    setActiveStep("step-1");
  };

  // Handle conversion
  const handleConvert = () => {
    if (selectedPageId) {
      setIsConverting(true);
      // Simulate conversion process
      setTimeout(() => {
        setConvertedContent(sampleOutput);
        setIsConverting(false);

        toast.success("Conversion Complete", {
          description: "Your page has been successfully converted",
        });
      }, 800);
    }
  };

  const loadPagesFromAPI = async (query: string): Promise<NotionPage[]> => {
    if (!connectionStatus.isConnected) return [];

    try {
      const response = await fetch(
        `/api/notion/pages/search?query=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.pages || [];
    } catch (error) {
      console.error("Failed to load pages:", error);
      toast.error("Failed to load pages from Notion");
      return [];
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-130px)]">
          {/* Left Column - Step-based Configuration and Controls */}
          <div className="space-y-6 h-full overflow-auto pb-6">
            {/* Step 1: Configuration */}
            <div className="bg-background shadow-sm rounded-lg overflow-hidden">
              <Accordion
                type="single"
                collapsible
                value={activeStep === "step-1" ? "step-1" : undefined}
                onValueChange={(value) => {
                  if (value) setActiveStep(value);
                }}
              >
                <AccordionItem value="step-1" className="border-b-0">
                  <div className="px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {connectionStatus.isConnected ? (
                          <RiCheckLine className="h-5 w-5" />
                        ) : (
                          <span>1</span>
                        )}
                      </div>
                      <AccordionTrigger className="px-0 py-0 hover:no-underline">
                        <h2 className="text-lg font-medium">
                          Connect to Notion
                        </h2>
                      </AccordionTrigger>
                    </div>

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
                            Connect to your Notion workspace to access and
                            convert your pages
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <AccordionContent className="px-6 pb-6 pt-0">
                    <div className="ml-11 space-y-4">
                      <ConnectWorkspace
                        isAuthenticated={!!user}
                        connectionStatus={connectionStatus}
                        onConnect={connectNotion}
                        onDisconnect={disconnectNotion}
                        onAuthRequest={() => setAuthModalOpen(true)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Step 2: Convert */}
            <div className="bg-background shadow-sm rounded-lg overflow-hidden">
              <Accordion
                type="single"
                collapsible
                value={activeStep === "step-2" ? "step-2" : undefined}
                onValueChange={(value) => {
                  if (value) setActiveStep(value);
                }}
              >
                <AccordionItem value="step-2" className="border-b-0">
                  <div className="px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <span>2</span>
                      </div>
                      <AccordionTrigger className="px-0 py-0 hover:no-underline">
                        <h2 className="text-lg font-medium">Convert Page</h2>
                      </AccordionTrigger>
                    </div>

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
                            Select a page and output format to convert
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <AccordionContent className="px-6 pb-6 pt-0">
                    <div className="ml-11 space-y-4">
                      <ConversionForm
                        isConnected={connectionStatus.isConnected}
                        selectedPageId={selectedPageId}
                        selectedFormat={outputFormat}
                        isConverting={isConverting}
                        onSelectPage={setSelectedPageId}
                        onSelectFormat={setOutputFormat}
                        onConvert={handleConvert}
                        loadPages={loadPagesFromAPI}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Right Column - Conversion Output */}
          <div className="h-full overflow-hidden">
            <ConvertedContent
              content={convertedContent}
              isAuthenticated={!!user}
              isConnectedToNotion={connectionStatus.isConnected}
              showSuccess={showSuccess}
              onAuth={() => setAuthModalOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Authentication Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
