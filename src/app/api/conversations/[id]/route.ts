import { NextResponse } from "next/server";
import { getConversation } from "@/lib/data";

// GET /api/conversations/:id → uma conversa com histórico de mensagens
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const conversation = getConversation(id);

  if (!conversation) {
    return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}
