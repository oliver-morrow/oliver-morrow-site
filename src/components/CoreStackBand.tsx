import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";

const { coreStack } = siteConfig.profile;

export default function CoreStackBand() {
  return (
    <SectionReveal>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div
          className={cn(
            "card-noise rounded-lg border border-border bg-card px-5 py-5 sm:px-6",
            "grid gap-5 lg:grid-cols-[0.9fr_1.1fr]",
          )}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
              Core Stack
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-text-primary sm:text-lg">
              Modern data and agent tooling, used in production. The point is not just the tools
              themselves, but shipping real systems with them.
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-2">
            {coreStack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
