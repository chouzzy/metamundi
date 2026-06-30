import type {
  Airline,
  ChatMessage,
  Conversation,
  DashboardStats,
  FlightSegment,
  MilesPricing,
  Quote,
  QuoteOption,
  QuoteRequest,
} from "./types";

// ============================================================
// Companhias aéreas
// ============================================================
export const AIRLINES: Record<string, Airline> = {
  LA: { code: "LA", name: "LATAM", short: "LATAM", gradient: "linear-gradient(135deg,#1b0088,#5b3df0)", color: "#5b3df0", program: "LATAM Pass" },
  AA: { code: "AA", name: "American Airlines", short: "AA", gradient: "linear-gradient(135deg,#0b3d91,#c8102e)", color: "#c8102e", program: "AAdvantage" },
  CM: { code: "CM", name: "Copa Airlines", short: "Copa", gradient: "linear-gradient(135deg,#0a3a8f,#1565c0)", color: "#1565c0", program: "ConnectMiles" },
  G3: { code: "G3", name: "GOL", short: "GOL", gradient: "linear-gradient(135deg,#ff6a00,#ff9100)", color: "#ff6a00", program: "Smiles" },
  AD: { code: "AD", name: "Azul", short: "Azul", gradient: "linear-gradient(135deg,#0098da,#00c2ff)", color: "#0098da", program: "TudoAzul" },
  UA: { code: "UA", name: "United", short: "United", gradient: "linear-gradient(135deg,#1414aa,#3b6fd6)", color: "#1414aa", program: "MileagePlus" },
  TP: { code: "TP", name: "TAP Air Portugal", short: "TAP", gradient: "linear-gradient(135deg,#00a04b,#7ed957)", color: "#00a04b", program: "Miles&Go" },
  AF: { code: "AF", name: "Air France", short: "AF", gradient: "linear-gradient(135deg,#002157,#e2003b)", color: "#002157", program: "Flying Blue" },
};

/** Companhia por código IATA, com fallback para códigos desconhecidos (vindos da API real). */
export function getAirline(code: string): Airline {
  return (
    AIRLINES[code] ?? {
      code,
      name: code,
      short: code,
      gradient: "linear-gradient(135deg,#334155,#64748b)",
      color: "#64748b",
      program: "Programa parceiro",
    }
  );
}

// Dicionário de aeroportos p/ a IA (interpret) e exibição
export const AIRPORTS: Record<string, { city: string; codes: string[] }> = {
  GRU: { city: "São Paulo", codes: ["sao paulo", "são paulo", "sp", "guarulhos", "gru"] },
  GIG: { city: "Rio de Janeiro", codes: ["rio", "rio de janeiro", "gig", "galeão"] },
  BSB: { city: "Brasília", codes: ["brasilia", "brasília", "bsb"] },
  REC: { city: "Recife", codes: ["recife", "rec"] },
  MIA: { city: "Miami", codes: ["miami", "mia"] },
  JFK: { city: "Nova York", codes: ["nova york", "new york", "nyc", "jfk"] },
  MCO: { city: "Orlando", codes: ["orlando", "mco"] },
  LIS: { city: "Lisboa", codes: ["lisboa", "lisbon", "lis"] },
  CDG: { city: "Paris", codes: ["paris", "cdg"] },
  SCL: { city: "Santiago", codes: ["santiago", "scl", "chile"] },
};

// ============================================================
// Builders
// ============================================================
const seg = (
  from: string, to: string, depTime: string, arrTime: string,
  durationMin: number, stops: number, stopAirports: string[], nextDay: boolean, flightNumber: string,
): FlightSegment => ({ from, to, depTime, arrTime, durationMin, stops, stopAirports, nextDay, flightNumber });

const mp = (program: string, miles: number, taxes: number): MilesPricing => ({ program, miles, taxes });

let _seq = 0;
const opt = (
  airline: string, cabin: QuoteOption["cabin"],
  outbound: FlightSegment, inbound: FlightSegment,
  cashPrice: number, miles: MilesPricing, baggage: string, refundable: boolean,
): QuoteOption => ({ id: `opt-${++_seq}`, airline, cabin, outbound, inbound, cashPrice, miles, baggage, refundable });

