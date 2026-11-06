# Plan: chat with candidosales.me (web chat + MCP server)

## Goal

A visitor asks "What did Candido build with MCP?" and gets a grounded answer, in the browser or from their own agent (Claude, Cursor, ChatGPT). One knowledge source feeds both doors.

## How ambrosino.io works (from github.com/aa-io/site)

| Part                            | What it does                                                                                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/api/chat/route.ts`         | Next.js route. AI SDK 5 `streamText`, `gpt-4o`, `stopWhen: stepCountIs(5)`, streams `toUIMessageStreamResponse()`.                                                                          |
| `app/api/chat/system-prompt.ts` | No RAG, no vector DB. The whole site is pasted into the system prompt: persona, voice rules, scope rules, work history from `data/*.ts`, and every `content.mdx` case study read with `fs`. |
| `app/api/chat/tools/index.ts`   | Two tools: OpenAI `web_search_preview` and `provideLink` (enum of known links → title/url, rendered as a card).                                                                             |
| `app/components/chat/*`         | `useChat` + `DefaultChatTransport('/api/chat')`, ~260 lines of UI. `/chat` page linked from the nav.                                                                                        |
| `public/llms.txt`               | Same facts, static, for crawlers.                                                                                                                                                           |

What it lacks: rate limiting or spend cap, MCP server (it links a Custom GPT instead), prompt caching (`new Date()` in the prompt changes it every request).

Takeaway: content this small fits in context. Retrieval infrastructure is unnecessary.

## Our version

Corpus today: 3 blog posts (~4.8k words), `llms.txt` (~1k words), `src/data/*.ts`, `src/i18n/ui.ts`. About 15k tokens. Fits in one cached system prompt.

```
src/lib/knowledge.ts      build markdown corpus once (data + i18n + MDX bodies + llms.txt)
        │
        ├── src/pages/mcp.ts           MCP server, stateless Streamable HTTP (Turismo pattern)
        │      tools: get_profile, list_projects, get_project, list_posts, get_post
        │
        └── src/pages/api/chat.ts      AI SDK streamText, Claude Haiku 5.5, corpus as cached system prompt
               tools: same functions as MCP (list_projects, get_post…) + provide_link
               ▲
        src/components/react/chat/Chat.tsx   useChat, mounted on /chat and as home hero input
```

### Decisions

- **Model:** `claude-haiku-5-5` through `@ai-sdk/anthropic`. Cheap, fast, good at staying in scope. Corpus goes in the system prompt with `cacheControl: ephemeral`; no date in the prompt so the cache hits.
- **No web search tool.** It lets the bot answer from random web pages. Answers come from the corpus only; unknown → "not on the site" + contact link.
- **Third person, Candido's voice**, same rule as ambrosino. Reply in the visitor's language (EN/PT-BR).
- **MCP is public and read-only.** No auth. Same five functions back both MCP tools and chat tools, so there is one data path.
- **Projects data:** move Megui and Turismo Piauí from `volunteer.ts` into a `featured` list, add Converte Extrato. Each gets a `story` field (problem, judgment call, outcome, MCP tools). That field feeds the home page, chat and MCP.
- **React for the chat island.** `@astrojs/react` is already installed and `@ai-sdk/react` has `useChat`.
- **Home page:** keep the terminal block you liked, make it real:
  ```
  $ claude mcp add candidosales https://www.candidosales.me/mcp
  › what did Candido build with MCP?
  ```
  Below it, a chat input. Submitting opens `/chat?q=…` with the answer streaming.

### Cost guard (needs your OK)

- **Problem:** `/api/chat` spends your Anthropic credit on every message. Public chat endpoints get hit by bots and people testing jailbreaks. Likely, not theoretical.
- **Fix:** `maxOutputTokens: 800`, last 10 messages only, `stepCountIs(4)`. Hard monthly cap set in the Anthropic console.
- **Cost:** ~12 lines in `api/chat.ts`. No new package.
- **MCP needs none of this:** it serves text, no model call.

## Steps

1. **Data:** `featured` projects with `story`; Converte Extrato entry + screenshot. (`src/data/featured.ts`, `src/i18n/ui.ts`)
2. **Knowledge:** `src/lib/knowledge.ts` reads data, i18n strings, MDX bodies (`import.meta.glob('../pages/blog/*.mdx', { query: '?raw' })`), `llms.txt`. Exposes `profile()`, `projects()`, `project(slug)`, `posts()`, `post(slug)`, `corpus()`.
3. **MCP:** `src/pages/mcp.ts` with `@modelcontextprotocol/sdk` `WebStandardStreamableHTTPServerTransport` (`sessionIdGenerator: undefined`, `enableJsonResponse: true`), `export const ALL`. Copy of Turismo's 18-line route. Tool errors return `isError: true`.
4. **Chat API:** `src/pages/api/chat.ts`. `ai` + `@ai-sdk/anthropic`, system prompt = persona + scope rules + `corpus()`, rate limit from the section above.
5. **Chat UI:** `Chat.tsx` (messages, input, stop, link cards for `provide_link`). Page `/chat` and `/pt-br/chat`. Nav link.
6. **Home:** replace hero with headline + terminal block + chat input; three featured projects below; rest of portfolio moves to `/work`.
7. **Discovery:** add MCP URL to `llms.txt` and `/for-llms`; `/.well-known/mcp.json` pointing to `/mcp`.
8. **E2E:** Playwright against `vp run preview`:
   - MCP: `tools/list` returns 5 tools; `tools/call get_project {slug:"converte-extrato"}` contains "convert_statements".
   - Chat: ask "Which projects have an MCP server?", assert the answer names Converte Extrato and Turismo Piauí. Ask "write me a poem", assert refusal.
   - Artifact: `e2e/artifacts/chat-transcript.json` + screenshot of `/chat`.

Env: `ANTHROPIC_API_KEY`.

New deps: `ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`, `@modelcontextprotocol/sdk`, `zod`, `@playwright/test` (dev).

## Open questions

1. Model: Claude Haiku 5.5 (my pick) or Gemini, which you already pay for in Converte Extrato?
2. Rate limit 20 messages/hour per IP: OK?
3. Remove the volunteer/extras grids from home (moved to `/work`), or keep them below the featured three?
