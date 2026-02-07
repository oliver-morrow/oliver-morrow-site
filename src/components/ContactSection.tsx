"use client";

import { useState, type FormEvent } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";

const { socials } = siteConfig.profile;
const commitHash = process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) || "DEV";

const socialLinks = [
  { icon: Github, href: socials.github, label: "GitHub" },
  { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
];

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = data.get("email") as string;
    const message = data.get("message") as string;

    window.location.href = `mailto:${socials.email}?subject=Contact from ${encodeURIComponent(email)}&body=${encodeURIComponent(message)}`;
    setSent(true);
    form.reset();
  }

  return (
    <>
      <SectionReveal>
        <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <div className="mb-12">
            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-text-primary uppercase">
              Contact
            </h2>
            <div className="mt-4 h-px w-16 bg-border" />
          </div>

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
                placeholder="you@domain.com"
                className={cn(
                  "w-full bg-card border border-border rounded-lg px-3 py-2.5",
                  "font-mono text-sm text-text-primary placeholder:text-text-muted/40",
                  "outline-none transition-colors duration-150",
                  "focus:border-accent caret-cyan-500",
                )}
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
                rows={4}
                placeholder="Write your message..."
                className={cn(
                  "w-full bg-card border border-border rounded-lg px-3 py-2.5 resize-none",
                  "font-mono text-sm text-text-primary placeholder:text-text-muted/40",
                  "outline-none transition-colors duration-150",
                  "focus:border-accent caret-cyan-500",
                )}
              />
            </div>

            <button
              type="submit"
              className={cn(
                "font-mono text-sm uppercase tracking-widest px-6 py-2.5 rounded-lg",
                "bg-accent text-black font-bold",
                "transition-all duration-100",
                "hover:bg-accent/90",
                "active:scale-[0.97]"
              )}
            >
              {sent ? "Sent" : "Send"}
            </button>
          </form>
        </section>
      </SectionReveal>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          {/* Left — Copyright */}
          <p>
            <span className="opacity-50">{"_>"}</span>{" "}
            &copy; {new Date().getFullYear()} {siteConfig.profile.name}
          </p>

          {/* Center — System Dashboard */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span>{"SYSTEM: NORMAL"}</span>
            <span className="opacity-30">{"::"}</span>
            <span>{"REGION: NA-EAST"}</span>
            <span className="opacity-30">{"::"}</span>
            <span>{`BUILD: ${commitHash}`}</span>
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
