"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <h2>Something went wrong</h2>
      <p>The page could not be displayed. You can try loading it again.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
