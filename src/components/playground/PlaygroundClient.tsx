"use client";

import { useState, useEffect, useRef } from "react";
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
import { OutputFormat } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useNotionConnection } from "@/hooks/useNotionConnection";
import { useNotionPages } from "@/hooks/useNotionPages";
import { useNotionConverter } from "@/hooks/useNotionConvert";

export default function PlaygroundClient() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State management
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("markdown");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState<string>("step-1");
  const isInitialMount = useRef(true);

  // Custom hooks for Notion integration
  const {
    connectionStatus,
    isCheckingStatus,
    isConnecting,
    isDisconnecting,
    localIntegrationKey,
    connectWithKey,
    connectWithOAuth,
    disconnect,
    checkConnectionStatus,
  } = useNotionConnection();

  const { isLoading: isPagesLoading, searchPages } = useNotionPages({
    isConnected: connectionStatus.isConnected,
    localIntegrationKey,
  });

  const { isConverting, convertedContent, convertPage, setConvertedContent } =
    useNotionConverter({
      isConnected: connectionStatus.isConnected,
      localIntegrationKey,
    });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const success = searchParams.get("success");
      const workspace = searchParams.get("workspace");

      if (success === "notion-connected" && workspace) {
        toast.success("Connected to Notion workspace", {
          description: `Successfully connected to ${decodeURIComponent(workspace)}`,
        });

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setActiveStep("step-2");

        // Clean up URL
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("success");
        newSearchParams.delete("workspace");
        const newPathname = newSearchParams.toString()
          ? `/playground?${newSearchParams.toString()}`
          : "/playground";
        router.replace(newPathname);
      }

      // Handle error toast separately
      const error = searchParams.get("error");
      if (error) {
        toast.error("Error", {
          description: decodeURIComponent(error),
          duration: 5000,
        });

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("error");
        const newPathname = newSearchParams.toString()
          ? `/playground?${newSearchParams.toString()}`
          : "/playground";
        router.replace(newPathname);
      }
    }
  }, [searchParams, isMounted, router]);

  useEffect(() => {
    if (user && isInitialMount.current) {
      checkConnectionStatus();
      isInitialMount.current = false;
    }
  }, [user, checkConnectionStatus]);

  // Reset state when user changes
  useEffect(() => {
    if (!user) {
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

  // Handle Notion workspace connection with OAuth
  const handleConnectOAuth = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    try {
      await connectWithOAuth();
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Failed to initiate Notion connection");
    }
  };

  // Handle Notion workspace connection with integration key
  const handleConnectNotion = async (integrationKey?: string) => {
    if (!integrationKey) return;

    const success = await connectWithKey(integrationKey);

    if (success) {
      toast.success("Connected to Notion workspace", {
        description: "Your workspace is now connected",
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Auto transition to step 2
      setActiveStep("step-2");
    }
  };

  // Handle disconnecting from Notion
  const handleDisconnectNotion = async () => {
    const success = await disconnect();

    if (success) {
      setSelectedPageId("");
      toast.info("Notion workspace disconnected");
      // Go back to step 1
      setActiveStep("step-1");
    }
  };

  // Handle conversion
  const handleConvert = async () => {
    if (selectedPageId && connectionStatus.isConnected) {
      const success = await convertPage(selectedPageId, outputFormat);

      if (success) {
        toast.success("Conversion Complete", {
          description: "Your page has been successfully converted",
        });
      }
    }
  };

  // Load pages from Notion API
  const loadPagesFromAPI = async (query: string) => {
    return await searchPages(query);
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
                        onConnect={handleConnectNotion}
                        onConnectOAuth={handleConnectOAuth}
                        onDisconnect={handleDisconnectNotion}
                        onAuthRequest={() => setAuthModalOpen(true)}
                        isConnecting={isConnecting}
                        isDisconnecting={isDisconnecting}
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
                        isLoading={isPagesLoading}
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
