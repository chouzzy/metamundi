import { NextResponse } from "next/server";

// POST /api/auth/login
// Protótipo: aceita qualquer credencial e devolve um "usuário" mock.
// Os devs trocam por autenticação real (sessão/JWT) aqui.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email: string = body?.email ?? "demo@metamundi.com";

  return NextResponse.json({
    ok: true,
    token: "mock-session-token",
    user: {
      name: "Operação Metamundi",
      email,
      role: "operador",
      agency: "Metamundi",
    },
  });
}
