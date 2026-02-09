// RSS fetcher for blog.olivermorrow.com — runs at build time only

export interface BlogPost {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  tags: string[];
}

export async function getRecentBlogPosts(
  limit = 3,
): Promise<BlogPost[]> {
  try {
    const res = await fetch("https://blog.olivermorrow.com/rss.xml");
    if (!res.ok) return [];

    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

    return items.slice(0, limit).map((item) => {
      const get = (tag: string) =>
        item
          .match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tag}>`))?.[1]
          ?.trim() ?? "";

      const categories = [
        ...item.matchAll(
          /<category>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/g,
        ),
      ].map((m) => m[1].trim());

      return {
        title: get("title"),
        description: get("description"),
        link: get("link"),
        pubDate: get("pubDate"),
        tags: categories,
      };
    });
  } catch {
    // Blog might not be deployed yet — fail silently
    return [];
  }
}