function makeQuote(
  base: Omit<Quote, "options" | "bestCash" | "bestMiles" | "optionsCount">,
  options: QuoteOption[],
): Quote {
  return {
    ...base,
    options,
    optionsCount: options.length,
    bestCash: Math.min(...options.map((o) => o.cashPrice)),
    bestMiles: Math.min(...options.map((o) => o.miles.miles)),
  };
}

// ============================================================
// Cotação HERÓI — São Paulo → Miami (o coração do produto)
// ============================================================
const Q1_REQUEST: QuoteRequest = {
  origin: "GRU", originCity: "São Paulo",
  destination: "MIA", destinationCity: "Miami",
  departDate: "10/12", returnDate: "20/12",
  passengers: { adults: 1, children: 0, infants: 0 },
  cabin: "Econômica",
  preference: "Voo direto",
  notes: "Cliente prefere voo direto, sem escalas.",
};

const QUOTE_1 = makeQuote(
  { id: "q-001", request: Q1_REQUEST, client: "Roberto Almeida", agency: "Viagens & Cia", status: "cotado", createdAt: "há 2 min", searchMs: 7200 },
  [
    opt("CM", "Econômica",
      seg("GRU", "MIA", "01:20", "12:40", 680, 1, ["PTY"], false, "CM 701"),
      seg("MIA", "GRU", "14:05", "06:30", 685, 1, ["PTY"], true, "CM 700"),
      3780, mp("ConnectMiles", 70000, 198), "1 bagagem de 23kg", false),
    opt("G3", "Econômica",
      seg("GRU", "MIA", "23:50", "11:10", 740, 1, ["FLL"], true, "G3 7720"),
      seg("MIA", "GRU", "19:30", "11:55", 745, 1, ["FLL"], true, "G3 7721"),
      4050, mp("Smiles", 58000, 240), "1 bagagem de 23kg", false),
    opt("AD", "Econômica",
      seg("VCP", "MIA", "20:15", "07:40", 625, 1, ["FLL"], true, "AD 8730"),
      seg("MIA", "VCP", "16:50", "09:10", 740, 1, ["FLL"], true, "AD 8731"),
      4380, mp("TudoAzul", 75000, 220), "1 bagagem de 23kg", true),
    opt("UA", "Econômica",
      seg("GRU", "MIA", "22:55", "09:35", 700, 1, ["IAH"], true, "UA 845"),
      seg("MIA", "GRU", "12:20", "05:05", 705, 1, ["IAH"], true, "UA 844"),
      4620, mp("MileagePlus", 80000, 260), "2 bagagens de 23kg", true),
    opt("LA", "Econômica",
      seg("GRU", "MIA", "22:10", "06:05", 535, 0, [], true, "LA 8064"),
      seg("MIA", "GRU", "22:40", "09:35", 535, 0, [], true, "LA 8065"),
      4890, mp("LATAM Pass", 95000, 312), "2 bagagens de 23kg", true),
    opt("AA", "Econômica",
      seg("GRU", "MIA", "21:45", "05:30", 525, 0, [], true, "AA 930"),
      seg("MIA", "GRU", "23:10", "10:00", 530, 0, [], true, "AA 931"),
      5120, mp("AAdvantage", 90000, 280), "2 bagagens de 23kg", true),
  ],
);

