"use client";

import {useState} from "react";

const WA_ROGELIO = "5493517680218";

export function ContactForm() {
    const [sent, setSent] = useState(false);

    return (
        <div className="haruen-card p-6">
            <h3 className="text-lg font-bold mb-4">O dejanos un mensaje</h3>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const nombre = String(formData.get("nombre") || "").trim();
                    const mensaje = String(formData.get("mensaje") || "").trim();

                    const text = [
                        "📩 Nuevo mensaje del sitio web Haruén:",
                        `👤 Nombre: ${nombre || "(sin nombre)"}`,
                        `💬 Mensaje: ${mensaje || "(sin mensaje)"}`,
                    ].join("\n");

                    const url = `https://wa.me/${WA_ROGELIO}?text=${encodeURIComponent(text)}`;
                    window.open(url, "_blank", "noopener,noreferrer");
                    setSent(true);
                    setTimeout(() => setSent(false), 3000);
                }}
                className="space-y-4"
            >
                <div className="space-y-1.5">
                    <label htmlFor="contact-nombre" className="text-sm font-semibold">
                        Nombre
                    </label>
                    <input
                        id="contact-nombre"
                        name="nombre"
                        placeholder="Tu nombre"
                        className="haruen-input w-full"
                    />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="contact-mensaje" className="text-sm font-semibold">
                        Mensaje
                    </label>
                    <textarea
                        id="contact-mensaje"
                        name="mensaje"
                        placeholder="¿En qué podemos ayudarte?"
                        className="haruen-input w-full min-h-[120px] resize-y"
                    />
                </div>
                <button type="submit" className="btn-pill btn-secondary-neutral w-full justify-center text-sm">
                    {sent ? "¡Enviado!" : "📤 Enviar por WhatsApp"}
                </button>
            </form>
        </div>
    );
}
