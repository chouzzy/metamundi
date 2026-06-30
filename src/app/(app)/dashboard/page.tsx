import Link from "next/link";
import {
  ArrowRight,
  Coins,
  Gauge,
  MessageCircle,
  Plane,
  ReceiptText,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatTile } from "@/components/ui/Bento";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AirlineBadge } from "@/components/ui/AirlineBadge";
import { getConversations, getDashboard, getQuotes } from "@/lib/data";
import { AIRLINES, QUOTES, QUOTE_ORDER } from "@/lib/mock-data";
import { formatBRL, formatMiles } from "@/lib/utils";

export default function DashboardPage() {
  const stats = getDashboard();
  const quotes = getQuotes();
  const conversations = getConversations();

  // Companhias mais cotadas (derivado das opções)
  const tally: Record<string, number> = {};
  for (const id of QUOTE_ORDER) {
    for (const o of QUOTES[id].options) tally[o.airline] = (tally[o.airline] ?? 0) + 1;
  }
  const topAirlines = Object.entries(tally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxTally = Math.max(...topAirlines.map(([, n]) => n));

  return (
    <>
      <PageHeader
        eyebrow="Visão geral"
        title="Olá, Metamundi 👋"
        subtitle="Acompanhe as cotações da operação e o que está chegando pelo WhatsApp."
        action={
          <Link
            href="/nova"
            className="flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-[14px] font-bold text-white shadow-[0_12px_26px_-12px_rgba(124,58,237,0.7)] transition hover:brightness-105"
          >
            <Sparkles className="h-4 w-4" /> Nova cotação
          </Link>
        }
      />

      <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* HERO — velocidade */}
        <div className="anim-up relative col-span-1 row-span-2 overflow-hidden rounded-[20px] gradient-night p-6 text-white sm:col-span-2">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/30 blur-3xl" />
          <Plane className="anim-float pointer-events-none absolute right-6 top-6 h-7 w-7 text-white/40" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold">
              <Gauge className="h-3.5 w-3.5 text-brand-300" /> Tempo médio de cotação
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-[64px] font-extrabold leading-none tracking-tight">{stats.avgTimeSec}s</span>
              <span className="mb-2 text-[15px] font-bold text-white/50 line-through">~45 min manual</span>
            </div>
            <p className="mt-3 max-w-sm text-[14px] font-medium leading-relaxed text-white/70">
              A IA interpreta o pedido e busca dinheiro + milhas em todas as companhias automaticamente.
              É o tempo de cotação caindo <span className="font-bold text-white">{stats.avgTimeTrend}</span>.
            </p>

            <div className="mt-6 flex items-end gap-1.5">
              {[40, 70, 55, 90, 65, 100, 80, 95, 60, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-brand-400/30 to-cyan-300/80"
                  style={{ height: `${h * 0.5}px` }}
                />
              ))}
            </div>

            <Link
              href="/nova"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[14px] font-bold text-ink transition hover:bg-white/90"
            >
              Iniciar nova cotação <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="anim-up anim-up-1">
          <StatTile
            icon={<ReceiptText className="h-5 w-5" />}
            value={String(stats.quotesMonth)}
            label="Cotações no mês"
            trend={stats.quotesTrend}
            gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
          />
        </div>
        <div className="anim-up anim-up-2">
          <StatTile
            icon={<Target className="h-5 w-5" />}
            value={`${stats.conversionRate}%`}
            label="Taxa de conversão"
            trend="+4pp"
            gradient="linear-gradient(135deg,#06b6d4,#0ea5e9)"
          />
        </div>
        <div className="anim-up anim-up-2">
          <StatTile
            icon={<TrendingUp className="h-5 w-5" />}
            value={String(stats.bookings)}
            label="Reservas fechadas"
            trend={stats.bookingsTrend}
            gradient="linear-gradient(135deg,#16a34a,#22c55e)"
          />
        </div>
        <div className="anim-up anim-up-3">
          <StatTile
            icon={<Coins className="h-5 w-5" />}
            value={stats.milesSaved}
            label="Milhas economizadas"
            trend="milhas"
            trendTone="neutral"
            gradient="linear-gradient(135deg,#d97706,#f59e0b)"
          />
        </div>

        {/* Cotações recentes */}
        <div className="anim-up anim-up-3 card col-span-1 row-span-2 overflow-hidden p-0 sm:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="text-[15px] font-extrabold text-ink">Cotações recentes</h3>
            <Link href="/cotacoes" className="text-[12.5px] font-bold text-brand-600 hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-line">
            {quotes.slice(0, 5).map((q) => (
              <Link
                key={q.id}
                href={`/cotacoes/${q.id}`}
                className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-slate-50/70"
              >
                <div className="grid h-10 w-10 flex-none place-items-center rounded-xl gradient-brand text-white">
                  <Plane className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-extrabold text-ink">
                      {q.request.origin} → {q.request.destination}
                    </span>
                    <span className="hidden text-[12px] font-semibold text-slate-400 sm:inline">
                      {q.request.originCity} · {q.request.destinationCity}
                    </span>
                  </div>
                  <div className="text-[12px] font-semibold text-slate-400">
                    {q.client} · {q.createdAt}
                  </div>
                </div>
                <div className="hidden text-right md:block">
                  <div className="text-[14px] font-extrabold text-ink">{formatBRL(q.bestCash)}</div>
                  <div className="text-[11.5px] font-bold text-amber-600">ou {formatMiles(q.bestMiles)} mi</div>
                </div>
                <StatusBadge status={q.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* WhatsApp ao vivo */}
        <div className="anim-up anim-up-4 card col-span-1 row-span-2 overflow-hidden p-0 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-ink">
              <MessageCircle className="h-4 w-4 text-emerald-500" /> WhatsApp
            </h3>
            <Link href="/conversas" className="text-[12.5px] font-bold text-brand-600 hover:underline">
              Abrir →
            </Link>
          </div>
          <div className="divide-y divide-line">
            {conversations.slice(0, 4).map((c) => (
              <Link key={c.id} href="/conversas" className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50/70">
                <div
                  className="grid h-9 w-9 flex-none place-items-center rounded-full text-[12px] font-extrabold text-white"
                  style={{ backgroundImage: c.avatarColor }}
                >
                  {c.agency.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold text-ink">{c.agency}</div>
                  <div className="truncate text-[11.5px] font-medium text-slate-400">{c.lastMessage}</div>
                </div>
                {c.unread > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-extrabold text-white">
                    {c.unread}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Companhias mais cotadas */}
        <div className="anim-up anim-up-5 card col-span-1 p-5 sm:col-span-2">
          <h3 className="text-[15px] font-extrabold text-ink">Companhias mais cotadas</h3>
          <div className="mt-4 space-y-3">
            {topAirlines.map(([code, n]) => (
              <div key={code} className="flex items-center gap-3">
                <div className="w-20 flex-none">
                  <AirlineBadge code={code} size="sm" />
                </div>
                <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ width: `${(n / maxTally) * 100}%`, backgroundImage: AIRLINES[code].gradient }}
                  />
                </div>
                <span className="w-8 text-right text-[13px] font-extrabold text-ink-soft">{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Como funciona */}
        <div className="anim-up anim-up-6 card col-span-1 p-5 sm:col-span-2">
          <h3 className="text-[15px] font-extrabold text-ink">Como a cotação acontece</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { n: "1", t: "Pedido no WhatsApp", d: "Texto livre da agência", c: "from-emerald-500 to-green-500" },
              { n: "2", t: "IA interpreta", d: "Vira pedido estruturado", c: "from-brand-500 to-violet-500" },
              { n: "3", t: "Busca multi-fonte", d: "Dinheiro + milhas, por cia", c: "from-cyan-500 to-sky-500" },
              { n: "4", t: "Cotação pronta", d: "Agência escolhe e envia", c: "from-amber-500 to-orange-500" },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-line bg-slate-50/60 p-3.5">
                <div className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${s.c} text-[13px] font-extrabold text-white`}>
                  {s.n}
                </div>
                <div className="mt-2.5 text-[13px] font-extrabold text-ink">{s.t}</div>
                <div className="text-[11.5px] font-medium text-slate-400">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
