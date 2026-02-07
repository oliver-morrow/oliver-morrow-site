"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface ExpandableCardProps {
  id: string;
  className?: string;
  collapsedContent: ReactNode;
  expandedContent: ReactNode;
}

export default function ExpandableCard({
  id,
  className,
  collapsedContent,
  expandedContent,
}: ExpandableCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useBodyScrollLock(isOpen);

  // Client-only portal guard
  useEffect(() => setMounted(true), []);

  // ESC key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Collapsed card — in-flow */}
      <motion.div
        layoutId={`card-${id}`}
        onClick={() => setIsOpen(true)}
        className={cn("cursor-pointer", className)}
        style={{ borderRadius: 8 }}
      >
        <motion.div layout="position">{collapsedContent}</motion.div>
      </motion.div>

      {/* Expanded card — portal to body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  key={`backdrop-${id}`}
                  className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[4px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" as const }}
                  onClick={() => setIsOpen(false)}
                />

                {/* Expanded card */}
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
                  <motion.div
                    layoutId={`card-${id}`}
                    className={cn(
                      "relative card-noise rounded-lg",
                      "bg-card border border-border",
                      "w-full max-w-2xl max-h-[80vh] overflow-y-auto",
                      "pointer-events-auto",
                    )}
                    style={{ borderRadius: 8 }}
                  >
                    {/* Close button */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "absolute top-4 right-4 z-10 p-1.5 rounded",
                        "text-text-muted hover:text-accent",
                        "transition-colors duration-200",
                      )}
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <motion.div layout="position" className="p-6">
                      {expandedContent}
                    </motion.div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
