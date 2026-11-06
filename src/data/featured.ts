// Featured products with a `story`. English only: feeds the chat and the MCP server, not the UI.
export const featuredData = (t: any) => [
  {
    slug: "converte-extrato",
    title: t("featured.1.title"),
    description: t("featured.1.description"),
    url: "https://convertextrato.com/",
    techs: [
      { icon: "nextjs", name: "Next.js" },
      { icon: "convex", name: "Convex" },
      { icon: "gemini", name: "Gemini" },
      { icon: "mcp", name: "MCP" },
      { icon: "posthog", name: "PostHog" },
    ],
    story: `Converte Extrato converts bank statements (PDF and images) into Excel (XLSX), CSV and OFX. Candido built it alone, from idea to paid product.
- Stack: Next.js, Tailwind, Base UI, Convex (database, serverless functions, workflows), Clerk auth, Google Gemini for extraction, Resend emails, Sentry and PostHog. UI in English, Portuguese and Spanish.
- Agent-ready: a public REST API and an MCP server (Streamable HTTP) so agents like Claude Code, Cursor, VS Code and Codex can convert statements. Docs: https://convertextrato.com/developers/mcp.md
- MCP design: 6 tools, 3 read (get_job, list_jobs, get_statement_file) and 3 write (create_upload_url, convert_statements, delete_job). API keys carry scopes; tools/list hides tools a key cannot call, so a read-only key sees only the read tools, and tools/call checks the scope again.
- Files are uploaded out of band: a tool returns an upload URL, the agent sends the bytes over HTTP, and a second tool references the file by handle. Passing file bytes in a tool argument would make the model retype them.
- Ships agent skills at https://convertextrato.com/.well-known/agent-skills/ and an llms.txt.`,
  },
  {
    slug: "turismo-piaui",
    title: t("volunteer.1.title"),
    description: t("volunteer.1.description"),
    url: "https://www.turismopiaui.com/",
    techs: [
      { icon: "svelte", name: "Svelte" },
      { icon: "meilisearch", name: "Meilisearch" },
      { icon: "strapi", name: "Strapi" },
      { icon: "mcp", name: "MCP" },
      { icon: "vercel", name: "Vercel" },
      { icon: "flyio", name: "Fly.io" },
    ],
    story: `Turismo Piauí is a travel guide to Piauí, Brazil, Candido's home state: cities, attractions, food, history, ecotourism and an events calendar. Candido founded it and builds it as a volunteer.
- Stack: SvelteKit, Vite, shadcn-svelte, Tailwind, Strapi CMS on Fly.io, Meilisearch, Vercel.
- Every content page has a markdown version (.md) and the site publishes an llms.txt.
- Agent-ready: a public MCP server at https://www.turismopiaui.com/mcp (Streamable HTTP, stateless, no auth). About 250 lines: an 18-line route and five tools: search (Meilisearch federated search across all indexes), get_city, get_place, list_events (205 events from a bundled calendar, accent-insensitive city match) and list_nearby (Meilisearch geo filter, nearest first).
- Design choice: the tools reuse the site's search service and markdown renderer, so agents read the same content as the website and there is no second data path. Invalid arguments return a tool error (isError: true) the model can read and retry.
- Talk: "Turismo Piauí: da Ideia a Implementação" at Teresina Info, 2024-08-22.`,
  },
  {
    slug: "megui",
    title: t("volunteer.6.title"),
    description: t("volunteer.6.description"),
    url: "https://www.megui.app/",
    techs: [
      { icon: "react", name: "React" },
      { icon: "expo", name: "Expo" },
      { icon: "payloadcms", name: "PayloadCMS" },
      { icon: "flyio", name: "Fly.io" },
      { icon: "vercel", name: "Vercel" },
      { icon: "posthog", name: "PostHog" },
    ],
    story: `Megui is a mental health guide for individuals and families, built as a mobile app. Candido builds it as a volunteer.
- Stack: React, Expo (iOS and Android), PayloadCMS on Fly.io, Vercel, PostHog.`,
  },
];
