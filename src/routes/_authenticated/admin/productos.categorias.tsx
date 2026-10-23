import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Panel, errorText } from "@/components/admin/admin-ui";
import { slugify } from "@/lib/types";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/admin/productos/categorias")({ component: Categories });

function Categories() {
  const [name, setName] = useState("");
  const { data, refetch } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => (await supabase.from("categories").select("id, name, slug, position").order("position")).data ?? [],
  });

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const last = data?.at(-1)?.position ?? 0;
    const { error } = await supabase.from("categories").insert({ name: name.trim(), slug: slugify(name), position: Number(last) + 1 });
    if (error) { toast.error(errorText(error)); return; }
    setName("");
    refetch();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta categoría? Los productos quedan sin categoría.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast.error(errorText(error)); return; }
    refetch();
  }

  return (
    <>
      <Link to="/admin/productos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={14} aria-hidden="true" /> Productos
      </Link>
      <AdminHeader title="Categorías" description="Organizan los filtros de la tienda." />
      <Panel className="max-w-xl space-y-4">
        <form onSubmit={add} className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la categoría" aria-label="Nombre de la nueva categoría" />
          <button type="submit" className="btn-pill btn-primary-gradient !py-2 text-sm shrink-0">Agregar</button>
        </form>
        <ul className="divide-y divide-border">
          {(data ?? []).map((c) => (
            <li key={c.id} className="flex items-center justify-between py-2">
              <span className="font-semibold">{c.name}</span>
              <button type="button" onClick={() => remove(c.id)} className="p-2 rounded hover:bg-muted" aria-label={`Eliminar ${c.name}`}><Trash2 size={16} aria-hidden="true" /></button>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
