import {
  Armchair,
  BatteryCharging,
  Monitor,
  MonitorPlay,
  Paperclip,
  Printer,
  ScanBarcode,
  ScanLine,
  Scissors,
  Shredder,
  Store,
  type LucideIcon,
} from "lucide-react";

/** Troisième niveau (facultatif) : affiché comme filtre « Type » dans le catalogue. */
export interface SubCategory {
  slug: string;
  name: string;
  types?: string[];
}

export interface Category {
  slug: string;
  name: string;
  icon: LucideIcon;
  /** Une ligne pour les tuiles et le mega menu */
  blurb: string;
  /** Introduction de l'en-tête catalogue */
  intro: string;
  subcategories: SubCategory[];
  /** Slug du produit mis en avant (mega menu, bento) */
  featuredProduct?: string;
}

export const categories: Category[] = [
  {
    slug: "impression",
    name: "Impression",
    icon: Printer,
    blurb: "Imprimantes, multifonctions, copieurs, étiquetage et consommables d'origine.",
    intro:
      "Du poste individuel au service reprographie : imprimantes laser et jet d'encre, multifonctions, copieurs, imprimantes d'étiquettes, de badges et de bracelets, avec leurs consommables d'origine.",
    featuredProduct: "brother-mfc-j985dw",
    subcategories: [
      {
        slug: "imprimantes",
        name: "Imprimantes",
        types: ["Laser monochrome", "Laser couleur", "Jet d'encre couleur"],
      },
      { slug: "multifonctions", name: "Multifonctions", types: ["Monochrome", "Couleur"] },
      { slug: "copieurs", name: "Copieurs" },
      { slug: "telecopieurs", name: "Télécopieurs" },
      { slug: "imprimantes-mobiles", name: "Imprimantes mobiles" },
      { slug: "imprimantes-badges", name: "Imprimantes badges" },
      { slug: "imprimantes-etiquettes", name: "Imprimantes d'étiquettes" },
      { slug: "etiqueteuses", name: "Étiqueteuses" },
      { slug: "imprimantes-bracelets", name: "Imprimantes à bracelets" },
      {
        slug: "consommables",
        name: "Consommables",
        types: ["Cartouches", "Toner & Drum", "Rubans & films", "Cartes badges"],
      },
    ],
  },
  {
    slug: "scanner",
    name: "Scanner",
    icon: ScanLine,
    blurb: "Scanners mobiles, compacts et de bureau, lecteurs de passeports.",
    intro:
      "Numérisez vos documents au bureau comme en mobilité : scanners compacts, scanners de bureau et lecteurs de passeports pour les guichets et l'accueil.",
    subcategories: [
      { slug: "scanners-mobiles", name: "Scanners mobiles" },
      { slug: "scanners-compacts-bureau", name: "Scanners compacts & bureau" },
      { slug: "lecteurs-passeports", name: "Lecteurs de passeports" },
    ],
  },
  {
    slug: "caisse-pos",
    name: "Caisse & POS",
    icon: Store,
    blurb: "Caisses enregistreuses, terminaux POS, écrans tactiles et lecteurs code-barres.",
    intro:
      "Tout l'encaissement de votre point de vente : caisses enregistreuses, terminaux POS tactiles, afficheurs client, lecteurs code-barres et logiciels de gestion.",
    featuredProduct: "sharp-xe-a217",
    subcategories: [
      { slug: "caisses-enregistreuses", name: "Caisses enregistreuses" },
      { slug: "ecrans-tactiles", name: "Écrans tactiles" },
      { slug: "afficheurs", name: "Afficheurs" },
      { slug: "lecteurs-code-barres", name: "Lecteurs code-barres" },
      { slug: "terminaux-pos", name: "Terminaux POS" },
      { slug: "logiciels-gestion", name: "Logiciels de gestion" },
    ],
  },
  {
    slug: "informatique",
    name: "Informatique",
    icon: Monitor,
    blurb: "Ordinateurs, tablettes, terminaux mobiles et accessoires PC.",
    intro:
      "Équipez vos équipes au bureau comme sur le terrain : ordinateurs et tablettes, terminaux mobiles durcis, accessoires, protection et sécurité logicielle.",
    featuredProduct: "zebra-tc72-tc77-touch",
    subcategories: [
      { slug: "ordinateurs-tablettes", name: "Ordinateurs & tablettes" },
      { slug: "terminaux-mobiles", name: "Terminaux mobiles" },
      { slug: "mobilite-protection", name: "Mobilité & protection", types: ["Cartables", "Packs"] },
      { slug: "power-banks", name: "Power banks" },
      {
        slug: "accessoires-pc",
        name: "Accessoires PC",
        types: ["Souris", "Claviers", "Kits souris+clavier"],
      },
      { slug: "antivirus", name: "Antivirus" },
    ],
  },
  {
    slug: "identification-tracabilite",
    name: "Identification & traçabilité",
    icon: ScanBarcode,
    blurb: "Marquage, codage et traçabilité des produits, colis et actifs.",
    intro:
      "Solutions d'identification et de traçabilité pour l'industrie et la logistique : marquage, codage et étiquetage avec Zebra, Honeywell, SATO et Videojet.",
    subcategories: [],
  },
  {
    slug: "multimedia",
    name: "Multimédia",
    icon: MonitorPlay,
    blurb: "Affichage dynamique, audiovisuel, sonorisation et audio.",
    intro:
      "Affichage dynamique pour vos points de vente, équipements audiovisuels et de sonorisation, casques et enceintes pour vos espaces professionnels.",
    subcategories: [
      { slug: "affichage-dynamique", name: "Affichage dynamique" },
      { slug: "audiovisuel-sonorisation", name: "Audiovisuel & sonorisation" },
      { slug: "audio", name: "Audio", types: ["Casques", "Enceintes"] },
    ],
  },
  {
    slug: "destructeurs-divers",
    name: "Destructeurs & divers",
    icon: Shredder,
    blurb: "Destructeurs, machines à écrire, compteuses de billets, file d'attente.",
    intro:
      "Confidentialité et gestion des flux : destructeurs de documents, machines à écrire, compteuses et détecteurs de billets, systèmes de gestion de file d'attente.",
    featuredProduct: "olympia-ps-53-cc",
    subcategories: [
      { slug: "destructeurs-documents", name: "Destructeurs de documents" },
      { slug: "machines-a-ecrire", name: "Machines à écrire" },
      { slug: "compteuses-billets", name: "Compteuses de billets" },
      { slug: "detecteurs-faux-billets", name: "Détecteurs de faux billets" },
      { slug: "gestion-file-attente", name: "Gestion de file d'attente" },
    ],
  },
  {
    slug: "fourniture-bureau",
    name: "Fourniture de bureau",
    icon: Paperclip,
    blurb: "Papier, archivage, classement, fournitures et calculatrices.",
    intro:
      "Le consommable de bureau au quotidien pour les entreprises, administrations et revendeurs : papier, archivage, classement, petites fournitures et calculatrices.",
    subcategories: [
      { slug: "papier", name: "Papier" },
      { slug: "boites-sacs-archives", name: "Boîtes & sacs d'archives" },
      { slug: "chemises-carte-lustree", name: "Chemises en carte lustrée" },
      { slug: "jeux-intercalaires", name: "Jeux d'intercalaires" },
      { slug: "fournitures", name: "Fournitures" },
      { slug: "calculatrices", name: "Calculatrices" },
    ],
  },
  {
    slug: "mobilier-bureau",
    name: "Mobilier de bureau",
    icon: Armchair,
    blurb: "Chaises, fauteuils de direction, bureaux, banquettes et open space.",
    intro:
      "Aménagez des espaces de travail durables : sièges, fauteuils de direction, bureaux, tables basses, banquettes d'accueil et postes open space.",
    featuredProduct: "bureau-dg-3023-131375",
    subcategories: [
      { slug: "chaises-bureau", name: "Chaises de bureau" },
      { slug: "fauteuils-direction", name: "Fauteuils de direction" },
      { slug: "tables-basses", name: "Tables basses" },
      { slug: "bureaux-direction", name: "Bureaux de direction" },
      { slug: "banquettes", name: "Banquettes" },
      { slug: "open-space", name: "Open space" },
    ],
  },
  {
    slug: "onduleurs",
    name: "Onduleurs",
    icon: BatteryCharging,
    blurb: "Protection électrique de vos postes, serveurs et équipements.",
    intro:
      "Protégez vos équipements contre les coupures et variations de tension : onduleurs pour postes de travail, points de vente et salles serveurs.",
    subcategories: [],
  },
];

