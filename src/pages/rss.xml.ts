import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../../site.config';

export async function GET(context: any) {
  const posts = await getCollection('posts');
  const validPosts = posts.filter(post => !post.data.draft);
  
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: validPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.excerpt || '',
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
