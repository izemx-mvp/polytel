/**
 * Catalogue produits POLYTEL — données statiques typées, structurées pour être
 * remplacées plus tard par un appel API (même forme d'objet).
 */
import { allUniverses, getCategory } from "./categories";
import { UNKNOWN_BRAND, getBrandName } from "./brands";

export interface ProductSpec {
  label: string;
  value: string;
}

export type ProductBadge = "Promo" | "Destockage" | "Nouveau" | "Brother officiel";

export interface Product {
  id: string;
  slug: string;
  name: string;
  reference: string;
  /** Slug de marque, voir src/data/brands.ts */
  brand: string;
  /** Slug d'univers, voir src/data/categories.ts */
  universe: string;
  /** Slug de sous-catégorie (absent pour les univers sans sous-catégorie) */
  subcategory?: string;
  /** Troisième niveau (ex. « Laser monochrome ») */
  type?: string;
  /** Attributs techniques filtrables (voir attributeLabels) */
  attributes?: string[];
  images: string[];
  shortDescription: string;
  description?: string;
  specs: ProductSpec[];
  badges: ProductBadge[];
  /** Prix en MAD HT — null tant que showPublicPrices = false */
  priceHT: number | null;
  datasheetUrl?: string;
  relatedIds: string[];
  /** Consommables compatibles (ids) */
  consumableIds?: string[];
  /** true = fiche exemple à remplacer */
  placeholder?: boolean;
}

export const SAMPLE_FLAG = "CONTENU EXEMPLE À REMPLACER";

const IMG_BASE = "https://www.polytel.ma/media/cache/sylius_shop_product_large_thumbnail/";
const img = (path: string) => `${IMG_BASE}${path}`;

const pendingSheet = `Fiche technique détaillée sur demande auprès de nos conseillers. ${SAMPLE_FLAG}.`;

