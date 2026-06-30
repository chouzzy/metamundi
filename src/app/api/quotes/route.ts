import { NextResponse } from "next/server";
import { getQuoteIdForRoute, getQuotes, interpret } from "@/lib/data";

// GET /api/quotes  → lista de cotações (resumo)
export async function GET() {
  return NextResponse.json({ quotes: getQuotes() });
}

// POST /api/quotes  { request?, text? } → dispara a busca e devolve o id da cotação
// Protótipo: resolve para uma cotação existente pela rota. No real, aqui
// roda o motor de busca (tarifas em dinheiro + milhas por companhia).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const request = body?.request ?? (body?.text ? interpret(body.text) : null);

  if (!request?.origin || !request?.destination) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const quoteId = getQuoteIdForRoute(request.origin, request.destination);
  return NextResponse.json({ quoteId, status: "cotado" });
}
