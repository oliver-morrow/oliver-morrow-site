import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const { profile, frontDoor } = siteConfig;

export const metadata: Metadata = {
  title: "About",
  description:
    "A short page about Oliver Morrow.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-text-muted">
          About
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tighter text-text-primary uppercase sm:text-6xl">
          About me.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text-body sm:text-xl">
          I&apos;m {profile.name}. I study computer engineering and work on data systems, internal
          AI tooling, and side projects.
        </p>
        <p className="mt-4 text-base leading-relaxed text-text-body sm:text-lg">
          I tend to care about reliability, clear interfaces, and projects that teach me
          something.
        </p>
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article
          className={cn(
            "card-noise rounded-lg border border-border bg-card p-6",
            "transition-colors duration-200 hover:border-border-hover",
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
            What I spend time on
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {frontDoor.currentFocus.map((focus) => (
              <div key={focus.title}>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  {focus.label}
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-text-primary">
                  {focus.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-body">
                  {focus.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article
          className={cn(
            "card-noise rounded-lg border border-border bg-card p-6",
            "transition-colors duration-200 hover:border-border-hover",
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
            Right now
          </p>
          <div className="mt-5 space-y-4 font-mono text-[11px] uppercase tracking-[0.25em] text-text-primary">
            <div>
              <p className="text-text-muted">Based in</p>
              <p className="mt-1">{profile.location}</p>
            </div>
            <div>
              <p className="text-text-muted">Currently</p>
              <p className="mt-1">{profile.status}</p>
            </div>
            <div>
              <p className="text-text-muted">Writing</p>
              <a
                href={profile.socials.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block hover:text-accent"
              >
                Blog / Notes
              </a>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article
          className={cn(
            "card-noise rounded-lg border border-border bg-card p-6",
            "transition-colors duration-200 hover:border-border-hover",
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
            What I care about
          </p>
          <ul className="mt-5 space-y-3">
            {frontDoor.principles.map((principle) => (
              <li key={principle} className="flex gap-3 text-sm leading-relaxed text-text-body">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {principle}
              </li>
            ))}
          </ul>
        </article>

        <article
          className={cn(
            "card-noise rounded-lg border border-border bg-card p-6",
            "transition-colors duration-200 hover:border-border-hover",
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
            Next
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Link
              href="/work#case-studies"
              className="rounded-lg border border-border p-4 transition-colors duration-200 hover:border-border-hover"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
                Work
              </p>
              <p className="mt-2 text-xl font-bold text-text-primary">Case studies</p>
              <p className="mt-2 text-sm leading-relaxed text-text-body">
                The clearest view of the work I can talk about publicly.
              </p>
            </Link>

            <Link
              href="/work#projects"
              className="rounded-lg border border-border p-4 transition-colors duration-200 hover:border-border-hover"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
                Projects
              </p>
              <p className="mt-2 text-xl font-bold text-text-primary">Side builds</p>
              <p className="mt-2 text-sm leading-relaxed text-text-body">
                Systems, experiments, and side builds.
              </p>
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
