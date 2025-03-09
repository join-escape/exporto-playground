import { Metadata } from "next";
import dynamic from "next/dynamic";

import { SEOContent } from "@/components/seo/SeoContent";

// Dynamically import client components
const PlaygroundClient = dynamic(
  () => import("@/components/playground/PlaygroundClient"),
  { ssr: true }, // Still render the HTML on the server for SEO, hydrate on client
);

// Generate metadata for the page
export const metadata: Metadata = {
  title: "Notion Convert Playground - Convert Notion Pages to Any Format",
  description:
    "Free online tool to convert Notion pages to Markdown, MDX, HTML, and JSX formats. Preserve formatting, structure, and content with our easy-to-use converter.",
  keywords:
    "notion converter, notion to markdown, notion to anything, notion to blog, notion to jsx, notion export, notion integration",
  openGraph: {
    title: "Notion Convert Playground",
    description:
      "Convert/Export your Notion pages to Markdown, HTML, JSX or any format in a click",
    type: "website",
    url: "https://notionconvert.com/playground",
    images: [
      {
        url: "https://notionconvert.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Notion Convert Playground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notion Converter Playground",
    description:
      "Convert your Notion pages to Markdown, MDX, HTML, and JSX with perfect formatting",
    images: ["https://notionconvert.com/images/og-image.png"],
  },
};

// This is a Server Component
export default function PlaygroundPage() {
  return (
    <>
      {/* Client component for interactive functionality */}
      <PlaygroundClient />

      {/* SEO-optimized content section (only shown to unauthenticated users) */}
      <SEOContent />

      {/* JSON-LD structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Notion Converter Playground",
            applicationCategory: "WebApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            description:
              "Convert your Notion pages to Markdown, MDX, HTML, and JSX with perfect formatting and structure preservation.",
          }),
        }}
      />
    </>
  );
}