// ============================================================
// Demais cotações
// ============================================================
const QUOTE_2 = makeQuote(
  {
    id: "q-002",
    request: { origin: "GIG", originCity: "Rio de Janeiro", destination: "LIS", destinationCity: "Lisboa", departDate: "05/01", returnDate: "19/01", passengers: { adults: 2, children: 0, infants: 0 }, cabin: "Econômica", preference: "Melhor custo-benefício" },
    client: "Marina & Paulo", agency: "Top Travel", status: "enviado", createdAt: "há 25 min", searchMs: 6400,
  },
  [
    opt("TP", "Econômica",
      seg("GIG", "LIS", "23:10", "12:55", 585, 0, [], true, "TP 18"),
      seg("LIS", "GIG", "13:40", "20:05", 590, 0, [], false, "TP 17"),
      6240, mp("Miles&Go", 120000, 410), "1 bagagem de 23kg", false),
    opt("LA", "Econômica",
      seg("GIG", "LIS", "21:30", "13:40", 610, 1, ["GRU"], true, "LA 8074"),
      seg("LIS", "GIG", "11:20", "18:30", 615, 1, ["GRU"], false, "LA 8075"),
      6680, mp("LATAM Pass", 135000, 380), "1 bagagem de 23kg", true),
    opt("AF", "Econômica",
      seg("GIG", "LIS", "18:05", "15:20", 720, 1, ["CDG"], true, "AF 443"),
      seg("LIS", "GIG", "10:15", "19:55", 760, 1, ["CDG"], false, "AF 442"),
      7150, mp("Flying Blue", 128000, 520), "2 bagagens de 23kg", true),
  ],
);

const QUOTE_3 = makeQuote(
  {
    id: "q-003",
    request: { origin: "GRU", originCity: "São Paulo", destination: "JFK", destinationCity: "Nova York", departDate: "18/12", returnDate: "28/12", passengers: { adults: 2, children: 1, infants: 0 }, cabin: "Econômica", preference: "Voo direto" },
    client: "Família Souza", agency: "Mundo Viagens", status: "reservado", createdAt: "há 1 h", searchMs: 8100,
  },
  [
    opt("LA", "Econômica",
      seg("GRU", "JFK", "21:55", "06:20", 565, 0, [], true, "LA 8084"),
      seg("JFK", "GRU", "21:40", "09:55", 615, 0, [], true, "LA 8085"),
      14980, mp("LATAM Pass", 310000, 880), "1 bagagem de 23kg", false),
    opt("AA", "Econômica",
      seg("GRU", "JFK", "22:30", "06:55", 565, 0, [], true, "AA 950"),
      seg("JFK", "GRU", "09:50", "22:10", 620, 0, [], false, "AA 951"),
      15420, mp("AAdvantage", 300000, 920), "2 bagagens de 23kg", true),
    opt("UA", "Econômica",
      seg("GRU", "JFK", "22:10", "08:45", 635, 1, ["IAH"], true, "UA 860"),
      seg("JFK", "GRU", "07:30", "21:40", 670, 1, ["IAH"], false, "UA 861"),
      13760, mp("MileagePlus", 285000, 760), "1 bagagem de 23kg", false),
  ],
);

const QUOTE_4 = makeQuote(
  {
    id: "q-004",
    request: { origin: "BSB", originCity: "Brasília", destination: "SCL", destinationCity: "Santiago", departDate: "12/12", returnDate: "15/12", passengers: { adults: 1, children: 0, infants: 0 }, cabin: "Executiva", preference: "Corporativo · horário flexível" },
    client: "Carlos Menezes", agency: "Corporate Trips", status: "cotado", createdAt: "há 2 h", searchMs: 5900,
  },
  [
    opt("LA", "Executiva",
      seg("BSB", "SCL", "08:40", "14:10", 330, 1, ["GRU"], false, "LA 540"),
      seg("SCL", "BSB", "15:20", "22:35", 375, 1, ["GRU"], false, "LA 541"),
      2890, mp("LATAM Pass", 45000, 160), "2 bagagens de 32kg", true),
    opt("G3", "Econômica",
      seg("BSB", "SCL", "06:15", "12:35", 380, 1, ["GRU"], false, "G3 1402"),
      seg("SCL", "BSB", "13:50", "21:30", 400, 1, ["GRU"], false, "G3 1403"),
      2470, mp("Smiles", 38000, 140), "1 bagagem de 23kg", false),
    opt("CM", "Econômica",
      seg("BSB", "SCL", "10:05", "18:40", 455, 1, ["PTY"], false, "CM 312"),
      seg("SCL", "BSB", "19:10", "07:05", 475, 1, ["PTY"], true, "CM 313"),
      2680, mp("ConnectMiles", 42000, 150), "1 bagagem de 23kg", false),
  ],
);

