import type { QuoteStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const MAP: Record<QuoteStatus, { label: string; cls: string; dot: string }> = {
  interpretando: { label: "Interpretando", cls: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  cotado: { label: "Cotado", cls: "bg-brand-50 text-brand-700", dot: "bg-brand-500" },
  enviado: { label: "Enviado", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  reservado: { label: "Reservado", cls: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
};

export function StatusBadge({ status }: { status: QuoteStatus }) {
  const s = MAP[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold", s.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
