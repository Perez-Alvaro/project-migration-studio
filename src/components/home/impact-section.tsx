import React from "react";
import { IMPACTO } from "./hero-section";

export function ImpactSection() {
    return (
        <section className="bg-primary-dark py-14">
            <div className="haruen-container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    {IMPACTO.map((stat) => (
                        <div key={stat.label} className="text-hero-foreground">
                            <p
                                className="text-4xl md:text-5xl font-bold text-hero-foreground leading-none"
                                aria-label={`${stat.num} ${stat.label}`}
                            >
                                {stat.num}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-hero-foreground/75" aria-hidden="true">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
