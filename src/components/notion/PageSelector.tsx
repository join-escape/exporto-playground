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
import { NotionPage } from "@/types";

interface PageSelectorProps {
  disabled: boolean;
  pages: NotionPage[];
  selectedPageId: string;
  onSelectPage: (pageId: string) => void;
}

export function PageSelector({
  disabled,
  pages,
  selectedPageId,
  onSelectPage,
}: PageSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="page-selector">Select page or enter page ID</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1 h-6 w-6">
                <RiQuestionLine className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Select from your accessible pages or paste a page ID directly
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select
        disabled={disabled}
        value={selectedPageId}
        onValueChange={onSelectPage}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a page" />
        </SelectTrigger>
        <SelectContent>
          {pages.map((page) => (
            <SelectItem key={page.id} value={page.id}>
              {page.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
