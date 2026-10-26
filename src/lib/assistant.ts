/**
 * Assistant Polytel — version frontend, prête pour un backend.
 *
 * Toute la logique passe par `sendMessage`. Pour brancher plus tard une
 * edge function IA (streaming), remplacer son implémentation : l'UI
 * consomme uniquement le type `AssistantReply`.
 *
 * Règle : l'assistant n'invente jamais de prix, de stock, de délai ni de
 * caractéristique — il s'appuie uniquement sur products.ts et posts.ts.
 */
import { products, type Product } from "@/data/products";
import { posts, type Post } from "@/data/posts";
import { searchProducts } from "@/lib/search";
import { site } from "@/config/site";

export type AssistantExpectation = "consumable-ref" | "printer-usage" | "pos-need";

export interface AssistantReply {
  /** Markdown léger : **gras**, [lien](/chemin), listes « - » */
  text: string;
  products?: Product[];
  posts?: Post[];
  chips?: string[];
  /** Affiche le mini-formulaire de rappel (nom, société, téléphone, besoin) */
  leadForm?: boolean;
  expect?: AssistantExpectation;
}

export interface AssistantMessage extends AssistantReply {
  id: string;
  role: "user" | "assistant";
}

export const QUICK_CHIPS = [
  "Choisir une imprimante",
  "Trouver un consommable",
  "Équiper mon point de vente",
  "Demander une intervention SAV",
] as const;

export const WELCOME: AssistantReply = {
  text: "Bonjour, je suis l'assistant **Polytel**. Je vous aide à trouver le bon équipement dans notre catalogue, un consommable, ou à joindre notre service technique.\n\nComment puis-je vous aider ?",
  chips: [...QUICK_CHIPS],
};

const CALLBACK = "Être rappelé par un conseiller";

/* ---------------- Outils ---------------- */

/** search_catalogue — recherche plein texte sur products.ts */
export function search_catalogue(
  query: string,
  filter?: (p: Product) => boolean,
  limit = 4,
): Product[] {
  const hits = searchProducts(query, 12);
  return (filter ? hits.filter(filter) : hits).slice(0, limit);
}