/** Sous-univers « Espace couture » — page dédiée /espace-couture. */
export const coutureUniverse: Category = {
  slug: "espace-couture",
  name: "Espace couture",
  icon: Scissors,
  blurb: "Machines à coudre et à broder, surjeteuses, Scan N Cut et accessoires.",
  intro:
    "Machines à coudre et à broder Brother, Alfa, Jaki et Jack, surjeteuses et recouvreuses, Scan N Cut, machines de découpe et accessoires d'origine.",
  subcategories: [
    { slug: "broderie-couture", name: "Broderie & couture" },
    { slug: "surjeteuses-recouvreuses", name: "Surjeteuses / Recouvreuses" },
    { slug: "scan-n-cut", name: "Scan N Cut" },
    { slug: "machines-decoupe", name: "Machines de découpe" },
    { slug: "accessoires", name: "Accessoires" },
  ],
};

export const allUniverses: Category[] = [...categories, coutureUniverse];

export const getCategory = (slug: string) => allUniverses.find((c) => c.slug === slug);

export const getSubcategory = (universeSlug: string, subSlug: string) =>
  getCategory(universeSlug)?.subcategories.find((s) => s.slug === subSlug);

/** Libellés des attributs techniques utilisés comme filtres. */
export const attributeLabels: Record<string, string> = {
  "laser-mono": "Laser monochrome",
  "laser-couleur": "Laser couleur",
  "jet-encre": "Jet d'encre",
  multifonction: "Multifonction",
  wifi: "Wi-Fi",
};

/** Univers où les attributs techniques sont pertinents. */
export const universesWithAttributes = ["impression"];
