import type { APIRoute } from 'astro';
import { extrasData } from '@data/extras';
import { portfolioData } from '@data/portfolio';
import { posts } from '@data/posts';
import { presentations } from '@data/presentations';
import { volunteerData } from '@data/volunteer';
import { useTranslations } from '@i18n/utils';

type Lang = 'en' | 'pt-br';
type SearchItemType =
  | 'post'
  | 'external-post'
  | 'portfolio'
  | 'presentation'
  | 'volunteer'
  | 'extra'
  | 'page';

type SearchItem = {
  id: string;
  type: SearchItemType;
  lang: Lang;
  title: string;
  description: string;
  href: string;
  keywords: string[];
  publishDate?: string;
};

const cache = new Map<Lang, SearchItem[]>();

const mdPostsEn = import.meta.glob('../blog/*.mdx', { eager: true }) as Record<
  string,
  {
    frontmatter?: {
      title?: string;
      description?: string;
      pubDate?: string;
      tags?: string[];
    };
  }
>;

const mdPostsPt = import.meta.glob('../pt-br/blog/*.mdx', { eager: true }) as Record<
  string,
  {
    frontmatter?: {
      title?: string;
      description?: string;
      pubDate?: string;
      tags?: string[];
    };
  }
>;

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const typeWeight: Record<SearchItemType, number> = {
  page: 18,
  post: 14,
  'external-post': 10,
  portfolio: 12,
  presentation: 8,
  volunteer: 8,
  extra: 8,
};

function scoreMatch(item: SearchItem, query: string): number {
  const q = normalizeText(query);
  if (!q) return 0;

  const title = normalizeText(item.title);
  const description = normalizeText(item.description);
  const href = normalizeText(item.href);
  const keywords = item.keywords.map(normalizeText);

  let score = 0;

  if (title.startsWith(q)) score += 40;
  else if (title.includes(q)) score += 25;

  if (keywords.some((keyword) => keyword.startsWith(q))) score += 20;
  else if (keywords.some((keyword) => keyword.includes(q))) score += 10;

  if (description.includes(q)) score += 8;
  if (href.includes(q)) score += 4;

  return score;
}

function scoredResult(item: SearchItem, query: string, preferredLang: Lang): number {
  const baseScore = scoreMatch(item, query);
  if (!baseScore) return 0;

  let score = baseScore;
  score += typeWeight[item.type] ?? 0;

  if (item.lang === preferredLang) {
    score += 12;
  } else {
    score -= 8;
  }

  return score;
}

function mapMdxPosts(lang: Lang): SearchItem[] {
  const mdPosts = lang === 'pt-br' ? mdPostsPt : mdPostsEn;

  return Object.entries(mdPosts).map(([path, post]) => {
    const href = path
      .replace('..', '')
      .replace(/\.mdx$/, '')
      .replace('/index', '');

    const title = post.frontmatter?.title ?? '';

    return {
      id: `${lang}:post:${href}`,
      type: 'post',
      lang,
      title,
      description: post.frontmatter?.description ?? '',
      href,
      publishDate: post.frontmatter?.pubDate,
      keywords: [title, ...(post.frontmatter?.tags ?? [])],
    } satisfies SearchItem;
  });
}

function staticPages(t: ReturnType<typeof useTranslations>, lang: Lang): SearchItem[] {
  const prefix = lang === 'pt-br' ? '/pt-br' : '';

  return [
    {
      id: `${lang}:page:home`,
      type: 'page',
      lang,
      title: t('menu.home'),
      description: t('seo.description'),
      href: `${prefix}/`,
      keywords: [t('menu.home')],
    },
    {
      id: `${lang}:page:blog`,
      type: 'page',
      lang,
      title: t('menu.blog'),
      description: 'Blog and articles',
      href: `${prefix}/blog`,
      keywords: [t('menu.blog'), 'posts', 'articles'],
    },
    {
      id: `${lang}:page:about`,
      type: 'page',
      lang,
      title: t('menu.about'),
      description: 'About and work experience',
      href: `${prefix}/about`,
      keywords: [t('menu.about')],
    },
    {
      id: `${lang}:page:presentations`,
      type: 'page',
      lang,
      title: t('menu.presentations'),
      description: 'Talks and presentations',
      href: `${prefix}/presentations`,
      keywords: [t('menu.presentations'), 'talks'],
    },
    {
      id: `${lang}:page:services`,
      type: 'page',
      lang,
      title: t('services.title'),
      description: t('services.subtitle'),
      href: `${prefix}/services`,
      keywords: [t('services.title')],
    },
    {
      id: `${lang}:page:lab`,
      type: 'page',
      lang,
      title: t('menu.lab'),
      description: t('lab.subtitle'),
      href: `${prefix}/ui-lab`,
      keywords: [t('menu.lab'), 'animation'],
    },
  ];
}

