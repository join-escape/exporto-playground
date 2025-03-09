"use client";

import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function SEOContent() {
  const { user } = useAuth();

  // Don't show SEO content for authenticated users
  if (user) return null;

  return (
    <section className="container mx-auto px-4 py-16 space-y-16">
      {/* Introduction section */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Convert Notion Pages to Your Preferred Format
        </h1>
        <p className="text-xl text-muted-foreground">
          Our free Notion converter transforms your Notion pages into clean,
          properly formatted Markdown, MDX, HTML, or JSX while preserving all
          your content structure.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Clean, Semantic Output</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our converter maintains the semantic structure of your Notion
              pages, including headings, lists, code blocks, and more, ensuring
              your content remains well-organized.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multiple Output Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Choose from Markdown, MDX, HTML, or JSX formats to fit your
              specific needs. Whether you&apos;re building a blog,
              documentation, or a web application, we&apos;ve got you covered.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>No Account Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Get started immediately without signing up. Just provide your
              Notion integration key and start converting. Create an account for
              a more seamless experience.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preserve Rich Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We handle Notion&apos;s rich content features including tables,
              callouts, toggles, and code blocks with syntax highlighting across
              all output formats.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fast & Secure Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              All conversion happens securely on our servers. We don&apos;t
              store your Notion content or integration keys, ensuring your data
              remains private and secure.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer-Friendly</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Perfect for developers who want to use Notion as a content source
              for their websites, blogs, or documentation. Integrate with your
              existing workflow seamlessly.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it works section */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Converting your Notion content is simple and straightforward
          </p>
        </div>

        <div className="space-y-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 order-2 md:order-1">
              <h3 className="text-2xl font-semibold mb-4">
                1. Connect Your Notion Workspace
              </h3>
              <p className="text-muted-foreground mb-4">
                Either connect directly with your Notion account or provide your
                integration key. Our tool will then access your Notion pages
                securely.
              </p>
              <Link
                href="https://www.notion.so/my-integrations"
                target="_blank"
              >
                <Button variant="outline">
                  Learn how to create an integration key
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 order-1 md:order-2 bg-muted rounded-lg p-6">
              <div className="aspect-video relative bg-card rounded-md shadow-md">
                {/* Placeholder for an image */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  [Connection Interface Image]
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <div className="bg-muted rounded-lg p-6">
                <div className="aspect-video relative bg-card rounded-md shadow-md">
                  {/* Placeholder for an image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    [Page Selection Interface Image]
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">
                2. Select Your Notion Page
              </h3>
              <p className="text-muted-foreground">
                Choose from your available Notion pages using our page selector.
                You can also directly enter a Notion page ID if you prefer.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 order-2 md:order-1">
              <h3 className="text-2xl font-semibold mb-4">
                3. Choose Your Output Format
              </h3>
              <p className="text-muted-foreground mb-4">
                Select from Markdown (.md), MDX (.mdx), HTML (.html), or JSX
                (.jsx) formats based on your needs. Each format preserves your
                content structure.
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>
                    Markdown: Great for GitHub, documentation, and most CMS
                    platforms
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>
                    MDX: Perfect for Next.js, Gatsby, and other React-based
                    sites
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>HTML: Ideal for traditional websites and CMSes</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>JSX: For React applications and components</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2 bg-muted rounded-lg p-6">
              <div className="aspect-video relative bg-card rounded-md shadow-md">
                {/* Placeholder for an image */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  [Format Selection Interface Image]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Do I need a Notion account to use this tool?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Yes, you need a Notion account to create content that you want
                to convert. You&apos;ll also need to create an integration in
                your Notion account to generate an integration key or sign in
                directly through our tool.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Is this tool free to use?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Yes, our Notion converter is completely free to use. There are
                no hidden fees or subscription costs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                How do I get a Notion integration key?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                You can create a Notion integration key by following these
                steps:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Go to{" "}
                  <Link
                    href="https://www.notion.so/my-integrations"
                    className="text-primary underline"
                  >
                    www.notion.so/my-integrations
                  </Link>
                </li>
                <li>Click &apos;New integration&apos;</li>
                <li>Name your integration and submit</li>
                <li>Copy the &apos;Internal Integration Token&apos;</li>
                <li>
                  Share the specific Notion pages you want to access with your
                  integration
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                What Notion elements are supported in the conversion?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our converter supports most Notion elements including:
              </p>
              <ul className="grid grid-cols-2 gap-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Headings (H1-H3)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Rich text formatting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Lists (bulleted & numbered)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>To-do lists</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Tables</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Code blocks</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Callouts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Toggle lists</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Images</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Quotes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Dividers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Links</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 rounded-lg p-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Convert Your Notion Content?
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          Start converting your Notion pages into clean, well-formatted content
          in seconds.
        </p>
        <Button size="lg" className="text-lg px-8">
          Try the Converter Now
        </Button>
      </div>

      {/* Blog snippets for additional SEO content */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Related Resources
          </h2>
          <p className="text-lg text-muted-foreground">
            Learn more about Notion, content conversion, and best practices
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/blog/notion-markdown-guide" className="block group">
            <Card className="h-full transition-all group-hover:shadow-md">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  [Article Image]
                </div>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  The Complete Guide to Notion Markdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn everything about using and optimizing Markdown in Notion
                  for better content organization.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/blog/notion-to-website" className="block group">
            <Card className="h-full transition-all group-hover:shadow-md">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  [Article Image]
                </div>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  How to Turn Your Notion Pages into a Website
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Step-by-step guide to transforming your Notion workspace into
                  a fully functional website.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/blog/notion-api-tutorial" className="block group">
            <Card className="h-full transition-all group-hover:shadow-md">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  [Article Image]
                </div>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Getting Started with the Notion API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A beginner-friendly introduction to using the Notion API for
                  content management.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
