import React from "react";
import { IMPACTO } from "./hero-section";

export function ImpactSection() {
    return (
        <section className="bg-primary-dark py-14">
            {/* antes: bg-primary #27B5C8 sin contraste suficiente con texto blanco */}
            <div className="haruen-container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    {IMPACTO.map((stat) => (
                        <div key={stat.label} className="text-white">
                            {/* text-white sobre #14545D: ratio ~8.5:1 ✅ WCAG AAA (antes text-secondary amarillo: FAIL) */}
                            <p
                                className="text-4xl md:text-5xl font-bold text-white leading-none"
                                aria-label={`${stat.num} ${stat.label}`}
                            >
                                {stat.num}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white/75" aria-hidden="true">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
