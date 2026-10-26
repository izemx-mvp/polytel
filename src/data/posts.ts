/**
 * Articles de blog — CONTENU EXEMPLE À REMPLACER.
 * Structure prête à être alimentée par un CMS ou une API.
 */

export interface PostSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date — À CONFIRMER à la publication */
  date: string;
  readingMinutes: number;
  sections: PostSection[];
  relatedProductIds: string[];
  /** Univers lié pour le CTA */
  universe: string;
  sample: true;
}

export const postCategories = ["Impression", "Caisse & POS", "Étiquetage"] as const;

export const posts: Post[] = [
  {
    slug: "laser-ou-jet-d-encre-quelle-imprimante-pour-votre-pme",
    title: "Laser ou jet d'encre : quelle imprimante pour votre PME ?",
    excerpt:
      "Volume mensuel, type de documents, coût à la page : les critères pour choisir la bonne technologie d'impression.",
    category: "Impression",
    date: "2026-01-15",
    readingMinutes: 5,
    universe: "impression",
    relatedProductIds: ["p1", "p2", "p3", "p6"],
    sample: true,
    sections: [
      {
        id: "volume",
        heading: "Partir de votre volume d'impression",
        paragraphs: [
          "Avant de comparer les modèles, estimez le nombre de pages imprimées chaque mois et la part de documents en couleur. C'est le critère qui oriente le plus le choix entre laser et jet d'encre.",
          "Un poste qui imprime surtout des documents texte en volume régulier n'a pas les mêmes besoins qu'un service qui produit des supports couleur ponctuels.",
        ],
      },
      {
        id: "laser",
        heading: "Le laser : régularité et documents texte",
        paragraphs: [
          "La technologie laser est appréciée pour les volumes soutenus de documents bureautiques. Le toner se conserve bien et la vitesse reste constante sur les longues séries.",
        ],
        bullets: [
          "Adapté aux impressions texte régulières",
          "Consommables : toner et tambour",
          "Versions monochrome ou couleur",
        ],
      },
      {
        id: "jet-encre",
        heading: "Le jet d'encre : polyvalence et couleur",
        paragraphs: [
          "Le jet d'encre, notamment à réservoirs rechargeables, convient aux structures qui impriment de la couleur et recherchent un équipement compact et polyvalent (impression, copie, numérisation).",
        ],
      },
      {
        id: "conseil",
        heading: "Se faire conseiller",
        paragraphs: [
          "Nos conseillers vous aident à dimensionner votre parc selon vos usages réels, et à prévoir consommables d'origine et maintenance.",
        ],
      },
    ],
  },
  {
    slug: "bien-choisir-sa-caisse-enregistreuse-en-2026",
    title: "Bien choisir sa caisse enregistreuse en 2026",
    excerpt:
      "Caisse autonome ou terminal POS tactile ? Les questions à se poser pour équiper son point de vente.",
    category: "Caisse & POS",
    date: "2026-02-10",
    readingMinutes: 4,
    universe: "caisse-pos",
    relatedProductIds: ["p9", "p10", "p11", "p12"],
    sample: true,
    sections: [
      {
        id: "activite",
        heading: "Votre activité détermine l'équipement",
        paragraphs: [
          "Commerce de proximité, restauration, boutique spécialisée : le nombre d'articles, de vendeurs et de passages en caisse oriente le choix de la solution d'encaissement.",
        ],
      },
      {
        id: "caisse-autonome",
        heading: "La caisse enregistreuse autonome",
        paragraphs: [
          "Simple à prendre en main, elle convient aux commerces qui recherchent un encaissement rapide avec impression du ticket, sans infrastructure informatique.",
        ],
      },
      {
        id: "terminal-pos",
        heading: "Le terminal POS tactile",
        paragraphs: [
          "Associé à un logiciel de gestion, le terminal POS ouvre la voie au suivi des ventes et des stocks, et se complète d'un lecteur code-barres, d'un afficheur client et d'un tiroir-caisse.",
        ],
        bullets: ["Écran tactile", "Logiciel de gestion", "Périphériques : lecteur, afficheur"],
      },
      {
        id: "accompagnement",
        heading: "Installation et accompagnement",
        paragraphs: [
          "Nos équipes assurent l'installation, la mise en service et le service après-vente de votre solution point de vente.",
        ],
      },
    ],
  },
  {
    slug: "imprimantes-d-etiquettes-zebra-brother-tsc-honeywell-comparees",
    title: "Imprimantes d'étiquettes : Zebra, Brother, TSC, Honeywell comparés",
    excerpt:
      "Bureau, entrepôt ou terrain : comment comparer les gammes des grandes marques d'étiquetage.",
    category: "Étiquetage",
    date: "2026-03-05",
    readingMinutes: 6,
    universe: "impression",
    relatedProductIds: ["p4", "p5"],
    sample: true,
    sections: [
      {
        id: "usage",
        heading: "Définir l'environnement d'utilisation",
        paragraphs: [
          "Une imprimante d'étiquettes de bureau, un modèle industriel pour l'entrepôt et une imprimante mobile pour le terrain répondent à des contraintes différentes de volume, de robustesse et de connectivité.",
        ],
      },
      {
        id: "criteres",
        heading: "Les critères de comparaison",
        paragraphs: [
          "Comparez les modèles sur la largeur d'impression, la technologie (thermique directe ou transfert thermique), la résolution, la connectivité et la compatibilité avec vos logiciels.",
        ],
        bullets: [
          "Largeur et type d'étiquettes",
          "Thermique directe ou transfert thermique",
          "Connectivité et intégration logicielle",
        ],
      },
      {
        id: "marques",
        heading: "Quatre marques, des positionnements complémentaires",
        paragraphs: [
          "Zebra, Brother, TSC et Honeywell proposent chacune des gammes couvrant le bureau, l'industrie et la mobilité. Le bon choix dépend de votre parc existant et de vos volumes.",
        ],
      },
      {
        id: "conseil",
        heading: "Un conseil personnalisé",
        paragraphs: [
          "Décrivez-nous votre besoin : nous vous orientons vers la gamme adaptée et les consommables (étiquettes, rubans) correspondants.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
