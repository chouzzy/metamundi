export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2 flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-brand-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 ring-soft" />
            {eyebrow}
          </div>
        )}
        <h1 className="text-[26px] font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-[14px] font-medium text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
