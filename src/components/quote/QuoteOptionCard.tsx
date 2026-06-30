"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Check,
  Coins,
  Crown,
  Luggage,
  Send,
  Wallet,
} from "lucide-react";
import type { QuoteOption } from "@/lib/types";
import { getAirline } from "@/lib/mock-data";
import { AirlineBadge } from "@/components/ui/AirlineBadge";
import { FlightTimeline } from "@/components/ui/FlightTimeline";
import { cn, formatBRL, formatMiles } from "@/lib/utils";

export function QuoteOptionCard({
  option,
  bestCash,
  bestMiles,
}: {
  option: QuoteOption;
  bestCash: boolean;
  bestMiles: boolean;
}) {
  const [sent, setSent] = useState(false);
  const airline = getAirline(option.airline);
  const direct = option.outbound.stops === 0 && option.inbound.stops === 0;

  return (
    <div
      className={cn(
        "card relative grid grid-cols-1 gap-5 p-5 transition lg:grid-cols-[1.4fr_1fr] lg:p-6",
        bestCash && "ring-2 ring-emerald-400/60",
        !bestCash && bestMiles && "ring-2 ring-amber-400/50",
      )}
    >
      {/* tags */}
      {(bestCash || bestMiles) && (
        <div className="absolute -top-px left-5 flex gap-1.5">
          {bestCash && (
            <span className="flex items-center gap-1 rounded-b-lg bg-gradient-to-br from-emerald-600 to-green-500 px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-white shadow-md">
              <Crown className="h-3 w-3" /> Melhor preço
            </span>
          )}
          {bestMiles && (
            <span className="flex items-center gap-1 rounded-b-lg bg-gradient-to-br from-amber-600 to-amber-400 px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-white shadow-md">
              <Coins className="h-3 w-3" /> Melhor em milhas
            </span>
          )}
        </div>
      )}

      {/* left: airline + legs */}
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex items-center justify-between">
          <AirlineBadge code={option.airline} size="lg" withName />
          {direct && (
            <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600">
              <BadgeCheck className="h-3.5 w-3.5" /> Direto
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-slate-50/50 p-3.5">
          <FlightTimeline segment={option.outbound} direction="ida" />
          <div className="h-px bg-line" />
          <FlightTimeline segment={option.inbound} direction="volta" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
            <Luggage className="h-3.5 w-3.5" /> {option.baggage}
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1">{option.cabin}</span>
          <span
            className={cn(
              "rounded-md px-2 py-1",
              option.refundable ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500",
            )}
          >
            {option.refundable ? "Reembolsável" : "Não reembolsável"}
          </span>
        </div>
      </div>

      {/* right: pricing */}
      <div className="flex flex-col gap-3 border-line lg:border-l lg:pl-6">
        <div className="grid grid-cols-2 gap-3">
          {/* cash */}
          <div className="rounded-2xl border border-line bg-slate-50/60 p-3.5">
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-slate-400">
              <Wallet className="h-3.5 w-3.5" /> Em dinheiro
            </div>
            <div className="mt-1.5 text-[22px] font-extrabold leading-none tracking-tight text-ink">
              {formatBRL(option.cashPrice)}
            </div>
            <div className="mt-1 text-[11px] font-semibold text-slate-400">total · ida e volta</div>
          </div>

          {/* miles */}
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/60 p-3.5">
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-amber-700">
              <Coins className="h-3.5 w-3.5" /> Em milhas
            </div>
            <div className="mt-1.5 text-[19px] font-extrabold leading-none tracking-tight text-amber-700">
              {formatMiles(option.miles.miles)} <span className="text-[12px] font-bold">mi</span>
            </div>
            <div className="mt-1 text-[11px] font-semibold text-amber-700/80">
              + {formatBRL(option.miles.taxes)} taxas
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-card px-2 py-1 text-[10.5px] font-extrabold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: airline.color }} />
              {option.miles.program}
            </div>
          </div>
        </div>

        <button
          onClick={() => setSent(true)}
          className={cn(
            "mt-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[13.5px] font-bold text-white transition",
            sent
              ? "bg-emerald-500"
              : bestCash
                ? "bg-gradient-to-br from-emerald-600 to-green-500 hover:brightness-105"
                : "bg-ink hover:bg-brand-600",
          )}
        >
          {sent ? (
            <>
              <Check className="h-4 w-4" strokeWidth={3} /> Enviado ao cliente
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Selecionar e enviar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
