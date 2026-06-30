import { AIRLINES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function AirlineBadge({
  code,
  size = "md",
  withName = false,
}: {
  code: string;
  size?: "sm" | "md" | "lg";
  withName?: boolean;
}) {
  const a = AIRLINES[code];
  if (!a) return null;

  const dims = {
    sm: "h-8 w-8 text-[10px] rounded-[9px]",
    md: "h-11 w-11 text-[12px] rounded-[12px]",
    lg: "h-12 w-12 text-[13px] rounded-[13px]",
  }[size];

  const badge = (
    <div
      className={cn(
        "grid flex-none place-items-center font-extrabold tracking-tight text-white shadow-[0_6px_14px_-6px_rgba(0,0,0,0.4)]",
        dims,
      )}
      style={{ backgroundImage: a.gradient }}
    >
      {a.short}
    </div>
  );

  if (!withName) return badge;

  return (
    <div className="flex items-center gap-3">
      {badge}
      <div className="leading-tight">
        <div className="text-[15px] font-extrabold text-ink">{a.name}</div>
        <div className="text-[11.5px] font-semibold text-slate-400">{a.program}</div>
      </div>
    </div>
  );
}
