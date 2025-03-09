"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiQuestionLine } from "react-icons/ri";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OutputFormat } from "@/types";

interface OutputSelectorProps {
  disabled: boolean;
  selectedFormat: OutputFormat;
  onSelectFormat: (format: OutputFormat) => void;
}

export function OutputSelector({
  disabled,
  selectedFormat,
  onSelectFormat,
}: OutputSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="output-format">Convert to</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1 h-6 w-6">
                <RiQuestionLine className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Choose the output format for your converted content
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select
        disabled={disabled}
        value={selectedFormat}
        onValueChange={(value) => onSelectFormat(value as OutputFormat)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="markdown">Markdown (.md)</SelectItem>
          <SelectItem value="mdx">MDX (.mdx)</SelectItem>
          <SelectItem value="html">HTML (.html)</SelectItem>
          <SelectItem value="jsx">JSX (.jsx)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
