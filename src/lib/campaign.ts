export type CampaignStatus = "iniciada" | "en_progreso" | "finalizada";

export interface ImpactSuggestion {
    monto: number;
    descripcion: string;
}

export interface CampaignData {
    titulo: string;
    subtitulo: string;
    meta: number;
    recaudado_iniciada: number;
    recaudado_progreso: number;
    recaudado_final: number;
    donantes_iniciada: number;
    donantes_progreso: number;
    donantes_final: number;
    whatsapp_number: string;
    sugerencias_impacto: ImpactSuggestion[];
    transferencia: {
        alias: string;
        cbu: string;
        banco: string;
        cuit: string;
        titular: string;
    };
}

// ============================================================================
// CONFIGURACIÓN DE CAMPAÑA - FUNDACIÓN HARUÉN
// ----------------------------------------------------------------------------
// Meta oficial: $10.000.000 (Diez millones de pesos)
// Para actualizar el monto recaudado o datos de la campaña,
// el desarrollador solo debe editar los valores de esta constante:
// ============================================================================
export const CAMPAIGN_DATA: CampaignData = {
    titulo: "Ayudanos a dejar Haruén hermosa",
    subtitulo:
        "Tu aporte, sin importar el monto, hace una gran diferencia. Con $1.000, $2.000 o lo que puedas sumar hoy, compramos pintura, rodillos y materiales para que nuestros 26 alumnos disfruten de un espacio seguro, alegre y renovado.",
    meta: 10000000,
    recaudado_iniciada: 1250000,
    recaudado_progreso: 5350000,
    recaudado_final: 10000000,
    donantes_iniciada: 38,
    donantes_progreso: 146,
    donantes_final: 280,
    whatsapp_number: "5493517680218",
    sugerencias_impacto: [
        { monto: 1500, descripcion: "Lijas y cinta de enmascarar" },
        { monto: 3500, descripcion: "Pinceles y espátulas" },
        { monto: 7500, descripcion: "Rodillo profesional y bandeja" },
        { monto: 15000, descripcion: "1 litro de látex lavable especial" },
    ],
    transferencia: {
        alias: "AMOR.TIPO.DESEO",
        cbu: "0200923401000003535214",
        banco: "Bco Córdoba (Bancor)",
        cuit: "30-70335352-1",
        titular: "FUNDACION HARUEN",
    },
};
