import { stockLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StockBadge({ stock, threshold, className }: { stock: number; threshold: number; className?: string }) {
  const s = stockLabel(stock, threshold);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        s.tone === "out" && "bg-foreground text-background",
        s.tone === "low" && "bg-primary text-primary-foreground",
        s.tone === "ok" && "bg-muted text-foreground",
        className,
      )}
    >
      {s.text}
    </span>
  );
}
