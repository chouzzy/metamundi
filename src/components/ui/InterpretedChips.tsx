import { Sparkles } from "lucide-react";
import type { QuoteRequest } from "@/lib/types";
import { paxLabel } from "@/lib/utils";

function Chip({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-brand-100 bg-brand-50/60 px-2.5 py-1.5 text-[11.5px] font-bold text-ink-soft">
      <span className="text-slate-400">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}

export function InterpretedChips({
  request,
  title = true,
}: {
  request: QuoteRequest;
  title?: boolean;
}) {
  return (
    <div>
      {title && (
        <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-brand-600">
          <Sparkles className="h-3.5 w-3.5" /> Pedido interpretado pela IA
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        <Chip k="Origem" v={`${request.originCity} · ${request.origin}`} />
        <Chip k="Destino" v={`${request.destinationCity} · ${request.destination}`} />
        <Chip k="Ida" v={request.departDate} />
        {request.returnDate && <Chip k="Volta" v={request.returnDate} />}
        <Chip k="Passageiros" v={paxLabel(request.passengers)} />
        <Chip k="Classe" v={request.cabin} />
        <Chip k="Preferência" v={request.preference} />
      </div>
    </div>
  );
}
