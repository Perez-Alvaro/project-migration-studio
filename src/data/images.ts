// Mapa de imágenes de productos — SOLO importar desde Client Components
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
