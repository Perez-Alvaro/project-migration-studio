import { supabase } from "@/integrations/supabase/client";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const MATERIAL_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function ext(name: string) {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return m ? m[1]!.toLowerCase() : "bin";
}

/** Uploads a public image to the media bucket and returns its site URL. */
export async function uploadImage(file: File, folder: "productos" | "novedades" | "talleres"): Promise<string> {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error("Subí una imagen JPG, PNG o WebP.");
  if (file.size > 10 * 1024 * 1024) throw new Error("La imagen supera los 10 MB. Elegí una más liviana.");
  const path = `${folder}/${crypto.randomUUID()}.${ext(file.name)}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) throw new Error("No pudimos subir la imagen. Probá de nuevo.");
  return `/media/${path}`;
}

export async function uploadMaterial(file: File, workshopId: string): Promise<{ path: string }> {
  if (!MATERIAL_TYPES.includes(file.type)) throw new Error("Subí un archivo PDF o Word (.doc, .docx).");
  if (file.size > 20 * 1024 * 1024) throw new Error("El archivo supera los 20 MB.");
  const path = `${workshopId}/${crypto.randomUUID()}.${ext(file.name)}`;
  const { error } = await supabase.storage.from("workshop-materials").upload(path, file, { contentType: file.type });
  if (error) throw new Error("No pudimos subir el archivo. Probá de nuevo.");
  return { path };
}

export function formatBytes(n: number): string {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
