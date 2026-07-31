import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: () => z.object({
    title: z.string().default('Untitled Post'),
    description: z.string().default(''),
    date: z.union([z.string(), z.date(), z.number()]).transform(v => new Date(v)).default(() => new Date()),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  posts: postsCollection,
};
