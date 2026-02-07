"use client";

import { useState, useEffect } from "react";
import { Terminal, Activity, Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "EXPERIENCE", href: "#experience" },
  { label: "EDUCATION", href: "#education" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

const { socials } = siteConfig.profile;

const socialLinks = [
  { icon: Github, href: socials.github, label: "GitHub" },
  { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
            className="flex items-center gap-2 font-mono text-sm text-text-muted hover:text-accent transition-colors"
          >
            <Terminal className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline text-text-muted">~/</span>
            <span className="font-semibold text-text-primary">
              {siteConfig.profile.name.toLowerCase().replace(" ", "-")}
            </span>
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

          {/* Right — status + socials */}
          <div className="flex items-center gap-3">
            {/* Uptime indicator */}
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-text-muted">
              <Activity className="h-3 w-3 text-accent animate-pulse-dot" />
              <span className="text-accent">Available</span>
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
