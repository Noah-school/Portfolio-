import rss from "@astrojs/rss";
import { excerpt, getPosts } from "../lib/posts";

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: "Noah Verstraeten – Blog",
    description: "Homelab builds, project write-ups and learning notes.",
    site: context.site,
    items: posts.map(p => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: excerpt(p),
      link: `/blog/${p.id}/`,
      categories: p.data.tags,
    })),
  });
}
