"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  ReceiptText,
  Sparkles,
  Plus,
  LogOut,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/conversas", label: "Conversas", icon: MessageCircle, badge: 3 },
  { href: "/cotacoes", label: "Cotações", icon: ReceiptText },
  { href: "/nova", label: "Nova cotação", icon: Sparkles },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, badge }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-bold transition",
              active
                ? "bg-brand-600 text-white shadow-[0_10px_24px_-12px_rgba(80,70,229,0.9)]"
                : "text-ink-soft hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            <Icon className={cn("h-[18px] w-[18px]", active ? "text-white" : "text-slate-400 group-hover:text-brand-600")} />
            <span className="flex-1">{label}</span>
            {badge && (
              <span
                className={cn(
                  "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-extrabold",
                  active ? "bg-white/25 text-white" : "bg-brand-100 text-brand-700",
                )}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-[260px] flex-none flex-col border-r border-line bg-card/70 px-4 py-5 backdrop-blur lg:flex">
        <div className="flex items-center justify-between px-1.5">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>

        <Link
          href="/nova"
          className="mt-6 flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-3 text-[14px] font-bold text-white shadow-[0_12px_26px_-10px_rgba(124,58,237,0.7)] transition hover:brightness-105"
        >
          <Plus className="h-4 w-4" strokeWidth={2.6} /> Nova cotação
        </Link>

        <div className="mt-6">
          <NavLinks pathname={pathname} />
        </div>

        <div className="mt-auto space-y-4">
          <div className="overflow-hidden rounded-2xl gradient-night p-4 text-white">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-white/80">
              <Sparkles className="h-3.5 w-3.5" /> Orquestração Awer
            </div>
            <p className="mt-2 text-[12.5px] font-medium leading-snug text-white/80">
              IA interpreta o pedido e busca preços em dinheiro e milhas, por companhia — em segundos.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-line bg-card px-3 py-2.5">
            <div className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 text-[13px] font-extrabold text-white">
              MV
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-[13px] font-bold text-ink">Operação Metamundi</div>
              <div className="truncate text-[11px] font-semibold text-slate-400">matheus@awer.co</div>
            </div>
            <Link href="/login" className="text-slate-400 transition hover:text-rose-500" title="Sair">
              <LogOut className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-line bg-card/85 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard">
          <LogoMark className="h-9 w-9" />
        </Link>
        <div className="flex-1 overflow-x-auto scroll-soft">
          <div className="flex w-max gap-1">
            <NavLinksMobile pathname={pathname} />
          </div>
        </div>
        <ThemeToggle />
        <Link
          href="/nova"
          className="grid h-9 w-9 flex-none place-items-center rounded-lg gradient-brand text-white"
          title="Nova cotação"
        >
          <Plus className="h-4 w-4" strokeWidth={2.6} />
        </Link>
      </div>
    </>
  );
}

function NavLinksMobile({ pathname }: { pathname: string }) {
  return (
    <>
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-bold transition",
              active ? "bg-brand-600 text-white" : "text-ink-soft",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </>
  );
}
