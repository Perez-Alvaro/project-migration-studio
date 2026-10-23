// Mapa de imágenes de productos — SOLO importar desde Client Components
import type { StaticImageData } from "@/components/shared/app-image";
import Vitro1Asset from "@/assets/vitro1.webp.asset.json";
const Vitro1 = Vitro1Asset.url;
import Vitro2Asset from "@/assets/vitro2.webp.asset.json";
const Vitro2 = Vitro2Asset.url;
import Vitro3Asset from "@/assets/vitro3.webp.asset.json";
const Vitro3 = Vitro3Asset.url;
import Vitro4Asset from "@/assets/vitro4.webp.asset.json";
const Vitro4 = Vitro4Asset.url;
import BandejaSushiAsset from "@/assets/plato-para-sushi.webp.asset.json";
const BandejaSushi = BandejaSushiAsset.url;
import Bandeja13x29Asset from "@/assets/bandeja-13x29.webp.asset.json";
const Bandeja13x29 = Bandeja13x29Asset.url;
import Bandeja23x31Asset from "@/assets/bandeja-23x31.webp.asset.json";
const Bandeja23x31 = Bandeja23x31Asset.url;
import Bandeja19x36Asset from "@/assets/bandeja-19x36.webp.asset.json";
const Bandeja19x36 = Bandeja19x36Asset.url;
import CentroMesaAsset from "@/assets/centro-de-mesa-ovalado.webp.asset.json";
const CentroMesa = CentroMesaAsset.url;
import FuentonAsset from "@/assets/fuenton-circular-grande.webp.asset.json";
const Fuenton = FuentonAsset.url;
import CenicerosAsset from "@/assets/ceniceros.webp.asset.json";
const Ceniceros = CenicerosAsset.url;
import PercherosAsset from "@/assets/percheros.webp.asset.json";
const Percheros = PercherosAsset.url;
import AgendaMonitorAsset from "@/assets/agenda-tam-monitor-hojaslisas-6000.webp.asset.json";
const AgendaMonitor = AgendaMonitorAsset.url;
import AgendaRivadaviaAsset from "@/assets/agenda-tam-rivadavia-hojacuadriculada-8000.webp.asset.json";
const AgendaRivadavia = AgendaRivadaviaAsset.url;
import AnotadoresAsset from "@/assets/anotadores-hojalisa-3000.webp.asset.json";
const Anotadores = AnotadoresAsset.url;
import CuadernoA4Asset from "@/assets/cuadernoa4-hojas-rayadas-12000.webp.asset.json";
const CuadernoA4 = CuadernoA4Asset.url;
import CuadernoA4ZurdoAsset from "@/assets/cuadernoa4zurdo-hojas-rayadas12000.webp.asset.json";
const CuadernoA4Zurdo = CuadernoA4ZurdoAsset.url;
import PercheroDobleAsset from "@/assets/perchero-doble-20000.webp.asset.json";
const PercheroDoble = PercheroDobleAsset.url;

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
};