const QUOTE_5 = makeQuote(
  {
    id: "q-005",
    request: { origin: "GRU", originCity: "São Paulo", destination: "CDG", destinationCity: "Paris", departDate: "02/02", returnDate: "16/02", passengers: { adults: 2, children: 0, infants: 0 }, cabin: "Econômica", preference: "Lua de mel · voo direto" },
    client: "Júlia & Enzo", agency: "Top Travel", status: "enviado", createdAt: "há 3 h", searchMs: 6900,
  },
  [
    opt("AF", "Econômica",
      seg("GRU", "CDG", "18:45", "11:30", 705, 0, [], true, "AF 459"),
      seg("CDG", "GRU", "23:15", "06:40", 745, 0, [], true, "AF 458"),
      8120, mp("Flying Blue", 180000, 560), "1 bagagem de 23kg", false),
    opt("LA", "Econômica",
      seg("GRU", "CDG", "16:20", "10:05", 705, 0, [], true, "LA 8050"),
      seg("CDG", "GRU", "22:10", "05:30", 740, 0, [], true, "LA 8051"),
      8480, mp("LATAM Pass", 192000, 520), "1 bagagem de 23kg", true),
    opt("TP", "Econômica",
      seg("GRU", "CDG", "19:30", "13:55", 805, 1, ["LIS"], true, "TP 88"),
      seg("CDG", "GRU", "08:40", "19:20", 820, 1, ["LIS"], false, "TP 89"),
      7640, mp("Miles&Go", 165000, 480), "1 bagagem de 23kg", false),
  ],
);

const QUOTE_6 = makeQuote(
  {
    id: "q-006",
    request: { origin: "REC", originCity: "Recife", destination: "MCO", destinationCity: "Orlando", departDate: "15/01", returnDate: "30/01", passengers: { adults: 2, children: 2, infants: 0 }, cabin: "Econômica", preference: "Família · bagagem despachada" },
    client: "Família Oliveira", agency: "Mundo Viagens", status: "reservado", createdAt: "ontem", searchMs: 7700,
  },
  [
    opt("AA", "Econômica",
      seg("REC", "MCO", "23:40", "09:15", 575, 1, ["MIA"], true, "AA 218"),
      seg("MCO", "REC", "10:25", "22:05", 580, 1, ["MIA"], false, "AA 219"),
      11340, mp("AAdvantage", 260000, 1020), "2 bagagens de 23kg", false),
    opt("CM", "Econômica",
      seg("REC", "MCO", "02:10", "13:50", 700, 1, ["PTY"], false, "CM 420"),
      seg("MCO", "REC", "14:35", "06:20", 705, 1, ["PTY"], true, "CM 421"),
      10980, mp("ConnectMiles", 240000, 940), "1 bagagem de 23kg", false),
    opt("LA", "Econômica",
      seg("REC", "MCO", "22:05", "09:40", 695, 1, ["GRU"], true, "LA 8092"),
      seg("MCO", "REC", "11:15", "23:30", 735, 1, ["GRU"], false, "LA 8093"),
      11760, mp("LATAM Pass", 255000, 880), "2 bagagens de 23kg", true),
  ],
);

export const QUOTES: Record<string, Quote> = {
  "q-001": QUOTE_1,
  "q-002": QUOTE_2,
  "q-003": QUOTE_3,
  "q-004": QUOTE_4,
  "q-005": QUOTE_5,
  "q-006": QUOTE_6,
};

export const QUOTE_ORDER = ["q-001", "q-002", "q-003", "q-004", "q-005", "q-006"];

