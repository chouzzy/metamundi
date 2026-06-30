import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Compõe classes Tailwind sem conflito. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** R$ 4.200 */
export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** 90.000 */
export function formatMiles(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

/** 535 -> "8h55" */
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, "0")}`;
}

/** Resumo de escalas para exibição. */
export function stopsLabel(stops: number, airports: string[]) {
  if (stops === 0) return "Voo direto";
  const where = airports.join(" · ");
  return `${stops} ${stops === 1 ? "parada" : "paradas"}${where ? " · " + where : ""}`;
}

/** Total de passageiros legível. */
export function paxLabel(p: { adults: number; children: number; infants: number }) {
  const parts: string[] = [];
  if (p.adults) parts.push(`${p.adults} ${p.adults === 1 ? "adulto" : "adultos"}`);
  if (p.children) parts.push(`${p.children} ${p.children === 1 ? "criança" : "crianças"}`);
  if (p.infants) parts.push(`${p.infants} ${p.infants === 1 ? "bebê" : "bebês"}`);
  return parts.join(" · ") || "1 adulto";
}
