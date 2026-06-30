import type { FlightSegment, Quote, QuoteOption, QuoteRequest } from "./types";

// ============================================================
// Integração real — Travelpayouts (Aviasales Data API)
// -----------------------------------------------------------
// Busca preços REAIS (cacheados) de passagens por rota/data, em BRL.
// Doc: https://travelpayouts.com/developers  (endpoint prices_for_dates v3)
//
// Requer um token gratuito (conta Travelpayouts) em:
//   TRAVELPAYOUTS_TOKEN  -> .env.local  (ou Vars da Vercel)
//
// Se o token não existir ou a API falhar, retorna null e o app cai
// automaticamente nos dados mock — nunca quebra.
//
// Observação: não existe API pública gratuita de MILHAS; o valor em
// milhas é ESTIMADO a partir do preço em dinheiro (ver estimateMiles).
// ============================================================

const ENDPOINT = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";

export function isLiveEnabled(): boolean {
  return !!process.env.TRAVELPAYOUTS_TOKEN;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "10/12" -> "2026-12-10" (próxima ocorrência futura). */
function toISODate(ddmm: string): string {
  const [dd, mm] = ddmm.split("/").map((x) => parseInt(x, 10));
  const now = new Date();
  let year = now.getFullYear();
  const candidate = new Date(year, (mm || 1) - 1, dd || 1);
  if (candidate.getTime() < now.getTime() - 86_400_000) year += 1;
  return `${year}-${pad(mm || 1)}-${pad(dd || 1)}`;
}

/** "2026-12-10T22:10:00+03:00" -> "22:10" */
function hhmm(iso: string): string {
  const m = String(iso).match(/T(\d{2}:\d{2})/);
  return m ? m[1] : "--:--";
}

/** Soma minutos a um "HH:MM" e diz se virou o dia. */
function addMinutes(time: string, minutes: number): { time: string; nextDay: boolean } {
  const [h, m] = time.split(":").map(Number);
  const total = (h || 0) * 60 + (m || 0) + (minutes || 0);
  const days = Math.floor(total / 1440);
  const t = ((total % 1440) + 1440) % 1440;
  return { time: `${pad(Math.floor(t / 60))}:${pad(t % 60)}`, nextDay: days >= 1 };
}

/** ~ R$ 0,05 por milha, arredondado a 500. */
function estimateMiles(cash: number): number {
  return Math.max(5000, Math.round(cash / 0.05 / 500) * 500);
}
/** Taxas estimadas (~6% do valor em dinheiro). */
function estimateTaxes(cash: number): number {
  return Math.max(80, Math.round((cash * 0.06) / 10) * 10);
}

// Programa de milhas por companhia (estimativa de exibição)
const PROGRAM: Record<string, string> = {
  LA: "LATAM Pass", JJ: "LATAM Pass", G3: "Smiles", AD: "TudoAzul",
  AA: "AAdvantage", UA: "MileagePlus", CM: "ConnectMiles", TP: "Miles&Go",
  AF: "Flying Blue", DL: "SkyMiles", IB: "Iberia Plus", KL: "Flying Blue",
};

interface TPItem {
  origin: string;
  destination: string;
  price: number;
  airline: string;
  flight_number: number | string;
  departure_at: string;
  return_at?: string;
  transfers?: number;
  return_transfers?: number;
  duration?: number;
  duration_to?: number;
  duration_back?: number;
}

function buildSegment(
  from: string, to: string, departISO: string, durationMin: number, stops: number, airline: string, flightNo: number | string,
): FlightSegment {
  const dep = hhmm(departISO);
  const arr = addMinutes(dep, durationMin);
  return {
    from, to,
    depTime: dep,
    arrTime: arr.time,
    durationMin: durationMin || 0,
    stops: stops || 0,
    stopAirports: [],
    nextDay: arr.nextDay,
    flightNumber: `${airline} ${flightNo}`,
  };
}

function mapOption(it: TPItem, idx: number, origin: string, destination: string, cabin: string): QuoteOption {
  const cash = Math.round(it.price);
  const durTo = it.duration_to ?? Math.round((it.duration ?? 0) / (it.return_at ? 2 : 1));
  const durBack = it.duration_back ?? durTo;
  const outbound = buildSegment(it.origin || origin, it.destination || destination, it.departure_at, durTo, it.transfers ?? 0, it.airline, it.flight_number);
  const inbound = it.return_at
    ? buildSegment(it.destination || destination, it.origin || origin, it.return_at, durBack, it.return_transfers ?? 0, it.airline, it.flight_number)
    : outbound;

  return {
    id: `live-opt-${idx}`,
    airline: it.airline,
    cabin: (cabin as QuoteOption["cabin"]) || "Econômica",
    outbound,
    inbound,
    cashPrice: cash,
    miles: {
      program: PROGRAM[it.airline] ?? "Programa parceiro",
      miles: estimateMiles(cash),
      taxes: estimateTaxes(cash),
    },
    baggage: "Bagagem a confirmar",
    refundable: false,
  };
}

/** Busca a cotação real. Retorna null se token ausente, falha ou sem resultados. */
export async function searchLiveQuote(request: QuoteRequest): Promise<Quote | null> {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) return null;

  const params = new URLSearchParams({
    origin: request.origin,
    destination: request.destination,
    departure_at: toISODate(request.departDate),
    currency: "brl",
    one_way: request.returnDate ? "false" : "true",
    sorting: "price",
    limit: "30",
    token,
  });
  if (request.returnDate) params.set("return_at", toISODate(request.returnDate));

  const started = Date.now();
  let json: { success?: boolean; data?: TPItem[] };
  try {
    const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
      headers: { "X-Access-Token": token, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    json = await res.json();
  } catch {
    return null;
  }

  const data = Array.isArray(json?.data) ? json.data : [];
  if (!json?.success || data.length === 0) return null;

  // Diversifica por companhia/conexões; cai pros primeiros se houver pouca variedade
  const seen = new Set<string>();
  let picked: TPItem[] = [];
  for (const it of data) {
    const key = `${it.airline}-${it.transfers ?? 0}`;
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(it);
    if (picked.length >= 6) break;
  }
  if (picked.length < 3) picked = data.slice(0, 6);

  const options = picked.map((it, i) => mapOption(it, i, request.origin, request.destination, request.cabin));
  if (options.length === 0) return null;

  return {
    id: encodeLiveId(request),
    request,
    client: "Cliente da agência",
    agency: "Via Metamundi",
    status: "cotado",
    createdAt: "agora",
    searchMs: Date.now() - started,
    source: "live",
    options,
    optionsCount: options.length,
    bestCash: Math.min(...options.map((o) => o.cashPrice)),
    bestMiles: Math.min(...options.map((o) => o.miles.miles)),
  };
}

// ---- IDs "ao vivo": carregam o pedido na URL (stateless, serverless-friendly) ----
export function encodeLiveId(request: QuoteRequest): string {
  const min = {
    o: request.origin, oc: request.originCity, d: request.destination, dc: request.destinationCity,
    dd: request.departDate, rd: request.returnDate, a: request.passengers.adults,
    c: request.passengers.children, i: request.passengers.infants, cb: request.cabin, p: request.preference,
  };
  return "live_" + Buffer.from(JSON.stringify(min)).toString("base64url");
}

export function decodeLiveId(id: string): QuoteRequest | null {
  if (!id.startsWith("live_")) return null;
  try {
    const m = JSON.parse(Buffer.from(id.slice(5), "base64url").toString("utf8"));
    return {
      origin: m.o, originCity: m.oc, destination: m.d, destinationCity: m.dc,
      departDate: m.dd, returnDate: m.rd,
      passengers: { adults: m.a ?? 1, children: m.c ?? 0, infants: m.i ?? 0 },
      cabin: m.cb ?? "Econômica", preference: m.p ?? "Mais opções",
    };
  } catch {
    return null;
  }
}
