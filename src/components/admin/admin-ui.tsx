import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";

export function AdminHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold break-words sm:text-3xl">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-sm sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 [&>*]:min-h-11 [&>*]:flex-1 sm:[&>*]:flex-none">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[var(--radius)] border border-border bg-card p-5 shadow-soft", className)}>{children}</div>;
}

export function StatusPill({ tone, children }: { tone: "ok" | "warn" | "muted" | "bad"; children: ReactNode }) {
  const cls = {
    ok: "bg-primary/15 text-foreground border-primary/40",
    warn: "bg-muted text-foreground border-border",
    muted: "bg-muted text-muted-foreground border-border",
    bad: "bg-destructive/10 text-destructive border-destructive/30",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold", cls)}>{children}</span>;
}

export function errorText(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) {
    const m = String((e as { message: unknown }).message);
    if (m.includes("duplicate key")) return "Ya existe otro elemento con esa dirección web. Cambiala y guardá de nuevo.";
    return m;
  }
  return "Algo falló. Probá de nuevo.";
}

export function ImageUpload({
  value,
  onChange,
  folder,
  label = "Imagen",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: "productos" | "novedades" | "talleres";
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file, folder));
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <div className="relative w-28 aspect-[4/3] rounded-lg bg-muted overflow-hidden border border-border">
          {value && <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold hover:bg-muted">
            {busy ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={14} aria-hidden="true" />}
            {value ? "Cambiar imagen" : "Subir imagen"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange(null)} className="text-left text-xs text-muted-foreground underline">Quitar imagen</button>
          )}
        </div>
        <input ref={ref} type="file" accept="image/*" className="sr-only" aria-label={label} onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}
