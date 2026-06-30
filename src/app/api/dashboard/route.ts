import { NextResponse } from "next/server";
import { getDashboard, getQuotes } from "@/lib/data";

// GET /api/dashboard → indicadores + cotações recentes
export async function GET() {
  return NextResponse.json({
    stats: getDashboard(),
    recent: getQuotes(),
  });
}
