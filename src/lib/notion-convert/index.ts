import { Client } from "@notionhq/client";
import { NotionConverter } from "notion-to-md";
import { DefaultExporter } from "notion-to-md/plugins/exporter";
import { MDXRenderer } from "notion-to-md/plugins/renderer";

export async function getNotionPages(integrationKey: string) {
  const notion = new Client({ auth: integrationKey });
  // Fetch pages from Notion
  const response = await notion.search({
    filter: {
      property: "object",
      value: "page",
    },
    sort: {
      direction: "descending",
      timestamp: "last_edited_time",
    },
  });
  // Format the response
  return response.results.map((page: any) => ({
    id: page.id,
    title:
      page.properties?.title?.title?.[0]?.plain_text ||
      page.properties?.Name?.title?.[0]?.plain_text ||
      "Untitled",
    lastEdited: page.last_edited_time,
  }));
}

export async function convertNotionPage(
  integrationKey: string,
  pageId: string,
  format: string,
) {
  const notion = new Client({ auth: integrationKey });

  // Use a buffer to store the output content
  const outputBuffer: Record<string, string> = {};

  // Choose renderer based on format
  let converter: NotionConverter;

  switch (format) {
    case "mdx":
      // Use MDX renderer with frontmatter
      converter = new NotionConverter(notion)
        .withRenderer(new MDXRenderer({ frontmatter: true }))
        .withExporter(
          new DefaultExporter({
            outputType: "buffer",
            buffer: outputBuffer,
          }),
        );
      break;

    default:
      // Default markdown renderer
      converter = new NotionConverter(notion)
        .withRenderer(new MDXRenderer())
        .withExporter(
          new DefaultExporter({
            outputType: "buffer",
            buffer: outputBuffer,
          }),
        );
      break;
  }

  // Convert the page
  await converter.convert(pageId);

  // Get the content from the buffer
  let content = outputBuffer[pageId] || "";

  return content;
}
