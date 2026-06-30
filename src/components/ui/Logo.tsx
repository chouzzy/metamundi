import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-[14px] gradient-brand shadow-[0_8px_22px_-6px_rgba(124,58,237,0.6)]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none">
        <path
          d="M3.5 13.5l16.5-6.5c.9-.35 1.7.6 1.25 1.45l-7.6 13.8c-.45.8-1.65.6-1.8-.3l-1.05-5.4-5.4-1.05c-.9-.15-1.1-1.35-.3-1.8z"
          fill="#fff"
        />
        <circle cx="12" cy="12" r="1.5" fill="#7c3aed" />
      </svg>
    </div>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <LogoMark className="h-10 w-10" />
      {!compact && (
        <div className="leading-tight">
          <div className="text-[18px] font-extrabold tracking-tight text-ink">
            Meta<span className="text-brand-600">mundi</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Cotação inteligente
          </div>
        </div>
      )}
    </div>
  );
}
