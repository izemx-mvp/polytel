/**
 * Paramètres d'URL et logique de filtrage du catalogue.
 * Les filtres multi-valeurs sont sérialisés en listes séparées par des virgules
 * (ex. ?marque=brother,sharp&badge=Promo).
 */
import type { Product } from "@/data/products";
import { matchingProductIds } from "@/lib/search";

export interface CatalogueSearch {
  q?: string | undefined;
  /** Sous-catégorie (page /produits ou univers) */
  sub?: string | undefined;
  marque?: string | undefined;
  badge?: string | undefined;
  type?: string | undefined;
  attr?: string | undefined;
  tri?: string | undefined;
  vue?: string | undefined;
}

export type SortKey = "pertinence" | "az" | "nouveautes";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "az", label: "Nom A → Z" },
  { value: "nouveautes", label: "Nouveautés" },
];

function str(v: unknown): string | undefined {
  if (typeof v === "number") return String(v);
  return typeof v === "string" && v.trim().length > 0 ? v : undefined;
}

export function catalogueValidateSearch(search: Record<string, unknown>): CatalogueSearch {
  const out: CatalogueSearch = {};
  for (const key of ["q", "sub", "marque", "badge", "type", "attr", "tri", "vue"] as const) {
    const v = str(search[key]);
    if (v !== undefined) out[key] = v;
  }
  return out;
}

export const splitList = (v: string | undefined): string[] =>
  v ? v.split(",").filter((s) => s.length > 0) : [];

export const joinList = (list: string[]): string | undefined =>
  list.length > 0 ? list.join(",") : undefined;

export function toggleInList(v: string | undefined, item: string): string | undefined {
  const list = splitList(v);
  return joinList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
}

export interface FilterOptions {
  /** Ignore ce filtre (pour calculer les compteurs de facettes) */
  skip?: keyof CatalogueSearch;
}

export function applyFilters(
  pool: Product[],
  search: CatalogueSearch,
  { skip }: FilterOptions = {},
): Product[] {
  let list = pool;
  if (search.q && skip !== "q") {
    const ids = matchingProductIds(search.q);
    list = list.filter((p) => ids.has(p.id));
  }
  const subs = splitList(search.sub);
  if (subs.length && skip !== "sub") list = list.filter((p) => subs.includes(p.subcategory ?? ""));
  const brands = splitList(search.marque);
  if (brands.length && skip !== "marque") list = list.filter((p) => brands.includes(p.brand));
  const badges = splitList(search.badge);
  if (badges.length && skip !== "badge")
    list = list.filter((p) => badges.some((b) => (p.badges as string[]).includes(b)));
  const types = splitList(search.type);
  if (types.length && skip !== "type") list = list.filter((p) => types.includes(p.type ?? ""));
  const attrs = splitList(search.attr);
  if (attrs.length && skip !== "attr")
    list = list.filter((p) => attrs.every((a) => p.attributes?.includes(a)));
  return list;
}

export function sortProducts(list: Product[], tri: string | undefined): Product[] {
  const key = (tri ?? "pertinence") as SortKey;
  const indexed = list.map((p, i) => ({ p, i }));
  indexed.sort((a, b) => {
    if (key === "az") return a.p.name.localeCompare(b.p.name, "fr");
    if (key === "nouveautes") {
      const na = Number(a.p.badges.includes("Nouveau"));
      const nb = Number(b.p.badges.includes("Nouveau"));
      return nb - na || b.i - a.i;
    }
    // Pertinence : vraies fiches d'abord, offres ensuite, puis ordre catalogue.
    const ra = Number(Boolean(a.p.placeholder)) * 2 - Number(a.p.badges.includes("Promo"));
    const rb = Number(Boolean(b.p.placeholder)) * 2 - Number(b.p.badges.includes("Promo"));
    return ra - rb || a.i - b.i;
  });
  return indexed.map((x) => x.p);
}

export function countBy<T extends string>(
  list: Product[],
  get: (p: Product) => T | T[] | undefined,
): Map<T, number> {
  const map = new Map<T, number>();
  for (const p of list) {
    const v = get(p);
    const values = Array.isArray(v) ? v : v === undefined ? [] : [v];
    for (const x of values) map.set(x, (map.get(x) ?? 0) + 1);
  }
  return map;
}
