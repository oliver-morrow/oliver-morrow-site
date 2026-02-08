"use client";

import { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "EXPERIENCE", href: "#experience" },
  { label: "EDUCATION", href: "#education" },
  { label: "VOLUNTEER", href: "#volunteer" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

const { socials } = siteConfig.profile;

const socialLinks = [
  { icon: Github, href: socials.github, label: "GitHub" },
  { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
];

const BUILD_TIME = Number(process.env.NEXT_PUBLIC_BUILD_TIME) || Date.now();

function formatUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  return `${m}m ${sec}s`;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const uptimeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update uptime imperatively — avoids re-rendering the entire navbar every second
  useEffect(() => {
    const tick = () => {
      if (uptimeRef.current) {
        uptimeRef.current.textContent = formatUptime(Date.now() - BUILD_TIME);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "border-b border-border",
        scrolled
          ? "bg-bg/80 backdrop-blur-md"
          : "bg-bg/50 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-12 items-center justify-between">
          {/* Left — system identifier */}
          <a
            href="#"
            className="font-mono text-sm font-semibold text-text-primary hover:text-accent transition-colors"
          >
            olivermorrow
          </a>

          {/* Center — nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded font-mono text-xs uppercase tracking-widest",
                  "text-text-muted hover:text-accent hover:bg-accent-glow",
                  "transition-all duration-200"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right — uptime + socials */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-text-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span ref={uptimeRef} />
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            {/* Social icons */}
            <div className="flex items-center gap-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "p-1.5 rounded text-text-muted",
                    "hover:text-accent hover:bg-accent-glow",
                    "transition-all duration-200"
                  )}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
