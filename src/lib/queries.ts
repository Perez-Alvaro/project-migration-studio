import { queryOptions } from "@tanstack/react-query";
import {
  getHomeData,
  getNews,
  getProduct,
  getSiteSettings,
  getWorkshop,
  listNews,
  listProducts,
  listWorkshops,
} from "@/lib/public.functions";

export const settingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 60_000,
});

export const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: () => getHomeData(),
});

export type ShopSearch = { category?: string | undefined; q?: string | undefined; sort?: "destacados" | "nuevos" | "precio-asc" | "precio-desc" | undefined };

export const productsQuery = (s: ShopSearch) =>
  queryOptions({
    queryKey: ["products", s],
    queryFn: () => listProducts({ data: s }),
  });

export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }) });

export const newsListQuery = queryOptions({ queryKey: ["news"], queryFn: () => listNews() });
export const newsQuery = (slug: string) =>
  queryOptions({ queryKey: ["news", slug], queryFn: () => getNews({ data: { slug } }) });

export const workshopsQuery = queryOptions({ queryKey: ["workshops"], queryFn: () => listWorkshops() });
export const workshopQuery = (slug: string) =>
  queryOptions({ queryKey: ["workshop", slug], queryFn: () => getWorkshop({ data: { slug } }) });
