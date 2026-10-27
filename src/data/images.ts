// Mapa de imágenes de productos y resolución dinámica (Supabase + assets locales)
import type { StaticImageData } from "@/components/shared/app-image";
import Vitro1 from "@/assets/vitro1.png";
import Vitro2 from "@/assets/vitro2.png";
import Vitro3 from "@/assets/vitro3.png";
import Vitro4 from "@/assets/vitro4.png";
import BandejaSushi from "@/assets/plato para sushi.jpg";
import Bandeja13x29 from "@/assets/Bandeja 13x29.jpg";
import Bandeja23x31 from "@/assets/Bandeja 23x31.jpg";
import Bandeja19x36 from "@/assets/Bandeja 19x36.jpg";
import CentroMesa from "@/assets/Centro de mesa ovalado.jpg";
import Fuenton from "@/assets/Fuenton circular grande.jpg";
import Ceniceros from "@/assets/ceniceros.jpg";
import Percheros from "@/assets/percheros.jpg";
import AgendaMonitor from "@/assets/agenda-tam-monitor-hojaslisas-$6000.jpg";
import AgendaRivadavia from "@/assets/agenda-tam-rivadavia-hojacuadriculada-$8000.jpg";
import Anotadores from "@/assets/anotadores-hojalisa-$3000.jpg";
import CuadernoA4 from "@/assets/cuadernoA4-hojas-rayadas-$12000.jpg";
import CuadernoA4Zurdo from "@/assets/cuadernoA4zurdo-hojas-rayadas$12000.jpg";
import PercheroDoble from "@/assets/perchero-doble-$20000.jpg";
import Product1 from "@/assets/product-1.jpg";
import Product2 from "@/assets/product-2.jpg";
import Product3 from "@/assets/product-3.jpg";
import Product4 from "@/assets/product-4.jpg";

export const PRODUCT_IMAGES: Record<string, StaticImageData> = {
    vitro1: Vitro1,
    vitro2: Vitro2,
    vitro3: Vitro3,
    vitro4: Vitro4,
    "plato-sushi": BandejaSushi,
    "bandeja-13x29": Bandeja13x29,
    "bandeja-23x31": Bandeja23x31,
    "bandeja-19x36": Bandeja19x36,
    "centro-mesa-ovalado": CentroMesa,
    "fuenton-circular": Fuenton,
    ceniceros: Ceniceros,
    percheros: Percheros,
    "agenda-monitor": AgendaMonitor,
    "agenda-rivadavia": AgendaRivadavia,
    anotadores: Anotadores,
    "cuaderno-a4": CuadernoA4,
    "cuaderno-a4-zurdo": CuadernoA4Zurdo,
    "perchero-doble": PercheroDoble,
    "product-1": Product1,
    "product-2": Product2,
    "product-3": Product3,
    "product-4": Product4,
};

export const SLUG_TO_IMAGE: Record<string, string> = {
    "perchero-doble": PercheroDoble,
    "espirales-cuadrados": Vitro4,
    "espirales-caracol": Vitro1,
    "espiral-colgante": Vitro3,
    "agenda-monitor-lisas": AgendaMonitor,
    "agenda-rivadavia-cuadriculada": AgendaRivadavia,
    "anotadores-lisa": Anotadores,
    "cuaderno-a4-rayadas": CuadernoA4,
    "cuaderno-a4-zurdo": CuadernoA4Zurdo,
    "portavelas": Vitro2,
    "plato-para-sushi": BandejaSushi,
    "plato-sushi": BandejaSushi,
    "bandeja-13x29": Bandeja13x29,
    "bandeja-23x31": Bandeja23x31,
    "bandeja-19x36": Bandeja19x36,
    "pinches-jardin": Percheros,
    "fuente-circular-grande": Fuenton,
    "fuenton-circular": Fuenton,
    "ceniceros": Ceniceros,
    "centro-de-mesa-ovalado": CentroMesa,
    "centro-mesa-ovalado": CentroMesa,
};

const FILENAME_TO_IMAGE: Record<string, string> = {
    "perchero-doble": PercheroDoble,
    "vitro4": Vitro4,
    "vitro1": Vitro1,
    "vitro3": Vitro3,
    "vitro2": Vitro2,
    "agenda-tam-monitor": AgendaMonitor,
    "agenda-tam-rivadavia": AgendaRivadavia,
    "anotadores": Anotadores,
    "cuadernoa4-hojas-rayadas": CuadernoA4,
    "cuadernoa4zurdo": CuadernoA4Zurdo,
    "plato-para-sushi": BandejaSushi,
    "bandeja-13x29": Bandeja13x29,
    "bandeja-23x31": Bandeja23x31,
    "bandeja-19x36": Bandeja19x36,
    "percheros": Percheros,
    "fuenton-circular-grande": Fuenton,
    "ceniceros": Ceniceros,
    "centro-de-mesa-ovalado": CentroMesa,
    "product-1": Product1,
    "product-2": Product2,
    "product-3": Product3,
    "product-4": Product4,
};

/**
 * Devuelve la imagen local de fallback cargada en assets si existe para ese slug o url previa.
 */
export function getProductAssetFallback(slug?: string | null, url?: string | null): string | undefined {
    if (slug && SLUG_TO_IMAGE[slug]) {
        return SLUG_TO_IMAGE[slug];
    }
    if (url) {
        const clean = url.toLowerCase();
        for (const [key, asset] of Object.entries(FILENAME_TO_IMAGE)) {
            if (clean.includes(key.toLowerCase())) {
                return asset;
            }
        }
    }
    return undefined;
}

/**
 * Resuelve la imagen del producto según los requerimientos:
 * 1. Si no hay URL, usa la imagen local en assets correspondiente al producto.
 * 2. Si la URL apunta al proxy interno roto de Lovable (/__l5e/assets-v1/...),
 *    la reemplaza por la imagen real de assets para que no rompa en Vercel ni en producción.
 * 3. Si la URL es una imagen de Supabase (ej: /media/productos/..., bucket Supabase o URL externa),
 *    la carga DIRECTAMENTE desde Supabase.
 */
export function resolveProductImage(url?: string | null, slug?: string | null): string {
    if (!url || typeof url !== "string" || !url.trim()) {
        return getProductAssetFallback(slug, url) || "";
    }
    const trimmed = url.trim();
    if (trimmed.startsWith("/__l5e/")) {
        const fallback = getProductAssetFallback(slug, trimmed);
        if (fallback) return fallback;
    }
    return trimmed;
}
