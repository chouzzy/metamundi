import { PlaneLanding, PlaneTakeoff } from "lucide-react";
import type { FlightSegment } from "@/lib/types";
import { cn, formatDuration, stopsLabel } from "@/lib/utils";

export function FlightTimeline({
  segment,
  direction,
}: {
  segment: FlightSegment;
  direction: "ida" | "volta";
}) {
  const isReturn = direction === "volta";
  const direct = segment.stops === 0;

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "grid h-7 w-7 flex-none place-items-center rounded-lg",
          isReturn ? "bg-cyan-50 text-cyan-600" : "bg-brand-50 text-brand-600",
        )}
        title={isReturn ? "Volta" : "Ida"}
      >
        {isReturn ? <PlaneLanding className="h-3.5 w-3.5" /> : <PlaneTakeoff className="h-3.5 w-3.5" />}
      </div>

      <div className="flex flex-1 items-center gap-3">
        <div className="min-w-[52px] text-center">
          <div className="text-[15px] font-extrabold leading-none text-ink">{segment.depTime}</div>
          <div className="mt-0.5 text-[10.5px] font-bold text-slate-400">{segment.from}</div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1">
          <span className={cn("text-[10px] font-bold", direct ? "text-emerald-600" : "text-slate-400")}>
            {formatDuration(segment.durationMin)}
          </span>
          <div className="relative h-0.5 w-full rounded bg-slate-200">
            <span
              className={cn(
                "absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                direct ? "bg-emerald-500" : "bg-slate-300",
              )}
            />
          </div>
          <span className={cn("whitespace-nowrap text-[10px] font-bold", direct ? "text-emerald-600" : "text-slate-400")}>
            {stopsLabel(segment.stops, segment.stopAirports)}
          </span>
        </div>

        <div className="flex min-w-[52px] items-start justify-center gap-0.5 text-center">
          <div>
            <div className="text-[15px] font-extrabold leading-none text-ink">{segment.arrTime}</div>
            <div className="mt-0.5 text-[10.5px] font-bold text-slate-400">{segment.to}</div>
          </div>
          {segment.nextDay && <span className="text-[9px] font-extrabold text-rose-500">+1</span>}
        </div>
      </div>
    </div>
  );
}
