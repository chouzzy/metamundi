// ============================================================
// Metamundi — modelo de dados do domínio de cotação
// Esta é a "forma" dos dados que as integrações reais dos devs
// da Metamundi devem devolver. Hoje é alimentado por mock-data.
// ============================================================

export interface Airline {
  code: string; // IATA — LA, AA, CM, G3, AD, UA
  name: string; // Nome de exibição
  short: string; // Texto curto no logo
  gradient: string; // gradiente CSS do badge
  color: string; // cor sólida (dot do programa)
  program: string; // programa de milhas
}

export interface FlightSegment {
  from: string; // GRU
  to: string; // MIA
  depTime: string; // "22:10"
  arrTime: string; // "06:05"
  durationMin: number; // duração total em minutos
  stops: number; // 0 = direto
  stopAirports: string[]; // ["PTY"]
  nextDay: boolean; // chega no dia seguinte
  flightNumber: string; // "LA 8064"
}

export interface MilesPricing {
  program: string; // "LATAM Pass"
  miles: number; // 95000
  taxes: number; // taxas em R$
}

export type Cabin = "Econômica" | "Premium Economy" | "Executiva";

export interface QuoteOption {
  id: string;
  airline: string; // code da companhia
  cabin: Cabin;
  outbound: FlightSegment;
  inbound: FlightSegment;
  cashPrice: number; // total ida e volta em R$
  miles: MilesPricing;
  baggage: string; // "2 bagagens de 23kg"
  refundable: boolean;
}

export interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

export interface QuoteRequest {
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departDate: string; // "10/12"
  returnDate?: string; // "20/12"
  passengers: Passengers;
  cabin: string;
  preference: string; // "Voo direto"
  notes?: string;
}

export type QuoteStatus = "interpretando" | "cotado" | "enviado" | "reservado";

export interface QuoteSummary {
  id: string;
  request: QuoteRequest;
  client: string;
  agency: string;
  status: QuoteStatus;
  bestCash: number;
  bestMiles: number;
  optionsCount: number;
  createdAt: string; // rótulo relativo ("há 2 min")
}

export interface Quote extends QuoteSummary {
  options: QuoteOption[];
  searchMs: number; // tempo da busca, p/ destacar a velocidade
  source?: "live" | "mock"; // origem dos dados (API real vs mock)
}

export type MessageRole = "agency" | "bot";
export type MessageKind = "text" | "interpreted" | "quote";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  kind: MessageKind;
  text?: string;
  time: string;
  request?: QuoteRequest; // quando kind === "interpreted"
  quoteId?: string; // quando kind === "quote"
  quoteMeta?: { options: number; bestCash: number; bestMiles: number };
}

export interface Conversation {
  id: string;
  agency: string;
  agent: string;
  avatarColor: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  quoteId?: string;
  messages: ChatMessage[];
}

export interface DashboardStats {
  quotesMonth: number;
  quotesTrend: string;
  avgTimeSec: number;
  avgTimeTrend: string;
  bookings: number;
  bookingsTrend: string;
  milesSaved: string;
  conversionRate: number;
  pending: number;
}
