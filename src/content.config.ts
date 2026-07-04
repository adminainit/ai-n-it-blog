import { defineCollection, z } from 'astro:content';
import Database from 'better-sqlite3';
import matter from 'gray-matter';

const sqliteLoader = () => {
  return {
    name: 'sqlite-loader',
    load: async ({ store, logger, parseData }) => {
      logger.info('Loading posts from local SQLite database...');
      const db = new Database('./data/local.db');
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
