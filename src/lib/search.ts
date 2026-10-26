/**
 * Recherche instantanée côté client (Fuse.js) sur le catalogue :
 * nom, référence, marque, univers et sous-catégorie.
 */
import Fuse from "fuse.js";
import { products, type Product } from "@/data/products";
import { getBrandName } from "@/data/brands";
import { getCategory } from "@/data/categories";

interface IndexedProduct {
  product: Product;
  name: string;
  reference: string;
  referenceCompact: string;
  brand: string;
  universe: string;
  subcategory: string;
}

const compact = (s: string) => s.replace(/[^a-z0-9]/gi, "").toLowerCase();

const indexed: IndexedProduct[] = products.map((p) => {
  const universe = getCategory(p.universe);
  return {
    product: p,
    name: p.name,
    reference: p.reference,
    referenceCompact: compact(p.reference),
    brand: getBrandName(p.brand),
    universe: universe?.name ?? "",
    subcategory: universe?.subcategories.find((s) => s.slug === p.subcategory)?.name ?? "",
  };
});

let fuse: Fuse<IndexedProduct> | null = null;

function getFuse() {
  fuse ??= new Fuse(indexed, {
    keys: [
      { name: "reference", weight: 3 },
      { name: "referenceCompact", weight: 3 },
      { name: "name", weight: 2 },
      { name: "brand", weight: 1.5 },
      { name: "subcategory", weight: 1 },
      { name: "universe", weight: 0.8 },
    ],
    threshold: 0.36,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  return fuse;
}

export function searchProducts(query: string, limit = 8): Product[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const results = getFuse().search(q, { limit: limit * 2 });
  // Les vraies fiches passent devant les modèles exemples.
  return results
    .map((r) => r.item.product)
    .sort((a, b) => Number(Boolean(a.placeholder)) - Number(Boolean(b.placeholder)))
    .slice(0, limit);
}

/** Ensemble des ids correspondants (filtre « q » du catalogue). */
export function matchingProductIds(query: string): Set<string> {
  const q = query.trim();
  if (q.length < 2) return new Set(products.map((p) => p.id));
  return new Set(
    getFuse()
      .search(q)
      .map((r) => r.item.product.id),
  );
}
