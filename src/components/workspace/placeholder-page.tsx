export function PlaceholderPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="text-center">
        <h1 className="font-display text-2xl text-charcoal sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-warm-gray">{subtitle}</p> : null}
      </div>
    </section>
  );
}
