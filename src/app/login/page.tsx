"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Coins,
  Gauge,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("matheus@awer.co");
  const [password, setPassword] = useState("metamundi");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Protótipo: chama a API mock e segue para o dashboard.
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).catch(() => null);
    router.push("/dashboard");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden gradient-night p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2.5">
          <LogoMark className="h-11 w-11" />
          <div className="text-[19px] font-extrabold tracking-tight">
            Meta<span className="text-brand-300">mundi</span>
          </div>
        </div>

        <div className="relative z-10 mt-auto max-w-md">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] font-bold">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" /> Orquestração por IA · Awer
          </div>
          <h1 className="text-[34px] font-extrabold leading-[1.12] tracking-tight">
            Da mensagem no WhatsApp à <span className="text-gradient">cotação pronta</span> em segundos.
          </h1>
          <p className="mt-4 text-[15px] font-medium leading-relaxed text-white/70">
            A agência manda o pedido, a IA interpreta e o sistema devolve as melhores opções em
            dinheiro e em milhas, comparando todas as companhias. Cotação manual de horas vira segundos.
          </p>

          <div className="mt-9 grid grid-cols-3 gap-3">
            <Feature icon={<Gauge className="h-4 w-4" />} value="7s" label="por cotação" />
            <Feature icon={<Coins className="h-4 w-4" />} value="R$ + milhas" label="lado a lado" />
            <Feature icon={<ShieldCheck className="h-4 w-4" />} value="8 cias" label="comparadas" />
          </div>
        </div>

        <div className="relative z-10 mt-10 text-[12px] font-semibold text-white/50">
          © 2025 Metamundi · Plataforma orquestrada pela Awer
        </div>
      </div>

      {/* Form panel */}
      <div className="app-bg relative flex items-center justify-center px-6 py-12">
        <ThemeToggle className="absolute right-5 top-5" />
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <div className="anim-up">
            <h2 className="text-[26px] font-extrabold tracking-tight text-ink">Bem-vindo de volta 👋</h2>
            <p className="mt-1.5 text-[14px] font-medium text-slate-500">
              Entre para acessar o painel de cotações.
            </p>
          </div>

          <form onSubmit={handleLogin} className="anim-up anim-up-1 mt-8 space-y-4">
            <Field
              label="E-mail"
              icon={<Mail className="h-4 w-4" />}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="voce@agencia.com"
            />
            <Field
              label="Senha"
              icon={<Lock className="h-4 w-4" />}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between pt-1 text-[13px]">
              <label className="flex items-center gap-2 font-semibold text-slate-500">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 accent-brand-600" />
                Manter conectado
              </label>
              <a className="font-bold text-brand-600 hover:underline" href="#">
                Esqueci a senha
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl gradient-brand py-3.5 text-[15px] font-bold text-white shadow-[0_14px_30px_-12px_rgba(124,58,237,0.8)] transition hover:brightness-105 disabled:opacity-70"
            >
              {loading ? "Entrando…" : "Entrar na plataforma"}
              {!loading && <ArrowRight className="h-4 w-4" strokeWidth={2.5} />}
            </button>
          </form>

          <div className="anim-up anim-up-2 mt-6 rounded-xl border border-line bg-card px-4 py-3 text-[12.5px] font-medium text-slate-500">
            <span className="font-bold text-ink">Demo:</span> credenciais já preenchidas — é só clicar em{" "}
            <span className="font-bold text-brand-600">Entrar</span>.
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-brand-300">{icon}</div>
      <div className="mt-2.5 text-[16px] font-extrabold leading-none">{value}</div>
      <div className="mt-1 text-[11px] font-semibold text-white/50">{label}</div>
    </div>
  );
}

function Field({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-bold text-ink-soft">{label}</span>
      <div className="flex items-center gap-2.5 rounded-xl border border-line bg-card px-3.5 py-3 transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
        <span className="text-slate-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-slate-300"
        />
      </div>
    </label>
  );
}
