import { NextResponse } from "next/server";
import { interpret } from "@/lib/data";

// POST /api/interpret  { text: string }
// Recebe o texto livre do WhatsApp e devolve o pedido estruturado.
// No produto real, vira uma chamada a um LLM (ex.: Claude) — a forma
// de saída (QuoteRequest) permanece a mesma.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text: string = body?.text ?? "";

  if (!text.trim()) {
    return NextResponse.json({ error: "Texto do pedido vazio." }, { status: 400 });
  }

  const request = interpret(text);
  return NextResponse.json({ request, confidence: 0.97, model: "metamundi-nlu-mock" });
}
