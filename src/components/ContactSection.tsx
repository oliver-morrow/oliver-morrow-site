"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";
import SectionHeader from "./SectionHeader";

const { socials } = siteConfig.profile;
const commitHash = process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) || "DEV";

const socialLinks = [
  { icon: Github, href: socials.github, label: "GitHub" },
  { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
];

const inputClasses = cn(
  "w-full bg-card border border-border rounded-lg px-3 py-2.5",
  "font-mono text-sm text-text-primary placeholder:text-text-muted/40",
  "outline-none transition-colors duration-150",
  "focus:border-accent caret-cyan-500",
);

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav) {
      setLatency(Math.round(nav.domComplete - nav.requestStart));
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const city = tz.split("/").pop()?.replace(/_/g, " ").toUpperCase() ?? tz.toUpperCase();
    setLocation(city);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const email = data.get("email") as string;
    const subject = data.get("subject") as string;
    const message = data.get("message") as string;

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to send message");
      }

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SectionReveal>
        <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <SectionHeader title="Contact" />

          {isSuccess ? (
            <div className="font-mono text-sm uppercase tracking-widest text-accent leading-relaxed">
              {"MESSAGE RECEIVED — I'LL GET BACK TO YOU SHORTLY"}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-xs uppercase tracking-widest text-text-muted mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  placeholder="you@domain.com"
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block font-mono text-xs uppercase tracking-widest text-text-muted mb-2"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="Subject line"
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-mono text-xs uppercase tracking-widest text-text-muted mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  disabled={isSubmitting}
                  rows={4}
                  placeholder="Write your message..."
                  className={cn(inputClasses, "resize-none")}
                />
              </div>

              {error && (
                <p className="font-mono text-xs uppercase tracking-widest text-red-500">
                  {`ERROR — ${error}`}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "font-mono text-sm uppercase tracking-widest px-6 py-2.5 rounded-lg",
                  "border border-accent text-accent font-bold",
                  "transition-all duration-150",
                  "hover:bg-accent/10 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]",
                  "active:scale-[0.97]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                {isSubmitting ? "SENDING..." : "SUBMIT"}
              </button>
            </form>
          )}
        </section>
      </SectionReveal>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          {/* Left — Copyright */}
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.profile.name}
          </p>

          {/* Center — Telemetry */}
          <div className="hidden sm:flex items-center gap-2">
            <span>{`LATENCY: ${latency ?? "--"}ms`}</span>
            <span className="opacity-30">{"::"}</span>
            <span>{`LOC: ${location ?? "--"}`}</span>
            <span className="opacity-30">{"::"}</span>
            <span>{`BUILD: git-${commitHash}`}</span>
          </div>

          {/* Right — Socials */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-zinc-600 hover:text-accent transition-colors duration-150"
              >
                <social.icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
