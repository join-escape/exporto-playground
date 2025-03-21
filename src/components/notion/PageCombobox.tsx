"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotionPage } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "@/components/ui/label";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { RiQuestionLine } from "react-icons/ri";
import { FiCheck, FiChevronsUp, FiLoader } from "react-icons/fi";

interface PageComboboxProps {
  disabled: boolean;
  selectedPageId: string;
  onSelectPage: (pageId: string) => void;
  loadPages: (query: string) => Promise<NotionPage[]>;
  isLoading: boolean;
}

export function PageCombobox({
  disabled,
  selectedPageId,
  onSelectPage,
  loadPages,
  isLoading: externalLoading,
}: PageComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [pages, setPages] = React.useState<NotionPage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const debouncedSearchTerm = useDebounce(inputValue, 500);
  const [selectedPage, setSelectedPage] = React.useState<NotionPage | null>(
    null,
  );
  const initialFetchRef = React.useRef(false);
  const previousSearchRef = React.useRef("");

  // Combine external loading state with internal loading state
  const isLoading = loading || externalLoading;

  // Load pages when the search term changes or when opened
  React.useEffect(() => {
    if (!open || disabled) return;

    const fetchPages = async () => {
      setLoading(true);
      try {
        const results = await loadPages(debouncedSearchTerm);
        setPages(results);
        previousSearchRef.current = debouncedSearchTerm;
      } catch (error) {
        console.error("Failed to load pages:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch in two cases:
    // 1. When dropdown is opened and we haven't done initial fetch
    // 2. When search term changes (and it's different from previous)
    if (!initialFetchRef.current) {
      fetchPages();
      initialFetchRef.current = true;
    } else if (debouncedSearchTerm !== previousSearchRef.current) {
      fetchPages();
    }
  }, [debouncedSearchTerm, open, disabled, loadPages]);

  // Reset states when dropdown closes
  React.useEffect(() => {
    if (!open) {
      initialFetchRef.current = false;
      previousSearchRef.current = "";
      setInputValue("");
      setPages([]);
    }
  }, [open]);

  // Update selected page when selectedPageId changes
  React.useEffect(() => {
    if (selectedPageId && pages.length > 0) {
      const page = pages.find((p) => p.id === selectedPageId);
      if (page) {
        setSelectedPage(page);
      }
    } else if (!selectedPageId) {
      setSelectedPage(null);
    }
  }, [selectedPageId, pages]);

  // Handle direct page ID input
  const handleDirectInput = (value: string) => {
    setInputValue(value);
    // If the input looks like a Notion page ID (32 chars with dashes)
    // or it matches UUID format but is not in our list, treat it as a direct ID
    if (
      (value.length > 30 && value.includes("-")) ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value,
      )
    ) {
      onSelectPage(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="page-selector">Select page or enter page ID</Label>
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
                Search for a page from your workspace or paste a page ID
                directly
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between"
          >
            {selectedPage ? (
              <span className="text-left truncate">{selectedPage.title}</span>
            ) : (
              <span className="text-muted-foreground">
                {inputValue || "Select a page or enter ID"}
              </span>
            )}
            {isLoading ? (
              <FiLoader className="ml-2 h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <FiChevronsUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search for a page or enter ID..."
              onValueChange={handleDirectInput}
              value={inputValue}
              disabled={isLoading}
            />
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <FiLoader className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading && (
              <CommandList>
                <CommandEmpty>
                  No pages found. You can use a page ID directly.
                </CommandEmpty>
                <CommandGroup>
                  {pages.map((page) => (
                    <CommandItem
                      key={page.id}
                      value={page.id}
                      onSelect={() => {
                        onSelectPage(page.id);
                        setSelectedPage(page);
                        setOpen(false);
                      }}
                    >
                      <FiCheck
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedPageId === page.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="truncate flex-1">
                        {page.title || "Untitled"}
                      </span>
                      {page.icon && <span className="ml-2">{page.icon}</span>}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
