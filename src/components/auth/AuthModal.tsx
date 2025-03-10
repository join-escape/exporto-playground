"use client";

import { FiGithub } from "react-icons/fi";
import { SiGoogle } from "react-icons/si";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { AuthProvider } from "@/types";
import { useState } from "react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { login } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(
    null,
  );

  const handleLogin = async (provider: AuthProvider) => {
    setLoadingProvider(provider);
    try {
      await login(provider);
      // We'll keep the modal open in case of errors
      // The login function will handle the error toasts
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Sign in to Notion Converter
          </DialogTitle>
          <DialogDescription>
            Sign in to save your settings and connect directly to your Notion
            workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-6">
          <Button
            className="flex items-center justify-center gap-2 w-full"
            variant="outline"
            onClick={() => handleLogin("github")}
            disabled={loadingProvider !== null}
          >
            <FiGithub className="h-5 w-5" />
            <span>
              {loadingProvider === "github"
                ? "Please wait..."
                : "Continue with GitHub"}
            </span>
          </Button>
          <Button
            className="flex items-center justify-center gap-2 w-full"
            variant="outline"
            onClick={() => handleLogin("google")}
            disabled={loadingProvider !== null}
          >
            <SiGoogle className="h-5 w-5" />
            <span>
              {loadingProvider === "google"
                ? "Please wait..."
                : "Continue with Google"}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
