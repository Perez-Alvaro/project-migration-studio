import React from "react";
import Image from "@/components/shared/app-image";
import { Info, Instagram, Facebook, Users, Heart, GraduationCap, Shield, BookOpen, Hash, Leaf, Globe2, Palette, Music, Dumbbell, Brain, ChefHat } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/fade-in";
import HaruenAbout from "@/assets/haruen-about.jpg";
import WorkshopEducation from "@/assets/workshop-education.jpg";
import WorkshopVitrofusion from "@/assets/workshop-vitrofusion.jpg";
import WorkshopMusic from "@/assets/workshop-music.jpg";
import WorkshopSports from "@/assets/workshop-sports.jpg";
import WorkshopPsychology from "@/assets/workshop-psychology.jpg";
import WorkshopCooking from "@/assets/workshop-cooking.jpg";

const VALORES = [
    {
        icon: Users,
        title: "Comunidad que Socializa",
        desc: "Generamos espacios de encuentro e integración social para nuestros alumnos y sus familias.",
    },
    {
        icon: Heart,
        title: "Amor y Alegría",
        desc: "Cada día es una oportunidad para aprender con una sonrisa.",
    },
    {
        icon: GraduationCap,
        title: "Profesionales Capacitados",
        desc: "Equipo especializado que trabaja en conjunto con las familias.",
    },
    {
        icon: Shield,
        title: "Derechos y Dignidad",
        desc: "Defendemos los derechos de las personas con discapacidad.",
    },
];

const TALLERES = [
    { title: "Lengua", desc: "Lectura, escritura y comunicación adaptada a diferentes niveles.", image: WorkshopEducation, icon: BookOpen },
    { title: "Matemática", desc: "Números, operaciones y resolución de problemas cotidianos.", image: WorkshopEducation, icon: Hash },
    { title: "Ciencias Naturales", desc: "Exploración del mundo natural con experiencias prácticas.", image: WorkshopEducation, icon: Leaf },
    { title: "Ciencias Sociales", desc: "Conocimiento del entorno social, historia y geografía.", image: WorkshopEducation, icon: Globe2 },
    { title: "Vitrofusión", desc: "Creación artística con vidrio fusionado. Nuestro orgullo.", image: WorkshopVitrofusion, icon: Palette },
    { title: "Musicoterapia", desc: "Música como herramienta terapéutica y expresiva.", image: WorkshopMusic, icon: Music },
    { title: "Actividad Física", desc: "Deportes y movimiento adaptado para el bienestar.", image: WorkshopSports, icon: Dumbbell },
    { title: "Gabinete de Psicología", desc: "Acompañamiento emocional: autoconocimiento y emociones.", image: WorkshopPsychology, icon: Brain },
    { title: "Cocina y Alimentación", desc: "Aprendemos a cocinar y disfrutamos juntos del almuerzo.", image: WorkshopCooking, icon: ChefHat },
];

export function AboutSection() {
    return (
        <section id="nosotros" className="haruen-section bg-card scroll-mt-24">
            <div className="haruen-container flex flex-col gap-12">

                {/* — Foto + Texto en dos columnas — */}
                <div className="grid gap-10 lg:grid-cols-2 items-center">
                    {/* Imagen */}
                    <FadeIn direction="right">
                        <div className="rounded-2xl overflow-hidden shadow-warm">
                            <Image
                                src={HaruenAbout}
                                alt="Equipo del Centro Educativo Terapéutico Haruén"
                                width={1200}
                                height={480}
                                className="w-full h-[320px] md:h-[420px] object-cover"
                            />
                        </div>
                    </FadeIn>

                    {/* Texto */}
                    <FadeIn direction="left" delay={0.2}>
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:block mt-8 lg:mt-0">
                            <div className="haruen-badge">
                                <Info size={14} />
                                <span>Quiénes Somos</span>
                            </div>
                            <h2 className="text-clamp-h2 font-bold mb-6 leading-tight">
                                Un equipo que acompaña{" "}
                                <br className="hidden md:block" />
                                el desarrollo de cada alumno.
                            </h2>
                            <div className="space-y-5 text-lg text-foreground leading-relaxed">
                                <p>
                                    Somos un centro educativo terapéutico para personas con discapacidades
                                    intelectuales que promueve y acompaña el desarrollo mediante
                                    actividades de aprendizaje, gabinetes y talleres especializados.
                                </p>
                                <p>
                                    Nos destacamos por nuestro equipo de profesionales altamente capacitados
                                    que trabajan en conjunto con las familias, buscando siempre la inclusión
                                    y la participación activa de los alumnos en la comunidad.
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-5">
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Seguinos:</p>
                                <a
                                    href="https://www.instagram.com/fundacionharuen?igsh=dDhnMWlrZ2ljMHAy&utm_source=qr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary-ink hover:border-primary hover:bg-primary/5 transition-all shadow-sm"
                                    aria-label="Instagram de Fundación Haruen"
                                >
                                    <Instagram size={20} />
                                </a>
                                <a
                                    href="https://www.facebook.com/share/1J9EHTZrj4/?mibextid=wwXIfr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary-ink hover:border-primary hover:bg-primary/5 transition-all shadow-sm"
                                    aria-label="Facebook de Fundación Haruen"
                                >
                                    <Facebook size={20} />
                                </a>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* — Cards de valores — */}
                <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {VALORES.map(({ icon: Icon, title, desc }) => (
                        <FadeInStaggerItem
                            key={title}
                            className="haruen-card haruen-card-muted p-6 flex flex-col gap-4"
                        >
                            <div className="w-14 h-14 rounded-2xl gradient-teal flex items-center justify-center">
                                <Icon size={26} className="text-hero-foreground" />
                            </div>
                            <h3 className="text-lg font-bold leading-snug">{title}</h3>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                {desc}
                            </p>
                        </FadeInStaggerItem>
                    ))}
                </FadeInStagger>

            </div>
        </section>
    );
}
