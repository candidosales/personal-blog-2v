import { defineMiddleware } from "astro:middleware";
import { post, profile } from "@lib/knowledge";

const LINKS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</.well-known/mcp/server-card.json>; rel="describedby"; type="application/json"',
  '</llms.txt>; rel="describedby"; type="text/markdown"',
].join(", ");

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  const path = url.pathname.replace(/\/$/, "") || "/";
  if (request.headers.get("accept")?.includes("text/markdown")) {
    const md =
      path === "/" ? profile() : path.startsWith("/blog/") ? post(path.slice(6)) : undefined;
    if (md)
      return new Response(md, {
        headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept", Link: LINKS },
      });
  }
  const res = await next();
  if (path === "/") {
    res.headers.set("Link", LINKS);
    res.headers.append("Vary", "Accept");
  }
  return res;
});
