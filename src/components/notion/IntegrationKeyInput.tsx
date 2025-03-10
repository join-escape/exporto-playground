"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface IntegrationKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  onVerify: () => void;
  onAuthRequest: () => void;
}

export function IntegrationKeyInput({
  value,
  onChange,
  onVerify,
  onAuthRequest,
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
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowKey(!showKey)}
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
          disabled={value.trim().length === 0}
        >
          Verify
        </Button>
      </div>
    </div>
  );
}
