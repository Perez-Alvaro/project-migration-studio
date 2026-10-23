import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/home/hero-section";
import { DonationCampaign } from "@/components/donations/donation-campaign";
import { AboutSection } from "@/components/home/about-section";
import { ImpactSection } from "@/components/home/impact-section";
import { InfoSection } from "@/components/home/info-section";
import { StoreSection } from "@/components/home/store-section";
import { DonateSection } from "@/components/home/donate-section";
import { ContactSection } from "@/components/home/contact-section";
import { SITE_URL } from "@/lib/metadata";
import heroLcp from "@/assets/haruen-about.webp.asset.json";

const TITLE = "Centro Educativo Terapéutico Haruén | Córdoba";
const DESCRIPTION =
  "Fundación Haruén es un Centro Educativo Terapéutico en Córdoba. Promovemos la inclusión de personas con discapacidad intelectual mediante talleres integrales.";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Centro Educativo Terapéutico Haruén",
  url: SITE_URL,
  description: "Centro Educativo Terapéutico para personas con discapacidad intelectual en Córdoba.",
  address: { "@type": "PostalAddress", addressLocality: "Córdoba", addressRegion: "CBA", addressCountry: "AR" },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: "Promovemos la inclusión de personas con discapacidad intelectual mediante talleres integrales." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "preload", as: "image", href: heroLcp.url, fetchPriority: "high" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="flex-1 w-full bg-background flex flex-col">
      <HeroSection />
      {/* Estado de la campaña: 'iniciada' | 'en_progreso' | 'finalizada' */}
      <DonationCampaign status="iniciada" />
      <AboutSection />
      <ImpactSection />
      <InfoSection />
      <StoreSection />
      <DonateSection />
      <ContactSection />
    </div>
  );
}
