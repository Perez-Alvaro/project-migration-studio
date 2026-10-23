export type CampaignStatus = "iniciada" | "en_progreso" | "finalizada";

export interface CampaignSettings {
  titulo: string;
  subtitulo: string;
  meta: number;
  recaudado: number;
  donantes: number;
  sugerencias_impacto: { monto: number; descripcion: string }[];
}

export interface BankSettings {
  alias: string;
  cbu: string;
  banco: string;
  cuit: string;
  titular: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  campaignStatus: CampaignStatus;
  campaign: CampaignSettings;
  bank: BankSettings;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: "5493517680218",
  campaignStatus: "iniciada",
  campaign: {
    titulo: "Ayudanos a dejar Haruén hermosa",
    subtitulo: "",
    meta: 10000000,
    recaudado: 0,
    donantes: 0,
    sugerencias_impacto: [],
  },
  bank: { alias: "", cbu: "", banco: "", cuit: "", titular: "" },
};

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
}

export interface VariantDTO {
  id: string;
  name: string;
  price: number | null;
  stock: number;
}

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  featured: boolean;
  stock: number;
  lowStockThreshold: number;
  createdAt: string;
  category: CategoryDTO | null;
  images: { url: string; alt: string }[];
  variants: VariantDTO[];
}

export interface NewsDTO {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl: string | null;
  publishedAt: string | null;
}

export interface WorkshopDTO {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverUrl: string | null;
  modality: string;
  teacher: string;
  startsOn: string | null;
  endsOn: string | null;
}

export const SECTION_TYPES = [
  "hero",
  "campaign",
  "about",
  "impact",
  "info",
  "store",
  "news",
  "workshops",
  "donate",
  "contact",
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export interface SectionContent {
  title?: string;
  subtitle?: string;
}

export interface SectionDTO {
  id: string;
  type: SectionType | string;
  label: string;
  position: number;
  isVisible: boolean;
  content: SectionContent;
}

/** Stock label shown to shoppers. */
export function stockLabel(stock: number, threshold: number): { text: string; tone: "ok" | "low" | "out" } {
  if (stock <= 0) return { text: "Sin stock", tone: "out" };
  if (stock <= threshold) return { text: stock === 1 ? "Última unidad" : `Últimas ${stock} unidades`, tone: "low" };
  return { text: "Disponible", tone: "ok" };
}

/** Midpoint position for drag-and-drop reordering by interpolation. */
export function positionBetween(before: number | null, after: number | null): number {
  if (before == null && after == null) return 1;
  if (before == null) return (after as number) - 1;
  if (after == null) return before + 1;
  return (before + after) / 2;
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}
