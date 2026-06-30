import Link from "next/link";
import { ArrowRight, Coins, Plane, Users, Wallet } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getQuotes } from "@/lib/data";
import { formatBRL, formatMiles, paxLabel } from "@/lib/utils";

export default function CotacoesPage() {
  const quotes = getQuotes();

  return (
    <>
      <PageHeader
        eyebrow="Histórico"
        title="Cotações"
        subtitle="Todas as cotações geradas para as agências. Clique para abrir o comparativo completo."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {quotes.map((q, i) => (
          <Link
            key={q.id}
            href={`/cotacoes/${q.id}`}
            className={`card card-hover anim-up flex flex-col gap-4 p-5 anim-up-${Math.min(i + 1, 6)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-xl gradient-brand text-white">
                  <Plane className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[16px] font-extrabold text-ink">
                    {q.request.origin} <ArrowRight className="h-3.5 w-3.5 text-slate-300" /> {q.request.destination}
                  </div>
                  <div className="text-[12px] font-semibold text-slate-400">
                    {q.request.originCity} → {q.request.destinationCity}
                  </div>
                </div>
              </div>
              <StatusBadge status={q.status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] font-semibold text-slate-500">
              <span>📅 {q.request.departDate} – {q.request.returnDate ?? "—"}</span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {paxLabel(q.request.passengers)}
              </span>
              <span className="text-slate-400">· {q.client}</span>
            </div>

            <div className="flex items-end justify-between border-t border-line pt-4">
              <div className="flex gap-5">
                <div>
                  <div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
                    <Wallet className="h-3 w-3" /> A partir de
                  </div>
                  <div className="text-[18px] font-extrabold text-ink">{formatBRL(q.bestCash)}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wide text-amber-600">
                    <Coins className="h-3 w-3" /> Em milhas
                  </div>
                  <div className="text-[18px] font-extrabold text-amber-600">{formatMiles(q.bestMiles)} mi</div>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[12.5px] font-bold text-brand-600">
                {q.optionsCount} opções <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
