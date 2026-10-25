/** Paramètres d'URL du catalogue, synchronisés avec le routeur. */
export interface CatalogueSearch {
  q?: string;
  marque?: string;
  badge?: string;
  sub?: string;
  tri?: string;
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
