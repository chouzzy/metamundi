import { NextResponse } from "next/server";
import { getQuote } from "@/lib/data";

// GET /api/quotes/:id → cotação completa com todas as opções
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const quote = await getQuote(id);

  if (!quote) {
    return NextResponse.json({ error: "Cotação não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ quote });
}
