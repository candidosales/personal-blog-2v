import { mkdirSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const md = { headers: { Accept: "text/markdown" } };

test("agent discovery endpoints answer the way isitagentready.com checks them", async ({
  request,
}) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Content-Signal: search=yes, ai-input=yes, ai-train=yes");

  const card = await (await request.get("/.well-known/mcp/server-card.json")).json();
  expect(card.serverInfo).toMatchObject({ name: "candidosales", version: "1.0.0" });

  const catalog = await request.get("/.well-known/api-catalog");
  expect(catalog.headers()["content-type"]).toBe("application/linkset+json");
  const { linkset } = await catalog.json();

  const home = await request.get("/");
  expect(home.headers()["content-type"]).toContain("text/html");
  expect(home.headers()["link"]).toContain('rel="api-catalog"');

  const homeMd = await request.get("/", md);
  expect(homeMd.headers()["content-type"]).toContain("text/markdown");
  expect(await homeMd.text()).toMatch(/^# Candido Sales/);

  const postMd = await request.get("/blog/my-ai-open-source-workflow", md);
  expect(postMd.headers()["content-type"]).toContain("text/markdown");
  const postText = await postMd.text();
  expect(postText.length).toBeGreaterThan(2000);

  const unknownMd = await request.get("/blog/nope", md);
  expect(unknownMd.headers()["content-type"] ?? "").not.toContain("text/markdown");

  mkdirSync("e2e/artifacts", { recursive: true });
  writeFileSync(
    "e2e/artifacts/agent-ready.json",
    JSON.stringify(
      {
        robots,
        card,
        linkset,
        link: home.headers()["link"],
        postMarkdownHead: postText.slice(0, 300),
      },
      null,
      2,
    ),
  );
});
