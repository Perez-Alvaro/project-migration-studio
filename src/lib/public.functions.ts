import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type {
  CategoryDTO,
  NewsDTO,
  ProductDTO,
  SectionDTO,
  SiteSettings,
  WorkshopDTO,
} from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";
import { resolveProductImage, getProductAssetFallback } from "@/data/images";

/** Read-only client with the publishable key; RLS limits it to public rows. */
function publicDb() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const PRODUCT_SELECT =
  "id, slug, name, description, price, compare_at_price, featured, stock, low_stock_threshold, created_at, position, category:categories(id, name, slug), images:product_images(id, url, alt, position), variants:product_variants(id, name, price, stock, position)";

type RawProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  featured: boolean;
  stock: number;
  low_stock_threshold: number;
  created_at: string;
  position: number;
  category: { id: string; name: string; slug: string } | null;
  images: { id: string; url: string; alt: string; position: number }[] | null;
  variants: { id: string; name: string; price: number | null; stock: number; position: number }[] | null;
};

function toProduct(p: RawProduct): ProductDTO {
  const variants = [...(p.variants ?? [])]
    .sort((a, b) => Number(a.position) - Number(b.position))
    .map((v) => ({ id: v.id, name: v.name, price: v.price == null ? null : Number(v.price), stock: v.stock }));
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    compareAtPrice: p.compare_at_price == null ? null : Number(p.compare_at_price),
    featured: p.featured,
    stock: variants.length ? variants.reduce((s, v) => s + Math.max(0, v.stock), 0) : p.stock,
    lowStockThreshold: p.low_stock_threshold,
    createdAt: p.created_at,
    category: p.category,
    images: (() => {
      const list = [...(p.images ?? [])]
        .sort((a, b) => Number(a.position) - Number(b.position))
        .map((i) => ({ url: resolveProductImage(i.url, p.slug), alt: i.alt }));
      if (list.length === 0) {
        const fb = getProductAssetFallback(p.slug);
        if (fb) list.push({ url: fb, alt: p.name });
      }
      return list;
    })(),
    variants,
  };
}

async function readSettings(db: ReturnType<typeof publicDb>): Promise<SiteSettings> {
  const { data, error } = await db.from("site_settings").select("key, value");
  if (error) throw new Error("No pudimos cargar los ajustes del sitio.");
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return {
    whatsappNumber: (map["whatsapp_number"] as string) ?? DEFAULT_SETTINGS.whatsappNumber,
    campaignStatus: (map["campaign_status"] as SiteSettings["campaignStatus"]) ?? DEFAULT_SETTINGS.campaignStatus,
    campaign: { ...DEFAULT_SETTINGS.campaign, ...((map["campaign"] as object) ?? {}) },
    bank: { ...DEFAULT_SETTINGS.bank, ...((map["bank"] as object) ?? {}) },
  };
}

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  return readSettings(publicDb());
});

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const db = publicDb();
  const [sections, products, news, workshops] = await Promise.all([
    db.from("page_sections").select("id, type, label, position, is_visible, content").eq("is_visible", true).order("position"),
    db.from("products").select(PRODUCT_SELECT).eq("status", "active").order("featured", { ascending: false }).order("position").limit(8),
    db.from("news_posts").select("id, slug, title, excerpt, cover_url, published_at").eq("status", "published").order("published_at", { ascending: false }).limit(3),
    db.from("workshops").select("id, slug, title, summary, cover_url, modality, teacher, starts_on, ends_on").eq("status", "published").order("position").limit(3),
  ]);
  if (sections.error || products.error || news.error || workshops.error) {
    throw new Error("No pudimos cargar la portada. Probá recargar la página.");
  }
  return {
    sections: (sections.data ?? []).map((s) => ({
      id: s.id,
      type: s.type,
      label: s.label,
      position: Number(s.position),
      isVisible: s.is_visible,
      content: (s.content ?? {}) as SectionDTO["content"],
    })) as SectionDTO[],
    products: (products.data as unknown as RawProduct[]).map(toProduct),
    news: (news.data ?? []).map(toNews),
    workshops: (workshops.data ?? []).map(toWorkshop),
  };
});

