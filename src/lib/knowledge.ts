// One knowledge source for the chat (/api/chat) and the MCP server (/mcp). English only.
import llms from "../../public/llms.txt?raw";
import { featuredData } from "@data/featured";
import { portfolioData } from "@data/portfolio";
import { volunteerData } from "@data/volunteer";
import { extrasData } from "@data/extras";
import { posts as externalPosts } from "@data/posts";
import { presentations } from "@data/presentations";
import { useTranslations } from "@i18n/utils";

const SITE = "https://www.candidosales.me";
const t = useTranslations("en");

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Project = {
  slug: string;
  title: string;
  description: string;
  url: string;
  group: string;
  techs: string[];
  story?: string;
};

const PROJECTS: Project[] = [
  ...featuredData(t).map((p) => ({ ...p, group: "featured" })),
  ...portfolioData(t).map((p) => ({ ...p, group: "open source" })),
  ...volunteerData(t).map((p) => ({ ...p, group: "volunteer" })),
  ...extrasData(t).map((p) => ({ ...p, group: "extras" })),
]
  .filter((p, i, all) => all.findIndex((x) => x.url === p.url) === i)
  .map((p: any) => ({
    slug: p.slug ?? slugify(p.title),
    title: p.title,
    description: p.description,
    url: p.url,
    group: p.group,
    techs: p.techs.map((x: { name: string }) => x.name),
    story: p.story,
  }));

const mdx = import.meta.glob<string>("../pages/blog/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
});

type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  url: string;
  body?: string;
};

const field = (fm: string, key: string) =>
  fm.match(new RegExp(`^${key}:\\s*"?(.*?)"?$`, "m"))?.[1] ?? "";

const POSTS: Post[] = [
  ...Object.entries(mdx).map(([path, raw]) => {
    const [, fm = "", body = ""] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
    const slug = path
      .split("/")
      .pop()!
      .replace(/\.mdx$/, "");
    return {
      slug,
      title: field(fm, "title"),
      date: field(fm, "pubDate"),
      description: field(fm, "description"),
      url: `${SITE}/blog/${slug}`,
      body: body.replace(/^import .*$/gm, "").trim(),
    };
  }),
  ...externalPosts.map((p) => ({
    slug: slugify(p.title),
    title: p.title,
    date: p.publishDate,
    description: p.description,
    url: p.href,
  })),
].sort((a, b) => b.date.localeCompare(a.date));

const projectLine = (p: Project) =>
  `- ${p.title} (${p.slug}, ${p.group}): ${p.description}. ${p.url}. Stack: ${p.techs.join(", ")}`;
const postLine = (p: Post) => `- ${p.date} ${p.title} (${p.slug}): ${p.description} ${p.url}`;

export const profile = () => llms;

export const projects = () => PROJECTS.map(projectLine).join("\n");

export const project = (slug: string) => {
  const p = PROJECTS.find((x) => x.slug === slug);
  return p && [`# ${p.title}`, projectLine(p), p.story].filter(Boolean).join("\n\n");
};

export const posts = () => POSTS.map(postLine).join("\n");

export const post = (slug: string) => {
  const p = POSTS.find((x) => x.slug === slug);
  return p && [`# ${p.title}`, postLine(p), p.body ?? "Full text at the URL above."].join("\n\n");
};

export const projectSlugs = PROJECTS.map((p) => p.slug);
export const postSlugs = POSTS.map((p) => p.slug);

const talks = presentations
  .map((p) => `- ${p.publishDate} ${p.title} at ${p.place.name}: ${p.description} ${p.href}`)
  .join("\n");

const CORPUS = [
  "# Profile",
  llms,
  "# Featured projects",
  ...PROJECTS.filter((p) => p.story).map((p) => project(p.slug)),
  "# All projects",
  projects(),
  "# Talks",
  talks,
  "# Posts",
  posts(),
  ...POSTS.filter((p) => p.body).map((p) => post(p.slug)),
].join("\n\n");

export const corpus = () => CORPUS;
