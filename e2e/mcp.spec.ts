import { mkdirSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const rpc = (method: string, params: object = {}) => ({
  headers: { Accept: "application/json, text/event-stream", "Content-Type": "application/json" },
  data: { jsonrpc: "2.0", id: 1, method, params },
});

test("MCP lists five tools", async ({ request }) => {
  const res = await request.post("/mcp", rpc("tools/list"));
  const { result } = await res.json();
  mkdirSync("e2e/artifacts", { recursive: true });
  writeFileSync("e2e/artifacts/mcp-tools.json", JSON.stringify(result.tools, null, 2));
  const names = result.tools.map((t: { name: string }) => t.name).sort();
  expect(names).toEqual(["get_post", "get_profile", "get_project", "list_posts", "list_projects"]);
});

test("MCP get_project returns the Converte Extrato story", async ({ request }) => {
  const res = await request.post(
    "/mcp",
    rpc("tools/call", { name: "get_project", arguments: { slug: "converte-extrato" } }),
  );
  const { result } = await res.json();
  expect(result.isError).toBeFalsy();
  expect(result.content[0].text).toContain("convert_statements");
});

test("MCP get_project with an unknown slug returns a tool error listing valid slugs", async ({
  request,
}) => {
  const res = await request.post(
    "/mcp",
    rpc("tools/call", { name: "get_project", arguments: { slug: "nope" } }),
  );
  const { result } = await res.json();
  expect(result.isError).toBe(true);
  expect(result.content[0].text).toContain("turismo-piaui");
});

test("MCP get_post returns a full blog post body", async ({ request }) => {
  const res = await request.post(
    "/mcp",
    rpc("tools/call", { name: "get_post", arguments: { slug: "my-ai-open-source-workflow" } }),
  );
  const text: string = (await res.json()).result.content[0].text;
  expect(text.length).toBeGreaterThan(2000);
  expect(text).not.toContain("import {");
});
