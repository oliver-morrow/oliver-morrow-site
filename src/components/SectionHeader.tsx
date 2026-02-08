export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-text-primary uppercase">
        {title}
      </h2>
      <div className="mt-4 h-px w-16 bg-border" />
    </div>
  );
}