/** search_blog — recherche par mots-clés sur posts.ts */
export function search_blog(query: string, limit = 2): Post[] {
  const words = normalize(query)
    .split(/\s+/)
    .filter((w) => w.length > 3);
  if (words.length === 0) return [];
  return posts
    .map((p) => {
      const hay = normalize(
        [p.title, p.excerpt, p.category, ...p.sections.map((s) => s.heading)].join(" "),
      );
      return { p, score: words.filter((w) => hay.includes(w)).length };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const real = (p: Product) => !p.placeholder;
const pick = (filter: (p: Product) => boolean, limit = 4) =>
  products.filter((p) => filter(p) && real(p)).slice(0, limit);

/* ---------------- Flux guidés ---------------- */

function printerFlow(): AssistantReply {
  return {
    text: "Volontiers. Quel est votre usage principal ?",
    chips: [
      "Documents bureautiques",
      "Couleur & polyvalence",
      "Étiquettes ou badges",
      "Gros volumes (copieur)",
    ],
    expect: "printer-usage",
  };
}

function printerUsage(input: string): AssistantReply | null {
  const n = normalize(input);
  if (n.includes("etiquette") || n.includes("badge")) {
    return {
      text: "Pour l'identification, voici nos références **étiquettes, badges et impression mobile**. Voir aussi [les imprimantes d'étiquettes](/produits/impression/imprimantes-etiquettes).",
      products: pick((p) =>
        ["etiqueteuses", "imprimantes-badges", "imprimantes-mobiles"].includes(p.subcategory ?? ""),
      ),
      chips: [CALLBACK, "Trouver un consommable"],
    };
  }
  if (n.includes("volume") || n.includes("copieur")) {
    return {
      text: "Pour les gros volumes, nos **copieurs** sont adaptés aux services documentaires. Un conseiller peut dimensionner l'équipement selon votre volume mensuel.",
      products: pick((p) => p.subcategory === "copieurs"),
      chips: [CALLBACK],
    };
  }
  if (n.includes("couleur") || n.includes("polyval")) {
    return {
      text: "Pour la couleur et la polyvalence (impression, copie, numérisation), voici nos **multifonctions** :",
      products: pick((p) => p.subcategory === "multifonctions"),
      posts: posts.filter((p) => p.universe === "impression").slice(0, 1),
      chips: [CALLBACK, "Trouver un consommable"],
    };
  }
  if (n.includes("bureau") || n.includes("document")) {
    return {
      text: "Pour les documents bureautiques, comparez [imprimantes](/produits/impression/imprimantes) et [multifonctions](/produits/impression/multifonctions). Notre article peut vous aider à choisir :",
      products: pick((p) => p.universe === "impression" && p.subcategory === "multifonctions", 2),
      posts: posts.slice(0, 1),
      chips: [CALLBACK],
    };
  }
  return null;
}

function consumableFlow(): AssistantReply {
  return {
    text: "Indiquez-moi la **référence** de votre imprimante ou du consommable recherché (ex. *TN-2410*, *DCP-T310*).",
    expect: "consumable-ref",
  };
}

function consumableLookup(input: string): AssistantReply {
  const hits = search_catalogue(input, undefined, 6);
  const consumables = hits.filter((p) => p.subcategory === "consommables");
  const devices = hits.filter((p) => p.subcategory !== "consommables");
  const compatible = devices.flatMap((d) =>
    (d.consumableIds ?? [])
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p)),
  );
  const list = [...new Map([...consumables, ...compatible].map((p) => [p.id, p])).values()];
  if (list.length > 0) {
    return {
      text: "Voici ce que j'ai trouvé dans notre catalogue de **consommables d'origine** :",
      products: list.slice(0, 4),
      chips: [CALLBACK],
    };
  }
  if (devices.length > 0) {
    return {
      text: "J'ai trouvé l'appareil, mais aucun consommable compatible n'est encore référencé en ligne pour ce modèle. Nos conseillers vous indiqueront la référence d'origine exacte.",
      products: devices.slice(0, 2),
      chips: [CALLBACK],
      leadForm: true,
    };
  }
  return {
    text: "Je ne trouve pas cette référence en ligne — notre catalogue complet est plus large que le site. Laissez-nous vos coordonnées, un conseiller vous répond.",
    leadForm: true,
  };
}

function posFlow(): AssistantReply {
  return {
    text: "Pour équiper un point de vente, nous proposons caisses enregistreuses, terminaux POS tactiles, lecteurs code-barres et logiciels de gestion. Voici quelques références :",
    products: pick((p) => p.universe === "caisse-pos"),
    posts: posts.filter((p) => p.universe === "caisse-pos").slice(0, 1),
    chips: ["Caisses enregistreuses", "Terminaux POS", CALLBACK],
  };
}

function savFlow(): AssistantReply {
  return {
    text: `Notre service technique intervient en installation, maintenance et réparation multi-marques.\n\n- Téléphone : **${site.phone}**\n- E-mail : **${site.email}**\n- Formulaire : [demande d'intervention SAV](/services#sav)\n\nVous pouvez aussi laisser vos coordonnées ici, nous vous rappelons.`,
    chips: [CALLBACK],
    leadForm: true,
  };
}

/* ---------------- Point d'entrée unique ---------------- */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendMessage(
  input: string,
  history: AssistantMessage[],
): Promise<AssistantReply> {
  await delay(450 + Math.random() * 350);
  return route(input, history);
}

function route(input: string, history: AssistantMessage[]): AssistantReply {
  const n = normalize(input.trim());
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");

  if (!n) return WELCOME;

  // Réponses aux questions en attente
  if (lastAssistant?.expect === "consumable-ref") return consumableLookup(input);
  if (lastAssistant?.expect === "printer-usage") {
    const r = printerUsage(input);
    if (r) return r;
  }

  // Chips & intentions
  if (n.includes("rappel") || n.includes("conseiller") || n.includes("contact")) {
    return {
      text: "Avec plaisir. Laissez vos coordonnées et votre besoin, un conseiller Polytel vous rappelle.",
      leadForm: true,
    };
  }
  if (n.includes("choisir une imprimante") || /\bimprimante|multifonction/.test(n)) {
    if (n.length > 30) {
      const found = search_catalogue(input);
      if (found.length) return { text: "Voici les références correspondantes :", products: found };
    }
    return printerFlow();
  }
  if (n.includes("consommable") || /\btoner|cartouche|encre|ruban\b/.test(n)) {
    const found = search_catalogue(input, (p) => p.subcategory === "consommables");
    if (found.length && n.length > 14) return consumableLookup(input);
    return consumableFlow();
  }
  if (n.includes("caisses enregistreuses")) {
    return {
      text: "Nos caisses enregistreuses :",
      products: pick((p) => p.subcategory === "caisses-enregistreuses"),
      chips: ["Terminaux POS", CALLBACK],
    };
  }
  if (n.includes("terminaux pos")) {
    return {
      text: "Nos terminaux point de vente :",
      products: pick((p) => p.subcategory === "terminaux-pos"),
      chips: ["Caisses enregistreuses", CALLBACK],
    };
  }
  if (n.includes("point de vente") || /\bcaisse|pos\b|magasin|boutique/.test(n)) return posFlow();
  if (/sav|panne|reparation|intervention|maintenance|depannage/.test(n)) return savFlow();
  if (/prix|tarif|cout|combien|stock|delai|livraison/.test(n)) {
    return {
      text: "Nos **prix sont réservés aux professionnels** et la disponibilité varie selon les références : je ne peux pas vous les communiquer ici. Ajoutez les produits à votre [demande de devis](/devis) ou laissez vos coordonnées, un conseiller vous répond avec une offre.",
      chips: [CALLBACK],
      leadForm: true,
    };
  }

  // Recherche libre
  const found = search_catalogue(input);
  const articles = search_blog(input);
  if (found.length || articles.length) {
    return {
      text: found.length
        ? "Voici ce que j'ai trouvé dans notre catalogue :"
        : "Cet article pourrait vous aider :",
      products: found,
      posts: articles,
      chips: [CALLBACK],
    };
  }
  return {
    text: "Je n'ai pas trouvé de correspondance dans le catalogue en ligne. Pouvez-vous préciser une **référence**, une **marque** ou un **type de produit** ? Vous pouvez aussi être rappelé par un conseiller.",
    chips: [...QUICK_CHIPS.slice(0, 3), CALLBACK],
  };
}
