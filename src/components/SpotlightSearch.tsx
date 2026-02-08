"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Heart,
  Cpu,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  search,
  searchIndex,
  type SearchItem,
  type SearchCategory,
} from "@/lib/searchIndex";

const categoryMeta: Record<
  SearchCategory,
  { label: string; icon: typeof Briefcase }
> = {
  navigation: { label: "GO TO", icon: Compass },
  experience: { label: "EXPERIENCE", icon: Briefcase },
  project: { label: "PROJECTS", icon: FolderGit2 },
  education: { label: "EDUCATION", icon: GraduationCap },
  volunteer: { label: "VOLUNTEER", icon: Heart },
  skill: { label: "SKILLS", icon: Cpu },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
    transition: { duration: 0.1, ease: "easeIn" as const },
  },
};

export default function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const mouseMovedRef = useRef(false);

  useBodyScrollLock(open);

  useEffect(() => setMounted(true), []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Reset state synchronously with open toggle so React batches them
        // into a single render — avoids stale selectedIndex after paint
        setOpen((prev) => !prev);
        setSelectedIndex(0);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Custom event listener for navbar button
  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setSelectedIndex(0);
      setQuery("");
    };
    document.addEventListener("spotlight:open", handleOpen);
    return () => document.removeEventListener("spotlight:open", handleOpen);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      mouseMovedRef.current = false;
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Compute results
  const results = useMemo(() => {
    if (!query.trim()) {
      return searchIndex.filter((item) => item.category === "navigation");
    }
    return search(query);
  }, [query]);

  // Group results by category
  const grouped = useMemo(() => {
    const map = new Map<SearchCategory, SearchItem[]>();
    for (const item of results) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [results]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Scroll active item into view (only within the list, never the page)
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
    if (list && el) {
      const elRect = el.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      if (elRect.top < listRect.top) {
        list.scrollTop -= listRect.top - elRect.top;
      } else if (elRect.bottom > listRect.bottom) {
        list.scrollTop += elRect.bottom - listRect.bottom;
      }
    }
  }, [selectedIndex]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      setOpen(false);
      setQuery("");
      requestAnimationFrame(() => {
        document.querySelector(item.href)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    [],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) =>
          results.length ? (i + 1) % results.length : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) =>
          results.length ? (i - 1 + results.length) % results.length : 0,
        );
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [results, selectedIndex, handleSelect],
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="spotlight-backdrop"
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" as const }}
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div
            key="spotlight-container"
            className="fixed inset-0 z-[70] flex items-start justify-center pt-[20vh] px-4 pointer-events-none"
          >
            <motion.div
              className={cn(
                "relative card-noise rounded-lg overflow-hidden",
                "bg-card border border-border",
                "w-full max-w-xl shadow-2xl shadow-black/80",
                "pointer-events-auto",
              )}
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <Search className="h-4 w-4 text-text-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search experience, projects, skills..."
                  className={cn(
                    "w-full py-3 bg-transparent outline-none",
                    "text-sm text-text-primary placeholder:text-text-muted",
                    "font-mono caret-accent",
                  )}
                />
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-border font-mono text-[10px] text-text-muted">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[40vh] overflow-y-auto py-2"
                onMouseMove={() => { mouseMovedRef.current = true; }}
              >
                {results.length === 0 && query.trim() && (
                  <p className="px-4 py-8 text-center font-mono text-xs text-text-muted">
                    {"No results for \""}{query}{"\""}
                  </p>
                )}

                {Array.from(grouped.entries()).map(([category, items]) => {
                  const meta = categoryMeta[category];
                  const Icon = meta.icon;
                  return (
                    <div key={category}>
                      <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                        <Icon className="h-3 w-3 text-text-muted" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                          {meta.label}
                        </span>
                      </div>
                      {items.map((item) => {
                        const globalIdx = results.indexOf(item);
                        return (
                          <button
                            key={item.id}
                            data-index={globalIdx}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => { if (mouseMovedRef.current) setSelectedIndex(globalIdx); }}
                            className={cn(
                              "w-full text-left px-4 py-2 flex items-center gap-3",
                              "transition-colors duration-100",
                              globalIdx === selectedIndex
                                ? "bg-card-hover"
                                : "hover:bg-card-hover/50",
                            )}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-text-primary truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-text-muted font-mono truncate">
                                {item.subtitle}
                              </p>
                            </div>
                            {globalIdx === selectedIndex && (
                              <span className="ml-auto shrink-0 font-mono text-[10px] text-text-muted">
                                {"ENTER"}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border">
                <span className="font-mono text-[10px] text-text-muted">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-2 font-mono text-[10px] text-text-muted">
                  <span>Navigate</span>
                  <kbd className="px-1 py-0.5 rounded border border-border">
                    {"↑↓"}
                  </kbd>
                  <span>Select</span>
                  <kbd className="px-1 py-0.5 rounded border border-border">
                    {"↵"}
                  </kbd>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
