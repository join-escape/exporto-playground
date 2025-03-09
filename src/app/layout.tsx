import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Notion Converter Playground - Convert Notion to Markdown, MDX, HTML & More",
  description:
    "Free online tool to convert Notion pages to Markdown, MDX, HTML, and JSX. Preserve formatting, structure, and content with our easy-to-use converter.",
  keywords:
    "notion converter, notion to markdown, notion to html, notion export, notion integration, notion api",
  openGraph: {
    title: "Notion Converter Playground",
    description: "Convert your Notion pages to Markdown, MDX, HTML, and JSX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
