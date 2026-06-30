import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Plane,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { getQuote } from "@/lib/data";
import { InterpretedChips } from "@/components/ui/InterpretedChips";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { paxLabel } from "@/lib/utils";
import { QuoteOptionsList } from "./QuoteOptionsList";

export default async function CotacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = getQuote(id);
  if (!quote) notFound();

  const r = quote.request;
  const bestCashId = quote.options.reduce((m, o) => (o.cashPrice < m.cashPrice ? o : m)).id;
  const bestMilesId = quote.options.reduce((m, o) => (o.miles.miles < m.miles.miles ? o : m)).id;

  return (
    <>
      <Link
        href="/cotacoes"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 transition hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Cotações
      </Link>

      {/* Summary */}
      <div className="relative overflow-hidden rounded-[22px] gradient-night p-6 text-white sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          {/* route */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[28px] font-extrabold leading-none tracking-tight">{r.origin}</div>
              <div className="mt-1 text-[11.5px] font-semibold text-white/60">{r.originCity}</div>
            </div>
            <div className="flex flex-col items-center gap-1 text-white/70">
              <Plane className="h-4 w-4" />
              <div className="h-px w-16 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.5)_0_5px,transparent_5px_10px)]" />
              <span className="text-[10px] font-semibold">ida e volta</span>
            </div>
            <div className="text-center">
              <div className="text-[28px] font-extrabold leading-none tracking-tight">{r.destination}</div>
              <div className="mt-1 text-[11.5px] font-semibold text-white/60">{r.destinationCity}</div>
            </div>
          </div>

          {/* meta */}
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            <Meta icon={<CalendarDays className="h-3.5 w-3.5" />} label="Período" value={`${r.departDate} → ${r.returnDate ?? "—"}`} />
            <Meta icon={<Users className="h-3.5 w-3.5" />} label="Passageiros" value={paxLabel(r.passengers)} />
            <Meta icon={<Star className="h-3.5 w-3.5" />} label="Preferência" value={r.preference} />
          </div>

          {/* stat */}
          <div className="ml-auto text-right">
            <div className="bg-gradient-to-r from-brand-300 to-cyan-300 bg-clip-text text-[30px] font-extrabold leading-none tracking-tight text-transparent">
              {quote.optionsCount} opções
            </div>
            <div className="mt-1 flex items-center justify-end gap-1.5 text-[11.5px] font-semibold text-white/60">
              <Sparkles className="h-3 w-3" /> busca em {(quote.searchMs / 1000).toFixed(1)}s
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2.5">
            <StatusBadge status={quote.status} />
            <span className="text-[13px] font-semibold text-white/70">
              {quote.client} · {quote.agency}
            </span>
          </div>
          <Link
            href="/conversas"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-white/80 transition hover:text-white"
          >
            Ver conversa no WhatsApp <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Interpreted request */}
      <div className="mt-4 rounded-2xl border border-line bg-white p-4">
        <InterpretedChips request={r} />
      </div>

      {/* Options */}
      <div className="mt-6">
        <QuoteOptionsList options={quote.options} bestCashId={bestCashId} bestMilesId={bestMilesId} />
      </div>

      <p className="mt-7 text-center text-[12px] font-semibold text-slate-400">
        Preços e disponibilidade ilustrativos · dados fictícios para demonstração
      </p>
    </>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wide text-white/50">
        {icon} {label}
      </div>
      <div className="mt-1 text-[14px] font-bold">{value}</div>
    </div>
  );
}
