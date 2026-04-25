export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <p className="font-mono text-xs uppercase tracking-widest text-accent animate-pulse">
        {"[ LOADING... ]"}
      </p>
    </div>
  );
}
