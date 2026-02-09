import { ArrowUpRight } from "lucide-react";
import { getRecentBlogPosts } from "@/lib/blog";
import SectionReveal from "./SectionReveal";
import SectionHeader from "./SectionHeader";

export default async function RecentWriting() {
  const posts = await getRecentBlogPosts(3);

  if (posts.length === 0) return null;

  return (
    <SectionReveal>
      <section id="writing" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <SectionHeader title="Writing" />

        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <a
              key={post.link}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative card-noise rounded-lg block bg-card border border-border transition-colors duration-200 hover:border-border-hover"
            >
              <div className="relative z-10 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-text-muted">
                      {new Date(post.pubDate)
                        .toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                        .toUpperCase()}
                    </p>
                  </div>
                  <span className="shrink-0 p-1 text-text-muted group-hover:text-accent transition-colors duration-200">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <p className="mt-3 text-sm text-text-body leading-relaxed line-clamp-2">
                  {post.description}
                </p>

                {post.tags.length > 0 && (
                  <p className="mt-3 font-mono text-xs uppercase tracking-widest text-text-muted leading-relaxed">
                    {post.tags.join(" / ")}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>

        <a
          href="https://blog.olivermorrow.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block font-mono text-xs uppercase tracking-widest text-text-muted hover:text-accent transition-colors duration-150"
        >
          VIEW ALL POSTS &rarr;
        </a>
      </section>
    </SectionReveal>
  );
}
