import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/home/hero-section";
import { DonationCampaign } from "@/components/donations/donation-campaign";
import { AboutSection } from "@/components/home/about-section";
import { ImpactSection } from "@/components/home/impact-section";
import { InfoSection } from "@/components/home/info-section";
import { StoreSection } from "@/components/home/store-section";
import { DonateSection } from "@/components/home/donate-section";
import { ContactSection } from "@/components/home/contact-section";
import { NewsSection, WorkshopsSection } from "@/components/home/feed-sections";
import { RouteError } from "@/components/shared/page-header";
import { useSuspenseQuery } from "@tanstack/react-query";
import { homeQuery } from "@/lib/queries";
import type { SectionDTO } from "@/lib/types";
import { SITE_URL } from "@/lib/metadata";
import heroLcp from "@/assets/haruen-about.jpg";

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
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: "Promovemos la inclusión de personas con discapacidad intelectual mediante talleres integrales." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "preload", as: "image", href: heroLcp, fetchPriority: "high" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  errorComponent: ({ error }) => <RouteError error={error} />,
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(homeQuery);

  function render(section: SectionDTO) {
    switch (section.type) {
      case "hero": return <HeroSection key={section.id} />;
      case "campaign": return <DonationCampaign key={section.id} />;
      case "about": return <AboutSection key={section.id} />;
      case "impact": return <ImpactSection key={section.id} />;
      case "info": return <InfoSection key={section.id} />;
      case "store": return <StoreSection key={section.id} products={data.products} content={section.content} />;
      case "news": return <NewsSection key={section.id} news={data.news} content={section.content} />;
      case "workshops": return <WorkshopsSection key={section.id} workshops={data.workshops} content={section.content} />;
      case "donate": return <DonateSection key={section.id} />;
      case "contact": return <ContactSection key={section.id} />;
      default: return null;
    }
  }

  return <div className="flex-1 w-full bg-background flex flex-col">{data.sections.map(render)}</div>;
}
