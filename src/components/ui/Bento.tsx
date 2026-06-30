import { cn } from "@/lib/utils";

export function Bento({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section";
}) {
  return <Tag className={cn("card card-hover p-5", className)}>{children}</Tag>;
}

export function StatTile({
  icon,
  value,
  label,
  trend,
  trendTone = "up",
  gradient,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend?: string;
  trendTone?: "up" | "down" | "neutral";
  gradient: string;
}) {
  return (
    <div className="card card-hover relative overflow-hidden p-5">
      <div
        className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-[0_8px_18px_-8px_rgba(0,0,0,0.4)]"
        style={{ backgroundImage: gradient }}
      >
        {icon}
      </div>
      {trend && (
        <span
          className={cn(
            "absolute right-4 top-4 rounded-lg px-2 py-1 text-[11px] font-extrabold",
            trendTone === "down" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600",
          )}
        >
          {trend}
        </span>
      )}
      <div className="mt-4 text-[28px] font-extrabold leading-none tracking-tight text-ink">{value}</div>
      <div className="mt-1.5 text-[13px] font-semibold text-slate-500">{label}</div>
    </div>
  );
}
