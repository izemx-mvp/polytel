export interface Brand {
  slug: string;
  name: string;
  /** URL du logo — null = logo texte (placeholder) */
  logo: string | null;
  /** Une ligne : ce que Polytel distribue pour la marque */
  line: string;
  /** Mise en avant (partenaire historique) */
  official?: boolean;
}

export const brands: Brand[] = [
  {
    slug: "brother",
    name: "Brother",
    logo: "https://www.polytel.ma/uploads/8351dc51128479e9bb7bc48603b0ac3b.png",
    line: "Imprimantes, multifonctions, étiqueteuses P-touch, imprimantes mobiles, machines à coudre et à broder.",
    official: true,
  },
  {
    slug: "sharp",
    name: "Sharp",
    logo: "https://www.polytel.ma/uploads/13f3611ebb82ca907a827ca723d4368e.png",
    line: "Copieurs et caisses enregistreuses.",
  },
  {
    slug: "evolis",
    name: "Evolis",
    logo: "https://www.polytel.ma/uploads/43eab5baa5ec3c756ba4b77c4d0e2d01.jpeg",
    line: "Imprimantes de badges et cartes plastiques.",
  },
  {
    slug: "olympia",
    name: "Olympia",
    logo: "https://www.polytel.ma/uploads/930cedd26ced88327b0d822973e69af6.png",
    line: "Destructeurs de documents et équipements de bureau.",
  },
  {
    slug: "hp",
    name: "HP",
    logo: "https://www.polytel.ma/uploads/00ec7959940a8bbd0a6b79059b67864e.jpeg",
    line: "Informatique et impression.",
  },
  {
    slug: "zebra",
    name: "Zebra",
    logo: "https://www.polytel.ma/uploads/5e137a0219f6f754909d7c1e5bc9d3ef.png",
    line: "Imprimantes d'étiquettes et terminaux mobiles.",
  },
  {
    slug: "honeywell",
    name: "Honeywell",
    logo: "https://www.polytel.ma/uploads/635a8fc75b92e3a3df2949393f84c9dc.png",
    line: "Lecteurs code-barres et imprimantes d'étiquettes.",
  },
  {
    slug: "alfa",
    name: "Alfa",
    logo: "https://www.polytel.ma/uploads/1592f05d569d5afa4ef89bcda0d29130.png",
    line: "Machines à coudre et accessoires.",
  },
  {
    slug: "salicru",
    name: "Salicru",
    logo: "https://www.polytel.ma/uploads/57ea946bd00ddda30fa3d29bc35a83b4.jpeg",
    line: "Onduleurs et protection électrique.",
  },
  {
    slug: "videojet",
    name: "Videojet",
    logo: "https://www.polytel.ma/uploads/a57951462e569661770bd4ef2fba2c24.png",
    line: "Marquage et codage industriel.",
  },
  {
    slug: "sato",
    name: "SATO",
    logo: "https://www.polytel.ma/uploads/2e4204cfa87deef3dc58857a3e24423f.png",
    line: "Imprimantes d'étiquettes et solutions de traçabilité.",
  },
  { slug: "ngs", name: "NGS", logo: null, line: "Accessoires PC et audio." },
  { slug: "tsc", name: "TSC", logo: null, line: "Imprimantes d'étiquettes." },
  { slug: "ocom", name: "OCOM", logo: null, line: "Imprimantes d'étiquettes." },
  { slug: "jaki", name: "Jaki", logo: null, line: "Machines à coudre." },
  { slug: "jack", name: "Jack", logo: null, line: "Machines à coudre." },
];

/** Marque non identifiée dans les données source. */
export const UNKNOWN_BRAND = "a-confirmer";

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);

export const getBrandName = (slug: string) =>
  getBrand(slug)?.name ?? (slug === UNKNOWN_BRAND ? "Marque à confirmer" : slug);