function getSearchItems(lang: Lang): SearchItem[] {
  const cached = cache.get(lang);
  if (cached) return cached;

  const t = useTranslations(lang);

  const items: SearchItem[] = [];

  for (const post of posts) {
    items.push({
      id: `${lang}:external-post:${post.href}`,
      type: 'external-post',
      lang,
      title: post.title,
      description: post.description,
      href: post.href,
      publishDate: post.publishDate,
      keywords: [post.title],
    });
  }

  for (const post of mapMdxPosts(lang)) {
    items.push(post);
  }

  for (const item of portfolioData(t)) {
    items.push({
      id: `${lang}:portfolio:${item.url}`,
      type: 'portfolio',
      lang,
      title: item.title,
      description: item.description,
      href: item.url,
      keywords: [item.title, ...(item.techs?.map((tech) => tech.name) ?? [])],
    });
  }

  for (const item of presentations) {
    items.push({
      id: `${lang}:presentation:${item.href}`,
      type: 'presentation',
      lang,
      title: item.title,
      description: item.description,
      href: item.href,
      publishDate: item.publishDate,
      keywords: [item.title, item.place.name],
    });
  }

  for (const item of volunteerData(t)) {
    items.push({
      id: `${lang}:volunteer:${item.url}`,
      type: 'volunteer',
      lang,
      title: item.title,
      description: item.description,
      href: item.url,
      keywords: [item.title, ...(item.techs?.map((tech) => tech.name) ?? [])],
    });
  }

  for (const item of extrasData(t)) {
    items.push({
      id: `${lang}:extra:${item.url}`,
      type: 'extra',
      lang,
      title: item.title,
      description: item.description,
      href: item.url,
      keywords: [item.title, ...(item.techs?.map((tech) => tech.name) ?? [])],
    });
  }

  items.push(...staticPages(t, lang));

  cache.set(lang, items);
  return items;
}

function asLang(value: string | null): Lang {
  return value === 'pt-br' ? 'pt-br' : 'en';
}

function otherLang(lang: Lang): Lang {
  return lang === 'pt-br' ? 'en' : 'pt-br';
}

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() ?? '';
  const lang = asLang(url.searchParams.get('lang'));
  const includeFallback = url.searchParams.get('fallback') !== '0';
  const limit = Number.parseInt(url.searchParams.get('limit') ?? '20', 10);

  if (!query) {
    return new Response(JSON.stringify({ query, results: [] }), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  }

  const items = includeFallback
    ? [...getSearchItems(lang), ...getSearchItems(otherLang(lang))]
    : getSearchItems(lang);

  const deduped = new Map<string, { item: SearchItem; score: number }>();

  for (const item of items) {
    const score = scoredResult(item, query, lang);
    if (!score) continue;

    const key = `${item.type}:${item.href}`;
    const existing = deduped.get(key);
    if (!existing || score > existing.score) {
      deduped.set(key, { item, score });
    }
  }

  const results = Array.from(deduped.values())
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.item.publishDate ?? 0).getTime() - new Date(a.item.publishDate ?? 0).getTime();
    })
    .slice(0, Number.isFinite(limit) ? Math.max(1, Math.min(50, limit)) : 20)
    .map((entry) => entry.item);

  return new Response(JSON.stringify({ query, results }), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  });
};