const listSchema = z.object({
  category: z.string().max(80).optional(),
  q: z.string().max(120).optional(),
  sort: z.enum(["destacados", "nuevos", "precio-asc", "precio-desc"]).optional(),
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => listSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const db = publicDb();
    let query = db.from("products").select(PRODUCT_SELECT).eq("status", "active");
    if (data.q) query = query.ilike("name", `%${data.q.replace(/[%_]/g, "")}%`);
    switch (data.sort) {
      case "nuevos": query = query.order("created_at", { ascending: false }); break;
      case "precio-asc": query = query.order("price", { ascending: true }); break;
      case "precio-desc": query = query.order("price", { ascending: false }); break;
      default: query = query.order("featured", { ascending: false }).order("position");
    }
    const [{ data: rows, error }, cats] = await Promise.all([
      query,
      db.from("categories").select("id, name, slug").order("position"),
    ]);
    if (error || cats.error) throw new Error("No pudimos cargar la tienda. Probá recargar la página.");
    let products = (rows as unknown as RawProduct[]).map(toProduct);
    if (data.category) products = products.filter((p) => p.category?.slug === data.category);
    return { products, categories: (cats.data ?? []) as CategoryDTO[] };
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(160) }).parse(d))
  .handler(async ({ data }) => {
    const db = publicDb();
    const { data: row, error } = await db.from("products").select(PRODUCT_SELECT).eq("slug", data.slug).eq("status", "active").maybeSingle();
    if (error) throw new Error("No pudimos cargar el producto.");
    if (!row) return null;
    const product = toProduct(row as unknown as RawProduct);
    let relatedQuery = db.from("products").select(PRODUCT_SELECT).eq("status", "active").neq("id", product.id).limit(4);
    if (product.category) relatedQuery = relatedQuery.eq("category_id", product.category.id);
    const { data: rel } = await relatedQuery.order("position");
    return { product, related: ((rel ?? []) as unknown as RawProduct[]).map(toProduct) };
  });

type RawNews = { id: string; slug: string; title: string; excerpt: string; cover_url: string | null; published_at: string | null; body?: string };
function toNews(n: RawNews): NewsDTO {
  return { id: n.id, slug: n.slug, title: n.title, excerpt: n.excerpt, coverUrl: n.cover_url, publishedAt: n.published_at, body: n.body ?? "" };
}

export const listNews = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicDb()
    .from("news_posts")
    .select("id, slug, title, excerpt, cover_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error("No pudimos cargar las novedades.");
  return (data ?? []).map(toNews);
});

export const getNews = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(160) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicDb()
      .from("news_posts")
      .select("id, slug, title, excerpt, body, cover_url, published_at")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error("No pudimos cargar la novedad.");
    return row ? toNews(row) : null;
  });

type RawWorkshop = {
  id: string; slug: string; title: string; summary: string; cover_url: string | null;
  modality: string; teacher: string; starts_on: string | null; ends_on: string | null; description?: string;
};
function toWorkshop(w: RawWorkshop): WorkshopDTO {
  return {
    id: w.id, slug: w.slug, title: w.title, summary: w.summary, description: w.description ?? "",
    coverUrl: w.cover_url, modality: w.modality, teacher: w.teacher, startsOn: w.starts_on, endsOn: w.ends_on,
  };
}

export const listWorkshops = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicDb()
    .from("workshops")
    .select("id, slug, title, summary, cover_url, modality, teacher, starts_on, ends_on")
    .eq("status", "published")
    .order("position");
  if (error) throw new Error("No pudimos cargar los talleres.");
  return (data ?? []).map(toWorkshop);
});

export const getWorkshop = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(160) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicDb()
      .from("workshops")
      .select("id, slug, title, summary, description, cover_url, modality, teacher, starts_on, ends_on")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error("No pudimos cargar el taller.");
    return row ? toWorkshop(row) : null;
  });
