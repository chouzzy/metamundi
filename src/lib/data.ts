import {
  AIRPORTS,
  CONVERSATIONS,
  DASHBOARD,
  QUOTE_ORDER,
  QUOTES,
} from "./mock-data";
import { decodeLiveId, searchLiveQuote } from "./flights-api";
import type {
  Conversation,
  DashboardStats,
  Quote,
  QuoteRequest,
  QuoteSummary,
} from "./types";

// ============================================================
// Camada de acesso a dados (DAL)
// -----------------------------------------------------------
// Hoje devolve dados mockados. É AQUI que os devs da Metamundi
// trocam por: motor de busca de tarifas, APIs das companhias,
// programas de milhas, etc. As rotas de /api e as páginas
// consomem exclusivamente estas funções.
// ============================================================

const toSummary = (q: Quote): QuoteSummary => ({
  id: q.id,
  request: q.request,
  client: q.client,
  agency: q.agency,
  status: q.status,
  bestCash: q.bestCash,
  bestMiles: q.bestMiles,
  optionsCount: q.optionsCount,
  createdAt: q.createdAt,
});

export function getQuotes(): QuoteSummary[] {
  return QUOTE_ORDER.map((id) => toSummary(QUOTES[id]));
}

export async function getQuote(id: string): Promise<Quote | null> {
  // IDs "ao vivo" (live_...) carregam o pedido e disparam a busca real.
  if (id.startsWith("live_")) {
    const request = decodeLiveId(id);
    if (request) {
      const live = await searchLiveQuote(request);
      if (live) return live;
      // Fallback: usa a cotação mock da rota, sinalizada como exemplo.
      const fallback = QUOTES[getQuoteIdForRoute(request.origin, request.destination)];
      if (fallback) return { ...fallback, source: "mock" };
    }
    return null;
  }
  return QUOTES[id] ? { ...QUOTES[id], source: "mock" } : null;
}

export function getConversations(): Conversation[] {
  return CONVERSATIONS;
}

export function getConversation(id: string): Conversation | null {
  return CONVERSATIONS.find((c) => c.id === id) ?? null;
}

export function getDashboard(): DashboardStats {
  return DASHBOARD;
}

/** Encontra a cotação existente para uma rota (origem/destino). */
export function getQuoteIdForRoute(origin: string, destination: string): string {
  const found = QUOTE_ORDER.find((id) => {
    const r = QUOTES[id].request;
    return r.origin === origin && r.destination === destination;
  });
  return found ?? "q-001";
}

// ============================================================
// "IA" de interpretação do pedido (NLU heurística)
// -----------------------------------------------------------
// Recebe o texto livre do WhatsApp e devolve um QuoteRequest
// estruturado. No produto real, isto vira uma chamada a um LLM
// (ex.: Claude) com extração de entidades. A forma de saída é
// a mesma — então a troca é transparente para o resto do app.
// ============================================================

const MONTHS: Record<string, string> = {
  jan: "01", fev: "02", mar: "03", abr: "04", mai: "05", jun: "06",
  jul: "07", ago: "08", set: "09", out: "10", nov: "11", dez: "12",
};

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findAirports(text: string): string[] {
  const lower = text.toLowerCase();
  const hits: { code: string; idx: number }[] = [];
  for (const [code, info] of Object.entries(AIRPORTS)) {
    let best = -1;
    for (const alias of info.codes) {
      const re = new RegExp(`(^|[^a-z])${escapeRe(alias)}([^a-z]|$)`, "i");
      const m = lower.match(re);
      if (m && m.index !== undefined) best = best < 0 ? m.index : Math.min(best, m.index);
    }
    if (best >= 0) hits.push({ code, idx: best });
  }
  hits.sort((a, b) => a.idx - b.idx);
  return hits.map((h) => h.code);
}

function parseDates(text: string): string[] {
  const lower = text.toLowerCase();
  const found: { idx: number; value: string }[] = [];

  // dd/mm
  for (const m of lower.matchAll(/(\d{1,2})\s*\/\s*(\d{1,2})\b/g)) {
    found.push({ idx: m.index ?? 0, value: `${m[1].padStart(2, "0")}/${m[2].padStart(2, "0")}` });
  }
  // dd/mês ou dd de mês  (ex.: 10/dez, 5 de janeiro)
  for (const m of lower.matchAll(/(\d{1,2})\s*(?:\/|\s+de\s+|\s+)\s*(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\w*/g)) {
    found.push({ idx: m.index ?? 0, value: `${m[1].padStart(2, "0")}/${MONTHS[m[2]]}` });
  }

  found.sort((a, b) => a.idx - b.idx);
  const seen = new Set<string>();
  return found.filter((d) => (seen.has(d.value) ? false : (seen.add(d.value), true))).map((d) => d.value);
}

function matchNum(text: string, re: RegExp): number | null {
  const m = text.toLowerCase().match(re);
  return m ? parseInt(m[1], 10) : null;
}

export function interpret(text: string): QuoteRequest {
  const lower = text.toLowerCase();
  const airports = findAirports(text);
  const origin = airports[0] ?? "GRU";
  const destination = airports[1] ?? (origin === "MIA" ? "GRU" : "MIA");

  const dates = parseDates(text);

  let adults = matchNum(text, /(\d+)\s*adult/) ?? 0;
  const children = matchNum(text, /(\d+)\s*(?:crian|child)/) ?? 0;
  const infants = matchNum(text, /(\d+)\s*(?:beb[êe]|infant|colo)/) ?? 0;
  if (/\bcasal\b/.test(lower)) adults = Math.max(adults, 2);
  if (adults === 0) adults = 1;

  let cabin = "Econômica";
  if (/executiv|business|classe c\b/.test(lower)) cabin = "Executiva";
  else if (/premium/.test(lower)) cabin = "Premium Economy";

  let preference = "Mais opções";
  if (/direto|sem escala|sem conex/.test(lower)) preference = "Voo direto";
  else if (/barat|custo|econ[oô]m|menor pre[çc]o/.test(lower)) preference = "Melhor custo-benefício";
  else if (/r[áa]pid|menor tempo/.test(lower)) preference = "Mais rápido";
  else if (/milhas?\b/.test(lower)) preference = "Foco em milhas";

  return {
    origin,
    originCity: AIRPORTS[origin]?.city ?? origin,
    destination,
    destinationCity: AIRPORTS[destination]?.city ?? destination,
    departDate: dates[0] ?? "10/12",
    returnDate: dates[1],
    passengers: { adults, children, infants },
    cabin,
    preference,
  };
}
