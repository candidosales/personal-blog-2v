import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  pubDate: z.coerce.date(),
  author: z.string(),
  description: z.string(),
  image: z.object({
    url: z.string(),
    alt: z.string(),
  }),
  tags: z.array(z.string()).optional(),
});

const blogEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog/en' }),
  schema: blogSchema,
});

const blogPt = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog/pt-br' }),
  schema: blogSchema,
});

export const collections = { blogEn, blogPt };