const realProducts: Product[] = [
  // --- Impression ---
  {
    id: "p1",
    slug: "brother-dcp-t310",
    name: "Brother DCP-T310",
    reference: "DCP-T310",
    brand: "brother",
    universe: "impression",
    subcategory: "multifonctions",
    type: "Couleur",
    attributes: ["jet-encre", "multifonction", "wifi"],
    images: [img("2c/29/ea726504bc9c379813b82e18cfb3.jpeg")],
    shortDescription:
      "Multifonction jet d'encre couleur 3-en-1 : impression, copie et numérisation couleur au format A4.",
    specs: [
      { label: "Technologie", value: "Jet d'encre" },
      { label: "Fonctions", value: "Impression, copie et numérisation couleur" },
      { label: "Résolution d'impression max.", value: "1200 × 6000 dpi" },
      { label: "Vitesse d'impression", value: "10 ppm (couleur, qualité normale, A4)" },
      { label: "Résolution de copie", value: "1200 × 1200 dpi" },
      { label: "Numérisation optique", value: "1200 × 2400 dpi" },
      { label: "Format max.", value: "A4" },
      { label: "Bac d'entrée", value: "100 feuilles" },
      { label: "Bac de sortie", value: "50 feuilles" },
      { label: "Connectivité", value: "Wi-Fi" },
      { label: "Couleur", value: "Noir" },
    ],
    badges: ["Promo", "Brother officiel"],
    priceHT: null,
    datasheetUrl:
      "https://www.brother.ee/-/media/product-downloads/devices/printers/dcp/dcpt310/product_leaflet_dcp-t310.ashx",
    relatedIds: ["p2", "p3", "p6"],
  },
  {
    id: "p2",
    slug: "brother-dcp-t510w",
    name: "Brother DCP-T510W",
    reference: "DCP-T510W",
    brand: "brother",
    universe: "impression",
    subcategory: "multifonctions",
    type: "Couleur",
    attributes: ["jet-encre", "multifonction"],
    images: [img("1e/3d/43bde57605df53f8bba7b996ee52.jpeg")],
    shortDescription: `Multifonction couleur Brother. ${pendingSheet}`,
    specs: [],
    badges: ["Promo", "Brother officiel"],
    priceHT: null,
    relatedIds: ["p1", "p3"],
  },
  {
    id: "p3",
    slug: "brother-mfc-j985dw",
    name: "Brother MFC-J985DW",
    reference: "MFC-J985DW",
    brand: "brother",
    universe: "impression",
    subcategory: "multifonctions",
    type: "Couleur",
    attributes: ["jet-encre", "multifonction"],
    images: [img("40/64/b89632e1e7efbe026c49bab5750c.png")],
    shortDescription: `Multifonction couleur Brother. ${pendingSheet}`,
    specs: [],
    badges: ["Brother officiel"],
    priceHT: null,
    relatedIds: ["p1", "p2"],
  },
  {
    id: "p4",
    slug: "brother-rj-3150",
    name: "Brother RJ-3150",
    reference: "RJ-3150",
    brand: "brother",
    universe: "impression",
    subcategory: "imprimantes-mobiles",
    images: [img("47/84/c22b4688377e6e0b32d4d64e8c04.png")],
    shortDescription: `Imprimante mobile Brother. ${pendingSheet}`,
    specs: [],
    badges: ["Promo", "Brother officiel"],
    priceHT: null,
    relatedIds: ["p5"],
  },
  {
    id: "p5",
    slug: "brother-pt-h110",
    name: "Brother PT-H110",
    reference: "PT-H110",
    brand: "brother",
    universe: "impression",
    subcategory: "etiqueteuses",
    images: [img("de/ae/b76e817143dba3fc9587e250e4fb.png")],
    shortDescription: `Étiqueteuse Brother P-touch. ${pendingSheet}`,
    specs: [],
    badges: ["Promo", "Brother officiel"],
    priceHT: null,
    relatedIds: ["p4"],
  },
  {
    id: "p6",
    slug: "brother-tn-2410",
    name: "Brother TN-2410",
    reference: "TN-2410",
    brand: "brother",
    universe: "impression",
    subcategory: "consommables",
    type: "Toner & Drum",
    images: [img("5b/df/00ea38a6b39bb11d58464a3471f1.png")],
    shortDescription: `Toner d'origine Brother pour imprimantes et multifonctions laser Brother compatibles. ${pendingSheet}`,
    specs: [],
    badges: ["Brother officiel"],
    priceHT: null,
    relatedIds: [],
  },
  {
    id: "p7",
    slug: "evolis-primacy",
    name: "Evolis Primacy",
    reference: "PRIMACY",
    brand: "evolis",
    universe: "impression",
    subcategory: "imprimantes-badges",
    images: [img("b3/85/f81bc0609b19b866bdd36e3240da.jpeg")],
    shortDescription: `Imprimante de badges Evolis. ${pendingSheet}`,
    specs: [],
    badges: ["Promo"],
    priceHT: null,
    relatedIds: [],
  },
  {
    id: "p8",
    slug: "sharp-ar-6020n",
    name: "Sharp AR-6020N",
    reference: "AR-6020N",
    brand: "sharp",
    universe: "impression",
    subcategory: "copieurs",
    images: [img("84/64/2a036c8f6bddf49e1000a3d5a785.png")],
    shortDescription: `Copieur Sharp. ${pendingSheet}`,
    specs: [],
    badges: ["Promo"],
    priceHT: null,
    relatedIds: [],
  },

  // --- Caisse & POS ---
  {
    id: "p9",
    slug: "sharp-xe-a217",
    name: "Sharp XE-A217 B/W",
    reference: "XE-A217",
    brand: "sharp",
    universe: "caisse-pos",
    subcategory: "caisses-enregistreuses",
    images: [img("b0/c4/566b63f6dd34700b17f1efee2a47.jpeg")],
    shortDescription: `Caisse enregistreuse Sharp. ${pendingSheet}`,
    specs: [],
    badges: ["Promo"],
    priceHT: null,
    relatedIds: ["p10", "p11"],
  },
  {
    id: "p10",
    slug: "sharp-xe-a207",
    name: "Sharp XE-A207 B/W",
    reference: "XE-A207",
    brand: "sharp",
    universe: "caisse-pos",
    subcategory: "caisses-enregistreuses",
    images: [img("bd/be/517c451f0e1def74f9384d9a3470.jpeg")],
    shortDescription: `Caisse enregistreuse Sharp. ${pendingSheet}`,
    specs: [],
    badges: [],
    priceHT: null,
    relatedIds: ["p9"],
  },
  {
    id: "p11",
    slug: "qs-microtouch",
    name: "QS-MICROTOUCH",
    reference: "QS-MICROTOUCH",
    brand: UNKNOWN_BRAND,
    universe: "caisse-pos",
    subcategory: "terminaux-pos",
    images: [img("53/1b/6984d3068f2a736efc2d4245ea22.jpeg")],
    shortDescription: `Terminal point de vente. ${pendingSheet}`,
    specs: [],
    badges: [],
    priceHT: null,
    relatedIds: ["p12", "p9"],
  },
  {
    id: "p12",
    slug: "next-10",
    name: "NEXT 10",
    reference: "NEXT 10",
    brand: UNKNOWN_BRAND,
    universe: "caisse-pos",
    /** Sous-catégorie À CONFIRMER */
    subcategory: "terminaux-pos",
    images: [img("c7/23/74ec5a02e0c9987fcaf1cc3c907a.jpeg")],
    shortDescription: `Terminal point de vente (catégorie À CONFIRMER). ${pendingSheet}`,
    specs: [],
    badges: [],
    priceHT: null,
    relatedIds: ["p11"],
  },

  // --- Informatique ---
  {
    id: "p13",
    slug: "zebra-tc72-tc77-touch",
    name: "TC72/TC77 Touch",
    reference: "TC72/TC77",
    brand: "zebra",
    universe: "informatique",
    subcategory: "terminaux-mobiles",
    images: [img("6d/e6/82bdf2219bc656359b1fdf89c200.jpeg")],
    shortDescription: `Terminal mobile tactile. ${pendingSheet}`,
    specs: [],
    badges: [],
    priceHT: null,
    relatedIds: [],
  },
  {
    id: "p14",
    slug: "ngs-wireless-groove-kit",
    name: "NGS Wireless Groove Kit",
    reference: "GROOVE KIT",
    brand: "ngs",
    universe: "informatique",
    subcategory: "accessoires-pc",
    type: "Kits souris+clavier",
    images: [img("99/39/65bfd7e91b34b36143f9dff6f897.png")],
    shortDescription: `Kit clavier et souris sans fil. ${pendingSheet}`,
    specs: [],
    badges: [],
    priceHT: null,
    relatedIds: [],
  },

  // --- Destructeurs & divers ---
  {
    id: "p15",
    slug: "olympia-ps-53-cc",
    name: "Olympia PS 53 CC",
    reference: "PS 53 CC",
    brand: "olympia",
    universe: "destructeurs-divers",
    subcategory: "destructeurs-documents",
    images: [img("d0/ef/2fcd9d48a08ec72a063547659df2.jpeg")],
    shortDescription: `Destructeur de documents Olympia. ${pendingSheet}`,
    specs: [],
    badges: ["Promo"],
    priceHT: null,
    relatedIds: [],
  },

  // --- Mobilier de bureau ---
  {
    id: "p16",
    slug: "bureau-dg-3023-131375",
    name: "Bureau DG",
    reference: "3023-131375",
    brand: UNKNOWN_BRAND,
    universe: "mobilier-bureau",
    subcategory: "bureaux-direction",
    images: [img("4e/e4/88d8132a6322a67907515883823b.jpeg")],
    shortDescription: `Bureau de direction. ${pendingSheet}`,
    specs: [],
    badges: [],
    priceHT: null,
    relatedIds: [],
  },
];

