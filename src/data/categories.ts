import {
  Printer,
  Scan,
  ShoppingCart,
  Monitor,
  Fingerprint,
  MonitorPlay,
  Shredder,
  Paperclip,
  Armchair,
  Scissors,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  slug: string;
  name: string;
  icon: LucideIcon;
  blurb: string;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    slug: "impression",
    name: "Impression",
    icon: Printer,
    blurb:
      "Imprimantes, multifonctions, copieurs et consommables d'origine pour tous les volumes d'impression professionnels.",
    subcategories: [
      "Imprimantes laser mono",
      "Imprimantes laser couleur",
      "Imprimantes jet d'encre",
      "Multifonctions",
      "Copieurs",
      "Télécopieurs",
      "Imprimantes mobiles",
      "Imprimantes à badges",
      "Imprimantes d'étiquettes",
      "Étiqueteuses",
      "Imprimantes à bracelets",
      "Consommables",
    ],
  },
  {
    slug: "scanner",
    name: "Scanner",
    icon: Scan,
    blurb:
      "Scanners mobiles, compacts et de bureau, lecteurs de passeports pour la numérisation professionnelle.",
    subcategories: [
      "Scanners mobiles",
      "Scanners compacts & de bureau",
      "Lecteurs de passeports",
    ],
  },
  {
    slug: "caisse-pos",
    name: "Caisse & POS",
    icon: ShoppingCart,
    blurb:
      "Solutions d'encaissement complètes : caisses, écrans tactiles, terminaux POS, lecteurs de code-barres et logiciels.",
    subcategories: [
      "Caisses enregistreuses",
      "Écrans tactiles",
      "Afficheurs",
      "Lecteurs de code-barres",
      "Terminaux POS",
      "Logiciels de caisse",
    ],
  },
  {
    slug: "informatique",
    name: "Informatique",
    icon: Monitor,
    blurb:
      "Ordinateurs, tablettes, terminaux mobiles et accessoires pour équiper vos équipes sur le terrain comme au bureau.",
    subcategories: [
      "Ordinateurs & tablettes",
      "Terminaux mobiles",
      "Mobilité & protection",
      "Power banks",
      "Accessoires PC",
      "Antivirus",
    ],
  },
  {
    slug: "identification",
    name: "Identification & traçabilité",
    icon: Fingerprint,
    blurb:
      "Marquage, codage et traçabilité industrielle : identification produits, colis et actifs.",
    subcategories: [
      "Traçabilité industrielle",
      "Marquage & codage",
      "Étiquettes & rubans",
    ],
  },
  {
    slug: "multimedia",
    name: "Multimédia",
    icon: MonitorPlay,
    blurb:
      "Affichage dynamique, audiovisuel et solutions audio pour vos points de vente et espaces d'accueil.",
    subcategories: ["Affichage dynamique", "Audiovisuel", "Audio"],
  },
  {
    slug: "destructeurs",
    name: "Destructeurs & divers",
    icon: Shredder,
    blurb:
      "Destructeurs de documents, compteuses et détecteurs de billets, gestion de file d'attente.",
    subcategories: [
      "Destructeurs de documents",
      "Machines à écrire",
      "Compteuses de billets",
      "Détecteurs de faux billets",
      "Gestion de file d'attente",
    ],
  },
  {
    slug: "fourniture",
    name: "Fourniture de bureau",
    icon: Paperclip,
    blurb:
      "Tout le consommable de bureau pour les entreprises, administrations et revendeurs.",
    subcategories: [
      "Écriture & correction",
      "Classement & archivage",
      "Papeterie",
      "Agrafage & perforation",
    ],
  },
  {
    slug: "mobilier",
    name: "Mobilier de bureau",
    icon: Armchair,
    blurb:
      "Aménagement d'espaces de travail : sièges, tables, rangements et accessoires.",
    subcategories: [
      "Sièges & fauteuils",
      "Tables & bureaux",
      "Rangements",
      "Accessoires de bureau",
    ],
  },
  {
    slug: "couture",
    name: "Espace couture",
    icon: Scissors,
    blurb:
      "Broderie, couture et création : machines, surjeteuses et solutions Scan N Cut.",
    subcategories: [
      "Broderie & couture",
      "Surjeteuses",
      "Scan N Cut",
      "Accessoires",
    ],
  },
];

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);
