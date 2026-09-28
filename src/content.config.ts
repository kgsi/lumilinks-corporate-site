import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.string().optional(),
});

// 日本語のお知らせ
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: newsSchema,
});

// 英語のお知らせ。日本語と同じファイル名にすると、言語切替で同じ記事へ行き来できる
const newsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news-en' }),
  schema: newsSchema,
});

export const collections = { news, newsEn };
