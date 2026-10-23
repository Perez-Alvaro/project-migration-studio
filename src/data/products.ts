// Catálogo estático de productos Haruén — Arte en Vitrofusión
// IMPORTANTE: las imágenes se referencian como string key y se resuelven
// en los componentes mediante el mapa PRODUCT_IMAGES (que maneja StaticImageData).

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number; // en pesos ARS
    description: string;
    category: string;
    /** Clave para resolver la imagen en PRODUCT_IMAGES */
    imageKey: string;
    tags: string[];
    featured: boolean;
}

export const WHATSAPP_PHONE = "5493517680218"; // número de contacto — Santiago Barale

export const PRODUCTS: Product[] = [
    // ── Novedades ─────────────────────────────────────────────────────────────
    {
        id: "perchero-doble",
        name: "Perchero doble",
        slug: "perchero-doble",
        price: 20000,
        description:
            "Perchero doble confeccionado artesanalmente por los alumnos del taller Haruén. Una pieza práctica y decorativa con un toque único en sus detalles.",
        category: "decoracion",
        imageKey: "perchero-doble",
        tags: ["perchero", "doble", "decoracion", "artesanal"],
        featured: true,
    },
    // ── Piezas featured (vitrofusión espirales) ───────────────────────────────
    {
        id: "espirales-cuadrados",
        name: "Espirales Cuadrados",
        slug: "espirales-cuadrados",
        price: 30000,
        description:
            "Móviles de vitrofusión con forma cuadrada y espirales de colores únicos. Cada pieza es creada a mano por los alumnos del taller Haruén, perfecta para alegrar cualquier ambiente.",
        category: "decoracion",
        imageKey: "vitro4",
        tags: ["espirales", "cuadrados", "colgantes", "vitrofusion"],
        featured: true,
    },
    {
        id: "espirales-caracol",
        name: "Espirales Caracol",
        slug: "espirales-caracol",
        price: 30000,
        description:
            "Delicados espirales de vidrio con forma de caracol, fundidos artesanalmente en el taller Haruén. Su diseño orgánico captura la luz de manera irrepetible.",
        category: "decoracion",
        imageKey: "vitro1",
        tags: ["espirales", "caracol", "colgantes", "vitrofusion"],
        featured: true,
    },
    {
        id: "espiral-colgante",
        name: "Espiral Colgante",
        slug: "espiral-colgante",
        price: 25000,
        description:
            "Pieza colgante en espiral elaborada con técnica de vitrofusión por los alumnos de Haruén. Ideal para ventanas y espacios donde la luz realza sus colores.",
        category: "decoracion",
        imageKey: "vitro3",
        tags: ["espiral", "colgante", "decoracion", "vitrofusion"],
        featured: true,
    },


    // ── Papelería y Agendas ───────────────────────────────────────────────────
    {
        id: "agenda-monitor-lisas",
        name: "Agenda Tam. Monitor Hojas Lisas",
        slug: "agenda-monitor-lisas",
        price: 6000,
        description: "Agenda elaborada y encuadernada a mano por nuestros alumnos. Tamaño monitor con hojas lisas, ideal para diseño o apuntes creativos.",
        category: "papeleria",
        imageKey: "agenda-monitor",
        tags: ["agenda", "papeleria", "artesanal"],
        featured: false,
    },
    {
        id: "agenda-rivadavia-cuadriculada",
        name: "Agenda Tam. Rivadavia Hoja Cuadriculada",
        slug: "agenda-rivadavia-cuadriculada",
        price: 8000,
        description: "Práctica agenda tamaño Rivadavia con hojas cuadriculadas. Cada ejemplar cuenta con detalles en su encuadernación realizados con mucho amor.",
        category: "papeleria",
        imageKey: "agenda-rivadavia",
        tags: ["agenda", "papeleria", "cuadriculada", "artesanal"],
        featured: false,
    },
    {
        id: "anotadores-lisa",
        name: "Anotadores Hoja Lisa",
        slug: "anotadores-lisa",
        price: 3000,
        description: "Anotadores prácticos con hojas lisas encuadernados de forma artesanal. Un producto solidario perfecto para regalar o llevar siempre con vos.",
        category: "papeleria",
        imageKey: "anotadores",
        tags: ["anotador", "papeleria", "artesanal"],
        featured: false,
    },
    {
        id: "cuaderno-a4-rayadas",
        name: "Cuaderno A4 Hojas Rayadas",
        slug: "cuaderno-a4-rayadas",
        price: 12000,
        description: "Cuaderno clásico tamaño A4 con hojas rayadas. Su encuadernación de calidad es resultado del trabajo y aprendizaje constante de nuestros alumnos.",
        category: "papeleria",
        imageKey: "cuaderno-a4",
        tags: ["cuaderno", "papeleria", "a4", "artesanal"],
        featured: false,
    },
    {
        id: "cuaderno-a4-zurdo",
        name: "Cuaderno A4 para Zurdos Hojas Rayadas",
        slug: "cuaderno-a4-zurdo",
        price: 12000,
        description: "Un cuaderno A4 con encuadernación especialmente diseñada de forma invertida para mayor comodidad de personas zurdas. Hojas rayadas.",
        category: "papeleria",
        imageKey: "cuaderno-a4-zurdo",
        tags: ["cuaderno", "zurdo", "papeleria", "a4", "artesanal"],
        featured: false,
    },

    // ── Decoración ────────────────────────────────────────────────────────────
    {
        id: "portavelas",
        name: "Portavelas",
        slug: "portavelas",
        price: 14000,
        description:
            "Portavelas decorativos de vitrofusión, en pequeño formato. Cada uno es una pieza única hecha a mano por los alumnos del taller Haruén.",
        category: "decoracion",
        imageKey: "vitro2",
        tags: ["portavelas", "decoracion", "vitrofusion"],
        featured: false,
    },
    {
        id: "plato-sushi",
        name: "Plato para sushi",
        slug: "plato-para-sushi",
        price: 25000,
        description:
            "Plato alargado en vitrofusión, ideal para presentar sushi o como pieza decorativa de mesa. Creado artesanalmente por los alumnos de Haruén.",
        category: "decoracion",
        imageKey: "plato-sushi",
        tags: ["plato", "sushi", "decoracion", "vitrofusion"],
        featured: false,
    },
    {
        id: "bandeja-13x29",
        name: "Bandeja 13x29",
        slug: "bandeja-13x29",
        price: 15000,
        description:
            "Bandeja rectangular de vitrofusión de 13×29 cm, perfecta para organizar o decorar cualquier espacio. Pieza artesanal elaborada en el taller Haruén.",
        category: "decoracion",
        imageKey: "bandeja-13x29",
        tags: ["bandeja", "decoracion", "vitrofusion"],
        featured: false,
    },
    {
        id: "bandeja-23x31",
        name: "Bandeja 23x31",
        slug: "bandeja-23x31",
        price: 20000,
        description:
            "Bandeja de vitrofusión de 23×31 cm con acabado artesanal único. Ideal para centro de mesa o como elemento decorativo de autor creado en Haruén.",
        category: "decoracion",
        imageKey: "bandeja-23x31",
        tags: ["bandeja", "decoracion", "vitrofusion"],
        featured: false,
    },
    {
        id: "bandeja-19x36",
        name: "Bandeja 19x36",
        slug: "bandeja-19x36",
        price: 22000,
        description:
            "Elegante bandeja alargada de vitrofusión de 19×36 cm, perfecta para servir o decorar. Cada pieza conserva el sello artesanal de los alumnos de Haruén.",
        category: "decoracion",
        imageKey: "bandeja-19x36",
        tags: ["bandeja", "decoracion", "vitrofusion"],
        featured: false,
    },
    {
        id: "pinches-jardin",
        name: "Pinches para jardín",
        slug: "pinches-jardin",
        price: 20000,
        description:
            "Pinches decorativos para jardín con detalles en vitrofusión, que combinan originalidad y arte natural. Hechos a mano por los alumnos del taller Haruén.",
        category: "decoracion",
        imageKey: "percheros",
        tags: ["pinches", "jardin", "decoracion", "vitrofusion"],
        featured: false,
    },
    {
        id: "fuente-circular-grande",
        name: "Fuente circular grande",
        slug: "fuente-circular-grande",
        price: 98000,
        description:
            "Imponente fuente circular de gran formato en vitrofusión, pieza central de cualquier mesa o ambiente. Obra artesanal de alto impacto creada en el taller Haruén.",
        category: "decoracion",
        imageKey: "fuenton-circular",
        tags: ["fuente", "circular", "decoracion", "vitrofusion"],
        featured: false,
    },
    {
        id: "ceniceros",
        name: "Ceniceros",
        slug: "ceniceros",
        price: 15000,
        description:
            "Ceniceros artesanales en vitrofusión con diseños únicos e irrepetibles. Una pieza funcional y decorativa creada por los alumnos de Haruén.",
        category: "decoracion",
        imageKey: "ceniceros",
        tags: ["cenicero", "decoracion", "vitrofusion"],
        featured: false,
    },
    {
        id: "centro-mesa-ovalado",
        name: "Centro de mesa ovalado",
        slug: "centro-de-mesa-ovalado",
        price: 50000,
        description:
            "Centro de mesa de forma ovalada en vitrofusión, ideal para dar un toque de color y elegancia artesanal. Pieza única elaborada en el taller Haruén.",
        category: "decoracion",
        imageKey: "centro-mesa-ovalado",
        tags: ["centro-de-mesa", "ovalado", "decoracion", "vitrofusion"],
        featured: false,
    },
];

export function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}
