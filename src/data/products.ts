export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  reference: string;
  brand: string;
  /** Category slug, see src/data/categories.ts */
  universe: string;
  subcategory: string;
  image: string;
  shortDescription: string;
  specs: ProductSpec[];
  badges: string[];
  datasheetUrl?: string;
}

const IMG_BASE = "https://www.polytel.ma/media/cache/sylius_shop_product_large_thumbnail/";

const img = (path: string) => `${IMG_BASE}${path}`;

export const PLACEHOLDER_IMAGE = "/images/placeholder-product.svg";

export const products: Product[] = [
  // --- Impression ---
  {
    id: "p1",
    slug: "brother-dcp-t310",
    name: "Brother DCP-T310",
    reference: "DCPT310",
    brand: "Brother",
    universe: "impression",
    subcategory: "Multifonctions",
    image: img("2c/29/ea726504bc9c379813b82e18cfb3.jpeg"),
    shortDescription:
      "Multifonction jet d'encre couleur à réservoirs rechargeables, pensée pour les volumes quotidiens des petites structures.",
    specs: [
      { label: "Technologie", value: "Jet d'encre couleur" },
      { label: "Fonctions", value: "Impression / copie / scan couleur" },
      { label: "Résolution d'impression", value: "1200 × 6000 dpi" },
      { label: "Vitesse d'impression", value: "10 ppm" },
      { label: "Résolution de copie", value: "1200 × 1200 dpi" },
      { label: "Résolution de scan", value: "1200 × 2400 dpi" },
      { label: "Format papier", value: "A4" },
      { label: "Bac d'entrée", value: "100 feuilles" },
      { label: "Réceptacle de sortie", value: "50 feuilles" },
      { label: "Connectivité", value: "Wi-Fi" },
    ],
    badges: ["Promo"],
    datasheetUrl:
      "https://www.brother.ee/-/media/product-downloads/devices/printers/dcp/dcpt310/product_leaflet_dcp-t310.ashx",
  },
  {
    id: "p2",
    slug: "brother-dcp-t510w",
    name: "Brother DCP-T510W",
    reference: "DCPT510W",
    brand: "Brother",
    universe: "impression",
    subcategory: "Multifonctions",
    image: img("1e/3d/43bde57605df53f8bba7b996ee52.jpeg"),
    shortDescription:
      "Multifonction jet d'encre couleur avec connectivité Wi-Fi et réservoirs rechargeables pour une impression économique.",
    specs: [],
    badges: ["Promo"],
  },
  {
    id: "p3",
    slug: "brother-mfc-j985dw",
    name: "Brother MFC-J985DW",
    reference: "MFCJ985DW",
    brand: "Brother",
    universe: "impression",
    subcategory: "Multifonctions",
    image: img("40/64/b89632e1e7efbe026c49bab5750c.png"),
    shortDescription:
      "Multifonction jet d'encre 4-en-1 avec fax, télécopieur et INKvestment pour un coût page maîtrisé.",
    specs: [],
    badges: [],
  },
  {
    id: "p4",
    slug: "brother-rj-3150",
    name: "Brother RJ-3150",
    reference: "RJ3150",
    brand: "Brother",
    universe: "impression",
    subcategory: "Imprimantes mobiles",
    image: img("47/84/c22b4688377e6e0b32d4d64e8c04.png"),
    shortDescription:
      "Imprimante d'étiquettes mobile robuste pour la logistique et le terrain, résistante aux chocs et aux intempéries.",
    specs: [],
    badges: ["Promo"],
  },
  {
    id: "p5",
    slug: "brother-pt-h110",
    name: "Brother PT-H110",
    reference: "PTH110",
    brand: "Brother",
    universe: "impression",
    subcategory: "Étiqueteuses",
    image: img("de/ae/b76e817143dba3fc9587e250e4fb.png"),
    shortDescription:
      "Étiqueteuse compacte portable pour l'identification de dossiers, câbles et espaces de travail.",
    specs: [],
    badges: ["Promo"],
  },
  {
    id: "p6",
    slug: "brother-tn-2410",
    name: "Brother TN-2410",
    reference: "TN2410",
    brand: "Brother",
    universe: "impression",
    subcategory: "Consommables",
    image: img("5b/df/00ea38a6b39bb11d58464a3471f1.png"),
    shortDescription:
      "Toner d'origine Brother pour imprimantes laser de la gamme HL/MFC/DCP, qualité d'impression constante.",
    specs: [],
    badges: [],
  },
  {
    id: "p7",
    slug: "evolis-primacy",
    name: "Evolis Primacy",
    reference: "PRIMACY",
    brand: "Evolis",
    universe: "impression",
    subcategory: "Imprimantes à badges",
    image: img("b3/85/f81bc0609b19b866bdd36e3240da.jpeg"),
    shortDescription:
      "Imprimante de badges d'identification simple ou recto-verso, idéale pour les badges employés et visiteurs.",
    specs: [],
    badges: ["Promo"],
  },
  {
    id: "p8",
    slug: "sharp-ar-6020n",
    name: "Sharp AR-6020N",
    reference: "AR6020N",
    brand: "Sharp",
    universe: "impression",
    subcategory: "Copieurs",
    image: img("84/64/2a036c8f6bddf49e1000a3d5a785.png"),
    shortDescription:
      "Copieur réseau monochrome A3 pour les services documentaires, copie, impression et scan réseau.",
    specs: [],
    badges: ["Promo"],
  },

  // --- Caisse & POS ---
  {
    id: "p9",
    slug: "sharp-xe-a217",
    name: "Sharp XE-A217 B/W",
    reference: "XEA217",
    brand: "Sharp",
    universe: "caisse-pos",
    subcategory: "Caisses enregistreuses",
    image: img("b0/c4/566b63f6dd34700b17f1efee2a47.jpeg"),
    shortDescription:
      "Caisse enregistreuse électronique pour commerces, clavier matriciel et impression du ticket de caisse.",
    specs: [],
    badges: ["Promo"],
  },
  {
    id: "p10",
    slug: "sharp-xe-a207",
    name: "Sharp XE-A207 B/W",
    reference: "XEA207",
    brand: "Sharp",
    universe: "caisse-pos",
    subcategory: "Caisses enregistreuses",
    image: img("bd/be/517c451f0e1def74f9384d9a3470.jpeg"),
    shortDescription:
      "Caisse enregistreuse compacte avec afficheur client et gestion des départements de vente.",
    specs: [],
    badges: [],
  },
  {
    id: "p11",
    slug: "qs-microtouch",
    name: "QS-MICROTOUCH",
    reference: "QSMICROTOUCH",
    brand: "QS",
    universe: "caisse-pos",
    subcategory: "Terminaux POS",
    image: img("53/1b/6984d3068f2a736efc2d4245ea22.jpeg"),
    shortDescription:
      "Terminal point de vente tactile tout-en-un pour l'encaissement en boutique et en restauration.",
    specs: [],
    badges: [],
  },
  {
    id: "p12",
    slug: "next-10",
    name: "NEXT 10",
    reference: "NEXT10",
    brand: "NEXT",
    universe: "caisse-pos",
    subcategory: "Terminaux POS",
    image: img("c7/23/74ec5a02e0c9987fcaf1cc3c907a.jpeg"),
    shortDescription:
      "Système de caisse tactile compact pour les points de vente à fort passage.",
    specs: [],
    badges: [],
  },

  // --- Informatique ---
  {
    id: "p13",
    slug: "zebra-tc72-tc77-touch",
    name: "Zebra TC72/TC77 Touch",
    reference: "TC72TC77",
    brand: "Zebra",
    universe: "informatique",
    subcategory: "Terminaux mobiles",
    image: img("6d/e6/82bdf2219bc656359b1fdf89c200.jpeg"),
    shortDescription:
      "Terminal mobile Android tactile pour la distribution, la logistique et la gestion d'inventaire sur le terrain.",
    specs: [],
    badges: [],
  },
  {
    id: "p14",
    slug: "ngs-wireless-groove-kit",
    name: "NGS Wireless Groove Kit",
    reference: "NGSGROOVE",
    brand: "NGS",
    universe: "informatique",
    subcategory: "Accessoires PC",
    image: img("99/39/65bfd7e91b34b36143f9dff6f897.png"),
    shortDescription:
      "Ensemble clavier et souris sans fil pour les postes de travail au bureau.",
    specs: [],
    badges: [],
  },

  // --- Destructeurs & divers ---
  {
    id: "p15",
    slug: "olympia-ps-53-cc",
    name: "Olympia PS 53 CC",
    reference: "PS53CC",
    brand: "Olympia",
    universe: "destructeurs",
    subcategory: "Destructeurs de documents",
    image: img("d0/ef/2fcd9d48a08ec72a063547659df2.jpeg"),
    shortDescription:
      "Destructeur de documents à coupe croisée pour la destruction confidentielle au bureau.",
    specs: [],
    badges: ["Promo"],
  },

  // --- Mobilier de bureau ---
  {
    id: "p16",
    slug: "bureau-dg-3023-131375",
    name: "Bureau DG",
    reference: "3023-131375",
    brand: "Bureau DG",
    universe: "mobilier",
    subcategory: "Tables & bureaux",
    image: img("4e/e4/88d8132a6322a67907515883823b.jpeg"),
    shortDescription:
      "Bureau de direction pour l'aménagement des espaces de travail professionnels.",
    specs: [],
    badges: [],
  },

  // --- Modèles exemples (univers sans produit réel — CONTENU EXEMPLE À REMPLACER) ---
  {
    id: "x-scanner",
    slug: "modele-exemple-scanner",
    name: "Modèle exemple",
    reference: "EX-SCAN-001",
    brand: "À CONFIRMER",
    universe: "scanner",
    subcategory: "Scanners compacts & de bureau",
    image: PLACEHOLDER_IMAGE,
    shortDescription: "Scanner professionnel de numérisation de documents. CONTENU EXEMPLE À REMPLACER.",
    specs: [],
    badges: [],
  },
  {
    id: "x-identification",
    slug: "modele-exemple-identification",
    name: "Modèle exemple",
    reference: "EX-IDENT-001",
    brand: "À CONFIRMER",
    universe: "identification",
    subcategory: "Traçabilité industrielle",
    image: PLACEHOLDER_IMAGE,
    shortDescription: "Solution d'identification et de traçabilité industrielle. CONTENU EXEMPLE À REMPLACER.",
    specs: [],
    badges: [],
  },
  {
    id: "x-multimedia",
    slug: "modele-exemple-multimedia",
    name: "Modèle exemple",
    reference: "EX-MULTI-001",
    brand: "À CONFIRMER",
    universe: "multimedia",
    subcategory: "Affichage dynamique",
    image: PLACEHOLDER_IMAGE,
    shortDescription: "Écran d'affichage dynamique pour point de vente. CONTENU EXEMPLE À REMPLACER.",
    specs: [],
    badges: [],
  },
  {
    id: "x-fourniture",
    slug: "modele-exemple-fourniture",
    name: "Modèle exemple",
    reference: "EX-FOURN-001",
    brand: "À CONFIRMER",
    universe: "fourniture",
    subcategory: "Papeterie",
    image: PLACEHOLDER_IMAGE,
    shortDescription: "Article de fourniture de bureau pour professionnels. CONTENU EXEMPLE À REMPLACER.",
    specs: [],
    badges: [],
  },
  {
    id: "x-couture",
    slug: "modele-exemple-couture",
    name: "Modèle exemple",
    reference: "EX-COUTURE-001",
    brand: "À CONFIRMER",
    universe: "couture",
    subcategory: "Broderie & couture",
    image: PLACEHOLDER_IMAGE,
    shortDescription: "Machine à coudre professionnelle. CONTENU EXEMPLE À REMPLACER.",
    specs: [],
    badges: [],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const productsByUniverse = (universe: string) =>
  products.filter((p) => p.universe === universe);

export const productsByBrand = (brandSlug: string) => {
  const brand = brandsSlugToName(brandSlug);
  return products.filter((p) => normalizeBrand(p.brand) === brand);
};

import { brands } from "./brands";

function brandsSlugToName(slug: string): string {
  return brands.find((b) => b.slug === slug)?.name ?? slug;
}

export function normalizeBrand(name: string): string {
  return name.trim().toLowerCase();
}

export const similarProducts = (product: Product, count = 4) =>
  products
    .filter((p) => p.id !== product.id && (p.universe === product.universe || p.brand === product.brand))
    .slice(0, count);
