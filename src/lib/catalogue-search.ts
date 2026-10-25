export interface CatalogueSearch {
  q?: string | undefined;
  marque?: string | undefined;
  badge?: string | undefined;
  sub?: string | undefined;
  tri?: string | undefined;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function catalogueValidateSearch(search: Record<string, unknown>): CatalogueSearch {
  return {
    q: str(search.q),
    marque: str(search.marque),
    badge: str(search.badge),
    sub: str(search.sub),
    tri: str(search.tri),
  };
}

/** Page Promotions : badge verrouillé sur « Promo ». */
export function promotionsValidateSearch(search: Record<string, unknown>): CatalogueSearch {
  return { ...catalogueValidateSearch(search), badge: "Promo" };
}
