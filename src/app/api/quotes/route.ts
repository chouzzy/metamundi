import { NextResponse } from "next/server";
import { getQuoteIdForRoute, getQuotes, interpret } from "@/lib/data";
import { encodeLiveId, isLiveEnabled } from "@/lib/flights-api";

// GET /api/quotes  → lista de cotações (resumo)
export async function GET() {
  return NextResponse.json({ quotes: getQuotes() });
}

// POST /api/quotes  { request?, text? } → dispara a busca e devolve o id da cotação
// Com TRAVELPAYOUTS_TOKEN configurado, devolve um id "ao vivo" (busca real
// na abertura da cotação). Sem token, resolve para a cotação mock da rota.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const request = body?.request ?? (body?.text ? interpret(body.text) : null);

  if (!request?.origin || !request?.destination) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  if (isLiveEnabled()) {
    return NextResponse.json({ quoteId: encodeLiveId(request), status: "cotado", source: "live" });
  }
  const quoteId = getQuoteIdForRoute(request.origin, request.destination);
  return NextResponse.json({ quoteId, status: "cotado", source: "mock" });
}
