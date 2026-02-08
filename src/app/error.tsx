"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-red-500 mb-4">
        {"[ SYSTEM_FAULT ]"}
      </p>
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-text-muted mb-6 max-w-md">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="font-mono text-sm uppercase tracking-widest px-6 py-2.5 rounded-lg border border-accent text-accent font-bold transition-all duration-150 hover:bg-accent/10 cursor-pointer"
      >
        {"[ RETRY ]"}
      </button>
    </div>
  );
}
