import type { APIRoute } from "astro";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { Contact, sendContact } from "@lib/contact";
import { post, postSlugs, posts, profile, project, projectSlugs, projects } from "@lib/knowledge";

const text = (value: string) => ({ content: [{ type: "text" as const, text: value }] });
const notFound = (kind: string, slugs: string[]) => ({
  ...text(`Unknown ${kind}. Valid slugs: ${slugs.join(", ")}`),
  isError: true,
});

const sent = {
  sent: text("Sent. Candido will reply to the email given."),
  rate_limited: { ...text("Too many messages. Try again in 10 minutes."), isError: true },
  failed: {
    ...text("Sending failed. Reach Candido at https://www.linkedin.com/in/candidosales/"),
    isError: true,
  },
};

const createServer = (ip: string) => {
  const server = new McpServer({ name: "candidosales", version: "1.0.0" });
  server.registerTool(
    "get_profile",
    { description: "Candido Sales: bio, experience, skills, contact links." },
    () => text(profile()),
  );
  server.registerTool(
    "list_projects",
    { description: "All of Candido's projects with slug, summary, URL and stack." },
    () => text(projects()),
  );
  server.registerTool(
    "get_project",
    {
      description: "One project in depth: what it is, stack, design decisions, MCP tools.",
      inputSchema: { slug: z.string().describe("Slug from list_projects, e.g. converte-extrato") },
    },
    ({ slug }) => {
      const p = project(slug);
      return p ? text(p) : notFound("project", projectSlugs);
    },
  );
  server.registerTool(
    "list_posts",
    { description: "Candido's blog posts and articles, newest first." },
    () => text(posts()),
  );
  server.registerTool(
    "get_post",
    {
      description: "Full markdown of one blog post.",
      inputSchema: { slug: z.string().describe("Slug from list_posts") },
    },
    ({ slug }) => {
      const p = post(slug);
      return p ? text(p) : notFound("post", postSlugs);
    },
  );
  server.registerTool(
    "send_message",
    {
      description:
        "Email a message to Candido from the user. Ask the user for their email and confirm the text before calling.",
      inputSchema: Contact.shape,
    },
    async (input) => sent[await sendContact(input, ip, "mcp")],
  );
  return server;
};

export const ALL: APIRoute = async ({ request, clientAddress }) => {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await createServer(clientAddress).connect(transport);
  return transport.handleRequest(request);
};
