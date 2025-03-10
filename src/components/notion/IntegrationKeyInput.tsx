"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

interface IntegrationKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  onVerify: () => void;
  onAuthRequest: () => void;
  isLoading: boolean;
}

export function IntegrationKeyInput({
  value,
  onChange,
  onVerify,
  onAuthRequest,
  isLoading,
}: IntegrationKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="integration-key">Notion integration key</Label>
      <div className="flex">
        <div className="relative flex-1">
          <Input
            id="integration-key"
            type={showKey ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pr-10"
            placeholder="secret_..."
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowKey(!showKey)}
            disabled={isLoading}
          >
            {showKey ? (
              <FiEyeOff className="h-4 w-4" />
            ) : (
              <FiEye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button
          className="ml-2"
          onClick={onVerify}
          disabled={value.trim().length === 0 || isLoading}
        >
          {isLoading ? (
            <FiLoader className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Verify
        </Button>
      </div>
    </div>
  );
}
