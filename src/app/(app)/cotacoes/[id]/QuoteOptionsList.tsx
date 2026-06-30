"use client";

import { useMemo, useState } from "react";
import { Filter, Plane } from "lucide-react";
import type { QuoteOption } from "@/lib/types";
import { QuoteOptionCard } from "@/components/quote/QuoteOptionCard";
import { cn } from "@/lib/utils";

type SortMode = "recomendadas" | "preco" | "milhas" | "rapido";

const SORTS: { key: SortMode; label: string }[] = [
  { key: "recomendadas", label: "Recomendadas" },
  { key: "preco", label: "Menor preço" },
  { key: "milhas", label: "Menos milhas" },
  { key: "rapido", label: "Mais rápidas" },
];

export function QuoteOptionsList({
  options,
  bestCashId,
  bestMilesId,
}: {
  options: QuoteOption[];
  bestCashId: string;
  bestMilesId: string;
}) {
  const [sort, setSort] = useState<SortMode>("recomendadas");

  const maxCash = Math.max(...options.map((o) => o.cashPrice));
  const maxMiles = Math.max(...options.map((o) => o.miles.miles));

  const sorted = useMemo(() => {
    const arr = [...options];
    switch (sort) {
      case "preco":
        return arr.sort((a, b) => a.cashPrice - b.cashPrice);
      case "milhas":
        return arr.sort((a, b) => a.miles.miles - b.miles.miles);
      case "rapido":
        return arr.sort((a, b) => a.outbound.durationMin - b.outbound.durationMin);
      default:
        // score combinado (dinheiro + milhas normalizados)
        return arr.sort(
          (a, b) =>
            a.cashPrice / maxCash + a.miles.miles / maxMiles - (b.cashPrice / maxCash + b.miles.miles / maxMiles),
        );
    }
  }, [options, sort, maxCash, maxMiles]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition",
                sort === s.key ? "bg-white text-brand-600 shadow-sm" : "text-ink-soft hover:text-ink",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="hidden items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-[12px] font-bold text-ink-soft shadow-sm sm:flex">
          <Filter className="h-3.5 w-3.5 text-slate-400" /> {options.length} opções
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-[12px] font-bold text-ink-soft shadow-sm">
          <Plane className="h-3.5 w-3.5 text-slate-400" /> Todas as cias
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sorted.map((o) => (
          <QuoteOptionCard key={o.id} option={o} bestCash={o.id === bestCashId} bestMiles={o.id === bestMilesId} />
        ))}
      </div>
    </div>
  );
}
