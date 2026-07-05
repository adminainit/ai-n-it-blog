import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'fs';

import { defineCollection, z } from 'astro:content';

import matter from 'gray-matter';

const sqliteLoader = () => {
  return {
    name: 'sqlite-loader',
    load: async ({ store, logger, parseData }) => {
      logger.info('Loading posts from local SQLite database...');
      if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
      const Database = require('better-sqlite3');
      const db = new Database('./data/local.db');
      db.exec('CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, content TEXT)');
      try {
        const posts = db.prepare('SELECT id, content FROM posts').all();
        store.clear();
        for (const post of posts) {
          try {
            const parsed = matter(post.content);
            const data = parsed.data;
            if (data.date) {
               data.date = new Date(data.date);
            }
            const parsedData = await parseData({ id: post.id, data });
            store.set({
              id: post.id.replace(/\.mdx?$/, ''), 
              data: parsedData,
              body: parsed.content,
            });
          } catch (e) {
            logger.warn(`Failed to parse post ${post.id}: ${e.message}`);
          }
        }
      } catch (err) {
        logger.error(`Failed to load posts from DB: ${err.message}`);
      } finally {
        db.close();
      }
    }
  };
};

const postsCollection = defineCollection({
  loader: sqliteLoader(),
  schema: () => z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
