import { NextResponse } from "next/server";
import { getConversations } from "@/lib/data";

// GET /api/conversations → lista de conversas do WhatsApp
export async function GET() {
  return NextResponse.json({ conversations: getConversations() });
}
