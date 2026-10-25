import { useQuery } from "@tanstack/react-query";
import { sectionsQuery } from "@/lib/queries";
import { SECTION_TYPES, type SectionType } from "@/lib/types";

const ALL_VISIBLE = new Set<string>(SECTION_TYPES);

/**
 * Visible home sections, primed by the root loader.
 * Falls back to "all visible" while loading so the navbar never flashes empty.
 */
export function useVisibleSections(): Set<string> {
  const { data } = useQuery(sectionsQuery);
  if (!data) return ALL_VISIBLE;
  return new Set(data.filter((s) => s.isVisible).map((s) => s.type));
}

export function isSectionVisible(visible: Set<string>, type: SectionType): boolean {
  return visible.has(type);
}
