import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/types";

/** Site settings primed by the root loader; falls back to defaults while loading. */
export function useSiteSettings(): SiteSettings {
  const { data } = useQuery(settingsQuery);
  return data ?? DEFAULT_SETTINGS;
}
