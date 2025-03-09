"use client";

import { useState, useEffect } from "react";
import { FiInfo, FiCheck, FiCopy, FiDownload, FiTwitter } from "react-icons/fi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";

interface ConvertedContentProps {
  content: string | null;
  isAuthenticated: boolean;
  isConnectedToNotion: boolean;
  showSuccess: boolean;
  onAuth: () => void;
}

export function ConvertedContent({
  content,
  isAuthenticated,
  // isConnectedToNotion,
  showSuccess,
  onAuth,
}: ConvertedContentProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
    }
  };

  const handleDownload = () => {
    if (!content) return;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notion-converted.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border rounded-lg h-[calc(100vh-160px)] flex flex-col overflow-hidden">
      <div className="border-b px-4 py-3 bg-card">
        <h2 className="font-medium">Converted content will appear here</h2>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full w-full">
          <div className="p-4">
            {content ? (
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {content}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-8 py-6">
                {!isAuthenticated && (
                  <Card className="w-full bg-blue-500/10 border-blue-500/20 max-w-lg mx-auto">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center text-blue-500 mb-4">
                        <FiInfo className="h-8 w-8" />
                      </div>
                      <p className="text-center mb-4">
                        Sign up/Login to directly connect to your Notion
                        workspace for a seamless experience
                      </p>
                      <Button onClick={onAuth} className="w-full">
                        Sign in
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="max-w-lg mx-auto w-full">
                  <h3 className="font-medium text-xl text-center mb-4">
                    Steps on how to use the tool
                  </h3>
                  <ol className="space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-medium">1.</span>
                      <span>Connect to your Notion workspace</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-medium">2.</span>
                      <span>
                        Select a page from the dropdown or enter a page ID
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-medium">3.</span>
                      <span>Choose your desired output format</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-medium">4.</span>
                      <span>
                        Click &quot;Convert&quot; to generate your content
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-medium">5.</span>
                      <span>
                        Download, copy, or share your converted content
                      </span>
                    </li>
                  </ol>
                </div>

                <Card className="w-full max-w-lg mx-auto">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Why use our Notion Converter?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <FiCheck className="mt-1 mr-3 h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>
                          Clean, semantic conversion that preserves structure
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="mt-1 mr-3 h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>
                          Multiple output formats including MDX, HTML, and JSX
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="mt-1 mr-3 h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>
                          Fast, secure, and privacy-focused processing
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Success message overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 z-10"
            >
              <Alert className="bg-green-500/10 border-green-500/20 text-green-500">
                <div className="flex items-center">
                  <FiCheck className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Successfully connected to Notion!
                  </AlertDescription>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {content && (
        <div className="border-t p-3 flex justify-end space-x-2 bg-card">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <FiCopy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <FiDownload className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <FiTwitter className="mr-2 h-4 w-4" />
            Tweet
          </Button>
        </div>
      )}
    </div>
  );
}
