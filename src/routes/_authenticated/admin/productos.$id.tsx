import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, ImageUpload, Panel, errorText } from "@/components/admin/admin-ui";
import { slugify } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/productos/$id")({ component: ProductEditor });

type Variant = { id?: string; name: string; price: string; stock: number; originalStock: number };
type Form = {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAt: string;
  stock: number;
  originalStock: number;
  threshold: number;
  categoryId: string;
  status: string;
  featured: boolean;
  images: string[];
  variants: Variant[];
  stockReason: string;
};

const EMPTY: Form = {
  name: "", slug: "", description: "", price: "", compareAt: "", stock: 0, originalStock: 0, threshold: 2,
  categoryId: "", status: "draft", featured: false, images: [], variants: [], stockReason: "",
};

function ProductEditor() {
  const { id } = Route.useParams();
  const isNew = id === "nuevo";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<Form>(EMPTY);
  const [removedVariants, setRemovedVariants] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const categories = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => (await supabase.from("categories").select("id, name").order("position")).data ?? [],
  });

  const product = useQuery({
    queryKey: ["admin", "product", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, images:product_images(url, position), variants:product_variants(id, name, price, stock, position)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const p = product.data;
    if (!p) return;
    setForm({
      name: p.name, slug: p.slug, description: p.description, price: String(p.price),
      compareAt: p.compare_at_price ? String(p.compare_at_price) : "", stock: p.stock, originalStock: p.stock,
      threshold: p.low_stock_threshold, categoryId: p.category_id ?? "", status: p.status, featured: p.featured,
      images: [...p.images].sort((a, b) => a.position - b.position).map((i) => i.url),
      variants: [...p.variants].sort((a, b) => a.position - b.position).map((v) => ({
        id: v.id, name: v.name, price: v.price == null ? "" : String(v.price), stock: v.stock, originalStock: v.stock,
      })),
      stockReason: "",
    });
  }, [product.data]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || !form.slug || !(price >= 0)) {
      toast.error("Completá nombre, dirección web y un precio válido.");
      return;
    }
    setSaving(true);
    try {
      const row = {
        name: form.name.trim(), slug: form.slug, description: form.description, price,
        compare_at_price: form.compareAt ? Number(form.compareAt) : null, low_stock_threshold: form.threshold,
        category_id: form.categoryId || null, status: form.status, featured: form.featured,
      };
      let productId = id;
      if (isNew) {
        const { data, error } = await supabase.from("products").insert({ ...row, stock: 0, position: Date.now() / 1000 }).select("id").single();
        if (error) throw error;
        productId = data.id;
      } else {
        const { error } = await supabase.from("products").update(row).eq("id", id);
        if (error) throw error;
      }

      const reason = form.stockReason.trim() || (isNew ? "stock inicial" : "ajuste manual");
      if (form.variants.length === 0 && form.stock !== form.originalStock) {
        const { error } = await supabase.rpc("adjust_stock", { _product_id: productId, _variant_id: null as unknown as string, _delta: form.stock - form.originalStock, _reason: reason });
        if (error) throw error;
      }

      await supabase.from("product_images").delete().eq("product_id", productId);
      if (form.images.length) {
        const { error } = await supabase.from("product_images").insert(form.images.map((url, i) => ({ product_id: productId, url, position: i + 1, alt: form.name })));
        if (error) throw error;
      }

      if (removedVariants.length) await supabase.from("product_variants").delete().in("id", removedVariants);
      for (const [i, v] of form.variants.entries()) {
        if (!v.name.trim()) continue;
        const vRow = { name: v.name.trim(), price: v.price ? Number(v.price) : null, position: i + 1 };
        let vid = v.id;
        if (vid) {
          const { error } = await supabase.from("product_variants").update(vRow).eq("id", vid);
          if (error) throw error;
        } else {
          const { data, error } = await supabase.from("product_variants").insert({ ...vRow, product_id: productId, stock: 0 }).select("id").single();
          if (error) throw error;
          vid = data.id;
        }
        const delta = v.stock - (v.id ? v.originalStock : 0);
        if (delta !== 0) {
          const { error } = await supabase.rpc("adjust_stock", { _product_id: productId, _variant_id: vid, _delta: delta, _reason: reason });
          if (error) throw error;
        }
      }

      toast.success("Guardamos el producto.");
      qc.invalidateQueries({ queryKey: ["admin"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["home"] });
      if (isNew) navigate({ to: "/admin/productos/$id", params: { id: productId }, replace: true });
      else product.refetch();
    } catch (err) {
      toast.error(errorText(err));
    } finally {
      setSaving(false);
    }
  }

  function moveImage(i: number, dir: -1 | 1) {
    const next = [...form.images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    set("images", next);
  }

  if (!isNew && product.isLoading) return <p className="text-muted-foreground">Cargando producto…</p>;
  if (!isNew && product.error) return <p role="alert">No encontramos este producto.</p>;

  return (
    <form onSubmit={onSubmit}>
      <Link to="/admin/productos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={14} aria-hidden="true" /> Productos
      </Link>
      <AdminHeader
        title={isNew ? "Nuevo producto" : form.name || "Producto"}
        actions={
          <>
            {!isNew && form.status === "active" && (
              <Link to="/tienda/$slug" params={{ slug: form.slug }} target="_blank" className="btn-pill btn-secondary-neutral !py-2 text-sm">Ver en la tienda</Link>
            )}
            <button type="submit" disabled={saving} className="btn-pill btn-primary-gradient !py-2 text-sm disabled:opacity-60">
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <Panel className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Nombre</Label>
              <Input id="p-name" value={form.name} required onChange={(e) => { set("name", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-slug">Dirección web</Label>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>/tienda/</span>
                <Input id="p-slug" value={form.slug} required onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-desc">Descripción</Label>
              <Textarea id="p-desc" rows={6} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
          </Panel>

          <Panel className="space-y-4">
            <h2 className="font-bold">Fotos</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {form.images.map((url, i) => (
                <div key={url + i} className="flex items-center gap-2">
                  <ImageUpload folder="productos" value={url} label={i === 0 ? "Foto principal" : `Foto ${i + 1}`} onChange={(v) => set("images", v ? form.images.map((u, j) => (j === i ? v : u)) : form.images.filter((_, j) => j !== i))} />
                  <div className="flex flex-col">
                    <button type="button" onClick={() => moveImage(i, -1)} className="p-1 rounded hover:bg-muted" aria-label="Mover foto antes"><ArrowUp size={14} aria-hidden="true" /></button>
                    <button type="button" onClick={() => moveImage(i, 1)} className="p-1 rounded hover:bg-muted" aria-label="Mover foto después"><ArrowDown size={14} aria-hidden="true" /></button>
                  </div>
                </div>
              ))}
              <ImageUpload folder="productos" value={null} label="Agregar foto" onChange={(v) => v && set("images", [...form.images, v])} />
            </div>
          </Panel>

          <Panel className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Variantes</h2>
              <button type="button" onClick={() => set("variants", [...form.variants, { name: "", price: "", stock: 0, originalStock: 0 }])} className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4">
                <Plus size={14} aria-hidden="true" /> Agregar variante
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Usalas para colores, tamaños o diseños. Cada variante tiene su propio stock.</p>
            {form.variants.map((v, i) => (
              <div key={v.id ?? `new-${i}`} className="grid gap-2 sm:grid-cols-[1fr_120px_100px_auto] items-end">
                <div className="space-y-1"><Label htmlFor={`v-n-${i}`}>Nombre</Label><Input id={`v-n-${i}`} value={v.name} onChange={(e) => set("variants", form.variants.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} /></div>
                <div className="space-y-1"><Label htmlFor={`v-p-${i}`}>Precio propio</Label><Input id={`v-p-${i}`} type="number" min={0} placeholder="Igual" value={v.price} onChange={(e) => set("variants", form.variants.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} /></div>
                <div className="space-y-1"><Label htmlFor={`v-s-${i}`}>Stock</Label><Input id={`v-s-${i}`} type="number" min={0} value={v.stock} onChange={(e) => set("variants", form.variants.map((x, j) => (j === i ? { ...x, stock: Math.max(0, Number(e.target.value)) } : x)))} /></div>
                <button type="button" aria-label={`Quitar variante ${v.name || i + 1}`} className="p-2 rounded hover:bg-muted" onClick={() => { if (v.id) setRemovedVariants((r) => [...r, v.id!]); set("variants", form.variants.filter((_, j) => j !== i)); }}>
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-status">Estado</Label>
              <select id="p-status" value={form.status} onChange={(e) => set("status", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="active">Publicado en la tienda</option>
                <option value="draft">Borrador (oculto)</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-cat">Categoría</Label>
              <select id="p-cat" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Sin categoría</option>
                {(categories.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
              Destacar en la portada
            </label>
          </Panel>

          <Panel className="space-y-4">
            <h2 className="font-bold">Precio</h2>
            <div className="space-y-1.5"><Label htmlFor="p-price">Precio (ARS)</Label><Input id="p-price" type="number" min={0} step="1" required value={form.price} onChange={(e) => set("price", e.target.value)} /></div>
            <div className="space-y-1.5"><Label htmlFor="p-compare">Precio anterior (opcional)</Label><Input id="p-compare" type="number" min={0} value={form.compareAt} onChange={(e) => set("compareAt", e.target.value)} /></div>
          </Panel>

          <Panel className="space-y-4">
            <h2 className="font-bold">Inventario</h2>
            {form.variants.length === 0 ? (
              <div className="space-y-1.5"><Label htmlFor="p-stock">Unidades disponibles</Label><Input id="p-stock" type="number" min={0} value={form.stock} onChange={(e) => set("stock", Math.max(0, Number(e.target.value)))} /></div>
            ) : (
              <p className="text-sm text-muted-foreground">El stock se maneja en cada variante.</p>
            )}
            <div className="space-y-1.5"><Label htmlFor="p-threshold">Avisar cuando queden</Label><Input id="p-threshold" type="number" min={0} value={form.threshold} onChange={(e) => set("threshold", Math.max(0, Number(e.target.value)))} /></div>
            <div className="space-y-1.5"><Label htmlFor="p-reason">Motivo del cambio de stock</Label><Input id="p-reason" placeholder="Ej.: llegó nueva producción" value={form.stockReason} onChange={(e) => set("stockReason", e.target.value)} /></div>
          </Panel>
        </div>
      </div>
    </form>
  );
}
