"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Loader2,
  MessageSquareText,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { InterpretedChips } from "@/components/ui/InterpretedChips";
import { AirlineBadge } from "@/components/ui/AirlineBadge";
import type { QuoteRequest } from "@/lib/types";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  "Preciso de passagem SP → Miami, ida 10/dez, volta 20/dez, 1 adulto, cliente prefere voo direto",
  "Casal Rio → Lisboa, 05 a 19 de janeiro, melhor custo-benefício",
  "Família 2 adultos e 1 criança, São Paulo → Nova York, 18 a 28/dez, voo direto",
  "Executivo Brasília → Santiago, 12 a 15/dez, classe executiva, horário flexível",
];

type Status = "idle" | "interpreting" | "interpreted" | "searching";

export default function NovaCotacaoPage() {
  const router = useRouter();
  const [text, setText] = useState(EXAMPLES[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [request, setRequest] = useState<QuoteRequest | null>(null);

  async function handleInterpret() {
    if (!text.trim()) return;
    setStatus("interpreting");
    setRequest(null);
    const res = await fetch("/api/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then((r) => r.json());
    // pequena pausa para sensação de "lendo"
    await new Promise((r) => setTimeout(r, 650));
    setRequest(res.request);
    setStatus("interpreted");
  }

  async function handleGenerate() {
    if (!request) return;
    setStatus("searching");
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request }),
    }).then((r) => r.json());
    await new Promise((r) => setTimeout(r, 1700));
    router.push(`/cotacoes/${res.quoteId}`);
  }

  const busy = status === "interpreting" || status === "searching";

  return (
    <>
      <PageHeader
        eyebrow="Nova cotação"
        title="Cole o pedido e deixe a IA trabalhar"
        subtitle="Mesmo texto que a agência mandaria no WhatsApp. A IA estrutura e busca dinheiro + milhas em todas as companhias."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Input */}
        <div className="card p-6">
          <div className="flex items-center gap-2 text-[13px] font-extrabold text-ink">
            <MessageSquareText className="h-4 w-4 text-emerald-500" /> Pedido em texto livre
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Ex: Preciso de passagem SP → Miami, ida 10/dez, volta 20/dez, 1 adulto, voo direto"
            className="mt-3 w-full resize-none rounded-2xl border border-line bg-slate-50/50 p-4 text-[14px] font-medium leading-relaxed text-ink outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />

          <div className="mt-3">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Exemplos rápidos</div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setText(ex);
                    setStatus("idle");
                    setRequest(null);
                  }}
                  className="max-w-full truncate rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
                >
                  {ex.split(",")[0]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleInterpret}
            disabled={busy}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl gradient-brand py-3.5 text-[14.5px] font-bold text-white shadow-[0_14px_30px_-12px_rgba(124,58,237,0.8)] transition hover:brightness-105 disabled:opacity-70"
          >
            {status === "interpreting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Interpretando…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" /> Interpretar com IA
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="card flex flex-col p-6">
          <div className="flex items-center gap-2 text-[13px] font-extrabold text-ink">
            <Sparkles className="h-4 w-4 text-brand-500" /> Leitura da IA
          </div>

          {status === "idle" && (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500">
                <Wand2 className="h-6 w-6" />
              </div>
              <p className="mt-4 max-w-[240px] text-[13.5px] font-medium text-slate-400">
                O pedido estruturado aparece aqui assim que você clicar em <b className="text-ink-soft">Interpretar</b>.
              </p>
            </div>
          )}

          {status === "interpreting" && (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
              <p className="mt-4 text-[13.5px] font-semibold text-slate-500">Extraindo origem, destino, datas e perfil…</p>
            </div>
          )}

          {(status === "interpreted" || status === "searching") && request && (
            <div className="anim-up mt-4 flex flex-1 flex-col">
              <div className="rounded-2xl border border-line bg-slate-50/50 p-4">
                <InterpretedChips request={request} />
              </div>

              {status === "searching" ? (
                <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-brand-700">
                    <Search className="h-4 w-4 animate-pulse" /> Buscando as melhores tarifas…
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["LA", "AA", "CM", "G3", "AD", "UA"].map((c, i) => (
                      <div key={c} className="anim-up" style={{ animationDelay: `${i * 0.12}s` }}>
                        <AirlineBadge code={c} size="sm" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                    <div className="h-full w-1/3 rounded-full gradient-brand shimmer" />
                  </div>
                </div>
              ) : (
                <div className="mt-auto pt-5">
                  <div className="mb-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-[12.5px] font-bold text-emerald-700">
                    <Check className="h-4 w-4" strokeWidth={3} /> Pedido entendido com 97% de confiança
                  </div>
                  <button
                    onClick={handleGenerate}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3.5 text-[14.5px] font-bold text-white transition hover:bg-brand-600"
                  >
                    Gerar cotação <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pipeline hint */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { n: "1", t: "Pedido recebido", c: "from-emerald-500 to-green-500" },
          { n: "2", t: "IA interpreta", c: "from-brand-500 to-violet-500" },
          { n: "3", t: "Busca dinheiro + milhas", c: "from-cyan-500 to-sky-500" },
          { n: "4", t: "Cotação estruturada", c: "from-amber-500 to-orange-500" },
        ].map((s, i) => (
          <div key={s.n} className={cn("card flex items-center gap-3 p-3.5", status !== "idle" && i === 0 && "ring-2 ring-emerald-300")}>
            <div className={cn("grid h-8 w-8 flex-none place-items-center rounded-lg bg-gradient-to-br text-[13px] font-extrabold text-white", s.c)}>
              {s.n}
            </div>
            <span className="text-[12.5px] font-bold text-ink-soft">{s.t}</span>
          </div>
        ))}
      </div>
    </>
  );
}
