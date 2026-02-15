"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, Menu, Search, X } from "lucide-react";
import SpotlightSearch from "./SpotlightSearch";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "EXPERIENCE", href: "#experience" },
  { label: "EDUCATION", href: "#education" },
  { label: "VOLUNTEER", href: "#volunteer" },
  { label: "PROJECTS", href: "#projects" },
  { label: "WRITING", href: "https://blog.olivermorrow.com" },
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
                  "text-white hover:text-accent hover:bg-accent-glow",
                  "transition-all duration-200"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-1.5 rounded text-white hover:text-accent transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {/* Right — search + socials */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                document.dispatchEvent(new Event("spotlight:open"))
              }
              className={cn(
                "hidden sm:flex items-center gap-1.5 px-2 py-1 rounded",
                "border border-border hover:border-border-hover",
                "font-mono text-[10px] text-white hover:text-accent",
                "transition-all duration-200",
              )}
              aria-label="Search (Cmd+K)"
            >
              <Search className="h-3 w-3" />
              <kbd className="font-mono">⌘K</kbd>
            </button>

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
                    "p-1.5 rounded text-white",
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
      {/* Mobile nav panel */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-bg/95 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-2 rounded font-mono text-xs uppercase tracking-widest",
                  "text-white hover:text-accent hover:bg-accent-glow",
                  "transition-all duration-200"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      <SpotlightSearch />
    </header>
  );
}
