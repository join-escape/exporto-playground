"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FiInfo,
  FiCheck,
  FiCopy,
  FiDownload,
  FiTwitter,
  FiGithub,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CaseSensitive, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  isConnectedToNotion,
  showSuccess,
  onAuth,
}: ConvertedContentProps) {
  const [copied, setCopied] = useState(false);
  const [wrapText, setWrapText] = useState(true);

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
      toast.success("Content copied to clipboard");
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

    toast.success("Content downloaded", {
      description: "Saved as notion-converted.md",
    });
  };

  return (
    <div className="border rounded-lg h-[calc(100vh-160px)] flex flex-col overflow-hidden">
      <div className="border-b px-4 py-3 bg-card flex items-center justify-between">
        <h2 className="font-medium">Output</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="wrap-text"
              checked={wrapText}
              onCheckedChange={() => setWrapText(!wrapText)}
            />
            <Label htmlFor="wrap-text" className="text-sm cursor-pointer">
              Wrap text
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              asChild
            >
              <Link
                href="https://github.com/souvikinator/notion-to-md/issues/new?title=[Bug] Summarize the issue"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Report a Bug
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              asChild
            >
              <Link
                href="https://github.com/souvikinator/notion-to-md/issues/new?title=[Feature%20Request] Summarize the feature"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Request a Feature
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {content ? (
          <div
            className="h-full w-full overflow-auto"
            style={{
              maxHeight: "calc(100vh - 240px)",
            }}
          >
            <pre
              className={`text-sm font-mono p-4 ${
                wrapText ? "whitespace-pre-wrap break-words" : "whitespace-pre"
              }`}
            >
              {content}
            </pre>
          </div>
        ) : (
          <div className="p-4 h-full overflow-auto">
            <div className="flex flex-col items-center justify-center space-y-4 py-4 mx-4">
              {/* 1. Powered by notion-to-md section */}
              <Alert className="bg-primary/5 border-primary/20 text-primary flex justify-between items-center">
                <AlertDescription className="flex justify-between items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Powered by <strong>notion-to-md</strong>
                  </span>
                  <Badge variant="outline" className="text-sm">
                    v4
                  </Badge>
                </AlertDescription>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  asChild
                >
                  <Link
                    href="https://github.com/souvikinator/notion-to-md"
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    <FiGithub className="h-3.5 w-3.5" />
                    View on GitHub
                  </Link>
                </Button>
              </Alert>

              {/* 2. Sign up prompt - only if not authenticated */}
              {!isAuthenticated && !isConnectedToNotion && (
                <Alert className="bg-primary/5 border-primary/20 text-primary flex justify-between items-center">
                  <AlertDescription className="flex justify-between items-center">
                    <FiInfo className="h-4 w-4 mr-2" />
                    <span>
                      Sign in for a seamless Notion connection experience
                    </span>
                  </AlertDescription>
                  <Button size="sm" onClick={onAuth} className="h-8 ml-2">
                    Sign in
                  </Button>
                </Alert>
              )}

              {/* 3. Features list - compact */}
              <div className="w-full py-3">
                <h3 className="text-base font-medium mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <FiCheck className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Preserves structure & formatting
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheck className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Multiple export formats
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheck className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Handles complex tables & blocks
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheck className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Privacy focused & fast processing
                    </span>
                  </div>
                </div>
              </div>

              {/* Placeholder illustration */}
              <div className="w-full flex items-center justify-center p-6">
                <div className="border border-dashed border-muted-foreground/30 rounded-lg p-8 text-center flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <CaseSensitive />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Your converted content will appear here
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Scroll down for detailed instructions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
