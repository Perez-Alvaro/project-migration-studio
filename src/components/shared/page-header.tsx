import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="bg-teal-hero text-hero-foreground py-14">
      <div className="haruen-container">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-hero-foreground/15 flex items-center justify-center">
            <Icon size={20} aria-hidden="true" />
          </div>
          <span className="text-sm font-bold text-hero-foreground/85 uppercase tracking-widest">{eyebrow}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">{title}</h1>
        {children && <div className="text-lg text-hero-foreground/90 max-w-2xl">{children}</div>}
      </div>
    </div>
  );
}

export function RouteError({ error }: { error: unknown }) {
  return (
    <div role="alert" className="haruen-container pt-[140px] pb-20 text-center">
      <h1 className="text-2xl font-bold mb-2">No pudimos cargar esta página</h1>
      <p className="text-muted-foreground">
        {error instanceof Error ? error.message : "Probá recargar en unos segundos."}
      </p>
    </div>
  );
}
