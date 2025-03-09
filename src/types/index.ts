export interface NotionPage {
  id: string;
  title: string;
  lastEdited?: string;
  icon?: string;
}

export interface NotionWorkspace {
  id: string;
  name: string;
  icon?: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  provider?: "github" | "google";
}

export type OutputFormat = "markdown" | "mdx" | "html" | "jsx";

export interface ConversionResult {
  content: string;
  format: OutputFormat;
  metadata: {
    title: string;
    pageId: string;
    convertedAt: string;
  };
}

export interface NotionConnectionStatus {
  isConnected: boolean;
  workspace?: NotionWorkspace;
  error?: string;
}

export type AuthProvider = "github" | "google";

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "dark" | "light" | "system";
}
