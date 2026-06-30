"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  MoreVertical,
  Paperclip,
  Phone,
  ReceiptText,
  Search,
  Send,
  Smile,
  Sparkles,
} from "lucide-react";
import type { ChatMessage, Conversation } from "@/lib/types";
import { InterpretedChips } from "@/components/ui/InterpretedChips";
import { formatBRL, formatMiles, cn } from "@/lib/utils";

export function ConversasClient({ conversations }: { conversations: Conversation[] }) {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const [showChat, setShowChat] = useState(false);
  const selected = conversations.find((c) => c.id === selectedId) ?? conversations[0];

  return (
    <div className="flex h-[74vh] min-h-[520px] overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_12px_30px_-16px_rgba(16,22,58,0.18)]">
      {/* Conversations list */}
      <div className={cn("w-full flex-none flex-col border-r border-line lg:flex lg:w-[330px]", showChat ? "hidden" : "flex")}>
        <div className="border-b border-line p-3.5">
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Buscar agência…"
              className="w-full bg-transparent text-[13px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scroll-soft">
          {conversations.map((c) => {
            const active = c.id === selected?.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedId(c.id);
                  setShowChat(true);
                }}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-line/70 px-3.5 py-3 text-left transition hover:bg-slate-50",
                  active && "bg-brand-50/60",
                )}
              >
                <div className="relative flex-none">
                  <div
                    className="grid h-11 w-11 place-items-center rounded-full text-[14px] font-extrabold text-white"
                    style={{ backgroundImage: c.avatarColor }}
                  >
                    {c.agency.slice(0, 1)}
                  </div>
                  {c.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[14px] font-bold text-ink">{c.agency}</span>
                    <span className="flex-none text-[11px] font-semibold text-slate-400">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[12.5px] font-medium text-slate-400">{c.lastMessage}</span>
                    {c.unread > 0 && (
                      <span className="grid h-[18px] min-w-[18px] flex-none place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-extrabold text-white">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat */}
      <div className={cn("flex-1 flex-col lg:flex", showChat ? "flex" : "hidden")}>
        {selected && (
          <>
            {/* header */}
            <div className="flex items-center gap-3 border-b border-line bg-[#075e54] px-4 py-3 text-white">
              <button onClick={() => setShowChat(false)} className="lg:hidden">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div
                className="grid h-10 w-10 flex-none place-items-center rounded-full text-[14px] font-extrabold text-white"
                style={{ backgroundImage: selected.avatarColor }}
              >
                {selected.agency.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-[15px] font-bold">{selected.agency}</div>
                <div className="flex items-center gap-1.5 text-[11.5px] text-white/75">
                  {selected.online ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> online · {selected.agent}
                    </>
                  ) : (
                    <>visto por último · {selected.agent}</>
                  )}
                </div>
              </div>
              {selected.quoteId && (
                <Link
                  href={`/cotacoes/${selected.quoteId}`}
                  className="hidden items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-[12px] font-bold transition hover:bg-white/25 sm:flex"
                >
                  <ReceiptText className="h-3.5 w-3.5" /> Ver cotação
                </Link>
              )}
              <Phone className="h-[18px] w-[18px] opacity-90" />
              <MoreVertical className="h-[18px] w-[18px] opacity-90" />
            </div>

            {/* messages */}
            <div className="wa-pattern flex-1 space-y-2 overflow-y-auto scroll-soft px-4 py-5 sm:px-8">
              <div className="mx-auto w-fit rounded-lg bg-white/85 px-3 py-1 text-[11px] font-semibold text-slate-500 shadow-sm">
                Conversa via WhatsApp Business · Metamundi
              </div>
              {selected.messages.map((m) => (
                <MessageBubble key={m.id} msg={m} />
              ))}
            </div>

            {/* input */}
            <div className="flex items-center gap-2.5 border-t border-line bg-[#f0f2f5] px-3 py-2.5">
              <Smile className="h-5 w-5 flex-none text-slate-400" />
              <Paperclip className="h-5 w-5 flex-none text-slate-400" />
              <div className="flex-1 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium text-slate-400">
                Resposta automática ativada — a IA responde os pedidos
              </div>
              <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#00a884] text-white">
                <Send className="h-[18px] w-[18px]" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isBot = msg.role === "bot";

  if (msg.kind === "interpreted" && msg.request) {
    return (
      <div className="anim-pop flex justify-end">
        <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-white p-3.5 shadow-sm">
          <InterpretedChips request={msg.request} />
          <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] font-semibold text-slate-400">
            {msg.time} <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
          </div>
        </div>
      </div>
    );
  }

  if (msg.kind === "quote" && msg.quoteId && msg.quoteMeta) {
    return (
      <div className="anim-pop flex justify-end">
        <Link
          href={`/cotacoes/${msg.quoteId}`}
          className="group max-w-[86%] overflow-hidden rounded-2xl rounded-tr-sm bg-white shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center gap-2 gradient-brand px-4 py-2.5 text-white">
            <Sparkles className="h-4 w-4" />
            <span className="text-[13px] font-extrabold">Cotação pronta</span>
            <span className="ml-auto rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold">
              {msg.quoteMeta.options} opções
            </span>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">A partir de</div>
                <div className="text-[18px] font-extrabold text-ink">{formatBRL(msg.quoteMeta.bestCash)}</div>
              </div>
              <div className="h-9 w-px bg-line" />
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Ou em milhas</div>
                <div className="text-[18px] font-extrabold text-amber-600">{formatMiles(msg.quoteMeta.bestMiles)} mi</div>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-bold text-brand-600">
              Abrir comparativo completo
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" strokeWidth={2.5} />
            </div>
          </div>
          <div className="px-4 pb-2 text-right text-[10px] font-semibold text-slate-400">
            {msg.time} <CheckCheck className="ml-0.5 inline h-3.5 w-3.5 text-sky-500" />
          </div>
        </Link>
      </div>
    );
  }

  // texto
  return (
    <div className={cn("anim-pop flex", isBot ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] px-3 py-2 text-[13.5px] font-medium leading-relaxed shadow-sm",
          isBot
            ? "rounded-2xl rounded-tr-sm bg-[#d9fdd3] text-ink"
            : "rounded-2xl rounded-tl-sm bg-white text-ink",
        )}
      >
        {msg.text}
        <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 text-[10px] font-semibold text-slate-400">
          {msg.time}
          {isBot && <CheckCheck className="h-3.5 w-3.5 text-sky-500" />}
          {!isBot && <Check className="h-3 w-3" />}
        </span>
      </div>
    </div>
  );
}