// ============================================================
// Conversas (WhatsApp)
// ============================================================
const Q1_INTERPRETED: ChatMessage = {
  id: "m-3", role: "bot", kind: "interpreted", time: "09:14", request: Q1_REQUEST,
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c-001", agency: "Viagens & Cia", agent: "Fernanda", avatarColor: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    phone: "+55 11 98472-1130", lastMessage: "Prontinho! Encontrei 6 opções 🎉", time: "09:14", unread: 1, online: true, quoteId: "q-001",
    messages: [
      { id: "m-1", role: "agency", kind: "text", text: "Oi! Bom dia 👋", time: "09:13" },
      { id: "m-2", role: "agency", kind: "text", text: "Preciso de passagem SP → Miami, ida 10/dez, volta 20/dez, 1 adulto. O cliente prefere voo direto ✈️", time: "09:13" },
      Q1_INTERPRETED,
      { id: "m-4", role: "bot", kind: "text", text: "Recebido! ✅ Já entendi o pedido. Estou comparando dinheiro e milhas em todas as companhias…", time: "09:14" },
      { id: "m-5", role: "bot", kind: "quote", time: "09:14", quoteId: "q-001", quoteMeta: { options: 6, bestCash: 3780, bestMiles: 58000 } },
    ],
  },
  {
    id: "c-002", agency: "Top Travel", agent: "Ricardo", avatarColor: "linear-gradient(135deg,#06b6d4,#0ea5e9)",
    phone: "+55 21 99631-4420", lastMessage: "Enviado pro cliente, obrigado!", time: "08:48", unread: 0, online: true, quoteId: "q-002",
    messages: [
      { id: "m-1", role: "agency", kind: "text", text: "Bom dia! Casal Rio → Lisboa, 05 a 19 de janeiro, melhor custo-benefício", time: "08:40" },
      { id: "m-2", role: "bot", kind: "interpreted", time: "08:40", request: QUOTE_2.request },
      { id: "m-3", role: "bot", kind: "text", text: "Perfeito! Comparando voos diretos e com conexão 🔎", time: "08:41" },
      { id: "m-4", role: "bot", kind: "quote", time: "08:42", quoteId: "q-002", quoteMeta: { options: 3, bestCash: 6240, bestMiles: 120000 } },
      { id: "m-5", role: "agency", kind: "text", text: "Enviado pro cliente, obrigado!", time: "08:48" },
    ],
  },
  {
    id: "c-003", agency: "Mundo Viagens", agent: "Patrícia", avatarColor: "linear-gradient(135deg,#16a34a,#22c55e)",
    phone: "+55 11 97765-8890", lastMessage: "Reserva confirmada ✅", time: "Ontem", unread: 0, online: false, quoteId: "q-003",
    messages: [
      { id: "m-1", role: "agency", kind: "text", text: "Família, 2 adultos e 1 criança, São Paulo → Nova York 18 a 28/dez, de preferência voo direto", time: "Ontem" },
      { id: "m-2", role: "bot", kind: "interpreted", time: "Ontem", request: QUOTE_3.request },
      { id: "m-3", role: "bot", kind: "quote", time: "Ontem", quoteId: "q-003", quoteMeta: { options: 3, bestCash: 13760, bestMiles: 285000 } },
      { id: "m-4", role: "agency", kind: "text", text: "Fechamos a United! Reserva confirmada ✅", time: "Ontem" },
    ],
  },
  {
    id: "c-004", agency: "Corporate Trips", agent: "André", avatarColor: "linear-gradient(135deg,#d97706,#f59e0b)",
    phone: "+55 61 98120-2245", lastMessage: "Buscando as melhores opções…", time: "Ontem", unread: 2, online: false, quoteId: "q-004",
    messages: [
      { id: "m-1", role: "agency", kind: "text", text: "Executivo BSB → Santiago, 12 a 15/dez, horário flexível, classe executiva se valer a pena", time: "Ontem" },
      { id: "m-2", role: "bot", kind: "interpreted", time: "Ontem", request: QUOTE_4.request },
      { id: "m-3", role: "bot", kind: "quote", time: "Ontem", quoteId: "q-004", quoteMeta: { options: 3, bestCash: 2470, bestMiles: 38000 } },
    ],
  },
];

// ============================================================
// Dashboard
// ============================================================
export const DASHBOARD: DashboardStats = {
  quotesMonth: 142,
  quotesTrend: "+18%",
  avgTimeSec: 7,
  avgTimeTrend: "−92%",
  bookings: 38,
  bookingsTrend: "+11%",
  milesSaved: "2,1M",
  conversionRate: 27,
  pending: 6,
};
