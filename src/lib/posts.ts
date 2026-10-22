import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

export const getPosts = async () =>
  (await getCollection("blog", p => !p.data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

export const readingTime = (p: Post) =>
  Math.max(1, Math.round((p.body ?? "").split(/\s+/).filter(Boolean).length / 200));

export const excerpt = (p: Post, max = 170) => {
  if (p.data.description) return p.data.description;
  const text = (p.body ?? "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#+\s.*$/gm, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
};

export const hue = (s: string) => 150 + ([...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7) % 80);

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
