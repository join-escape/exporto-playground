import { Client } from "@notionhq/client";

export const getNotionClient = (token: string) => {
  return new Client({ auth: token });
};

export const getUserPages = async (token: string) => {
  const notion = getNotionClient(token);

  const response = await notion.search({
    filter: {
      property: "object",
      value: "page",
    },
  });

  return response.results;
};

export const getPageContent = async (token: string, pageId: string) => {
  const notion = getNotionClient(token);
  const blocks = await notion.blocks.children.list({ block_id: pageId });
  return blocks.results;
};