/* ------------------------------------------------------------------
 * Modèles exemples — CONTENU EXEMPLE À REMPLACER
 * Deux fiches par sous-catégorie sans produit réel, pour qu'aucune
 * liste ne soit vide. Visuel = silhouette neutre + référence.
 * ------------------------------------------------------------------ */

/** Marques suggérées par la nomenclature pour certaines sous-catégories. */
const placeholderBrands: Record<string, [string, string]> = {
  "impression/imprimantes": ["brother", "hp"],
  "impression/imprimantes-etiquettes": ["zebra", "tsc"],
  "impression/telecopieurs": ["brother", "sharp"],
  "impression/imprimantes-bracelets": ["zebra", "brother"],
  "caisse-pos/lecteurs-code-barres": ["honeywell", "zebra"],
  "informatique/ordinateurs-tablettes": ["hp", UNKNOWN_BRAND],
  "informatique/power-banks": ["ngs", UNKNOWN_BRAND],
  "multimedia/audio": ["ngs", UNKNOWN_BRAND],
  "identification-tracabilite/": ["videojet", "sato"],
  "onduleurs/": ["salicru", "salicru"],
  "destructeurs-divers/machines-a-ecrire": ["olympia", "olympia"],
  "espace-couture/broderie-couture": ["alfa", "jaki"],
  "espace-couture/surjeteuses-recouvreuses": ["jack", "brother"],
  "espace-couture/scan-n-cut": ["brother", "brother"],
  "espace-couture/machines-decoupe": ["brother", UNKNOWN_BRAND],
  "espace-couture/accessoires": ["brother", "alfa"],
};

/** Attributs/types attribués aux exemples pour que les filtres soient démontrables. */
const placeholderVariants: Record<string, [Partial<Product>, Partial<Product>]> = {
  "impression/imprimantes": [
    { type: "Laser monochrome", attributes: ["laser-mono", "wifi"], consumableIds: ["p6"] },
    { type: "Laser couleur", attributes: ["laser-couleur"] },
  ],
  "impression/multifonctions": [{ type: "Monochrome", attributes: ["laser-mono"] }, {}],
  "impression/consommables": [{ type: "Cartouches" }, { type: "Rubans & films" }],
  "informatique/mobilite-protection": [{ type: "Cartables" }, { type: "Packs" }],
  "informatique/accessoires-pc": [{ type: "Souris" }, { type: "Claviers" }],
  "multimedia/audio": [{ type: "Casques" }, { type: "Enceintes" }],
};

