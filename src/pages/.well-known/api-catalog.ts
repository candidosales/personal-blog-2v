import type { APIRoute } from "astro";

const SITE = "https://www.candidosales.me";

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      linkset: [
        {
          anchor: `${SITE}/mcp`,
          "service-desc": [
            { href: `${SITE}/.well-known/mcp/server-card.json`, type: "application/json" },
          ],
          "service-doc": [{ href: `${SITE}/llms.txt`, type: "text/markdown" }],
        },
      ],
    }),
    { headers: { "Content-Type": "application/linkset+json" } },
  );