function initials(slug: string): string {
  return slug
    .split("-")
    .filter((w) => w.length > 2)
    .map((w) => w.slice(0, 3))
    .join("")
    .slice(0, 8)
    .toUpperCase();
}

function buildPlaceholders(existing: Product[]): Product[] {
  const out: Product[] = [];
  let n = 0;
  for (const universe of allUniverses) {
    const buckets =
      universe.subcategories.length > 0
        ? universe.subcategories.map((s) => ({ sub: s.slug, label: s.name }))
        : [{ sub: undefined, label: universe.name }];
    for (const bucket of buckets) {
      const has = existing.some(
        (p) => p.universe === universe.slug && p.subcategory === bucket.sub,
      );
      if (has) continue;
      const key = `${universe.slug}/${bucket.sub ?? ""}`;
      const brandsFor = placeholderBrands[key] ?? [UNKNOWN_BRAND, UNKNOWN_BRAND];
      const variants = placeholderVariants[key] ?? [{}, {}];
      for (const i of [0, 1] as const) {
        n += 1;
        const code = initials(bucket.sub ?? universe.slug);
        const reference = `EX-${code}-0${i + 1}`;
        const badges: ProductBadge[] = [];
        if (n % 6 === 0) badges.push("Destockage");
        if (n % 5 === 0) badges.push("Nouveau");
        const brand = brandsFor[i];
        if (brand === "brother") badges.push("Brother officiel");
        out.push({
          id: `x${n}`,
          slug: `exemple-${universe.slug}-${bucket.sub ?? "general"}-${i + 1}`,
          name: `${bucket.label} — modèle exemple ${i + 1}`,
          reference,
          brand,
          universe: universe.slug,
          ...(bucket.sub ? { subcategory: bucket.sub } : {}),
          images: [],
          shortDescription: `Référence de démonstration pour la rubrique « ${bucket.label} ». ${SAMPLE_FLAG}.`,
          specs: [],
          badges,
          priceHT: null,
          relatedIds: [],
          placeholder: true,
          ...variants[i],
        });
      }
    }
  }
  return out;
}

export const products: Product[] = [...realProducts, ...buildPlaceholders(realProducts)];

/* ---------------- Accès aux données ---------------- */

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const getProductById = (id: string) => products.find((p) => p.id === id);

export const productsByUniverse = (universe: string) =>
  products.filter((p) => p.universe === universe);

export const productsBySubcategory = (universe: string, sub: string) =>
  products.filter((p) => p.universe === universe && p.subcategory === sub);

export const productsByBrand = (brandSlug: string) => products.filter((p) => p.brand === brandSlug);

export const productsWithBadge = (badge: ProductBadge) =>
  products.filter((p) => p.badges.includes(badge));

export const brandName = (p: Product) => getBrandName(p.brand);

export const universeName = (p: Product) => getCategory(p.universe)?.name ?? p.universe;

export const subcategoryName = (p: Product) =>
  getCategory(p.universe)?.subcategories.find((s) => s.slug === p.subcategory)?.name;

/** Produits similaires : relatedIds puis même sous-catégorie, même univers, même marque. */
export function similarProducts(product: Product, count = 8): Product[] {
  const picked = new Map<string, Product>();
  const push = (p: Product | undefined) => {
    if (p && p.id !== product.id && !picked.has(p.id)) picked.set(p.id, p);
  };
  product.relatedIds.forEach((id) => push(getProductById(id)));
  products
    .filter((p) => p.universe === product.universe && p.subcategory === product.subcategory)
    .forEach(push);
  products.filter((p) => p.universe === product.universe).forEach(push);
  products.filter((p) => p.brand === product.brand).forEach(push);
  return [...picked.values()].slice(0, count);
}

/** Consommables compatibles — uniquement les compatibilités déclarées (jamais déduites). */
export function compatibleConsumables(product: Product): Product[] {
  return (product.consumableIds ?? []).map(getProductById).filter((p): p is Product => Boolean(p));
}

/** Produits pour lesquels un consommable est déclaré compatible. */
export function compatibleDevices(consumable: Product): Product[] {
  return products.filter((p) => p.consumableIds?.includes(consumable.id));
}

/** « Souvent demandés ensemble » : consommables + accessoires du même univers. */
export function frequentlyTogether(product: Product, count = 4): Product[] {
  const set = new Map<string, Product>();
  compatibleConsumables(product).forEach((p) => set.set(p.id, p));
  products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.universe === product.universe &&
        p.subcategory !== product.subcategory &&
        !p.placeholder,
    )
    .forEach((p) => set.set(p.id, p));
  return [...set.values()].slice(0, count);
}
