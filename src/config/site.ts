/**
 * Central site configuration for POLYTEL.
 * All unknown values are marked "À CONFIRMER" and must be confirmed before launch.
 */

export interface Agency {
  slug: string;
  city: string;
  address: string;
  postalCity: string;
  phone: string;
  phoneHref: string;
  mapQuery: string;
  hours: string;
}

export const TO_CONFIRM = "À CONFIRMER";

export const site = {
  name: "POLYTEL",
  url: "https://www.polytel.ma",
  tagline: "Négociant Import-Export",
  description:
    "POLYTEL — importateur, grossiste & distributeur de matériel informatique, bureautique et solutions point de vente. Créée en 1990.",
  pitch:
    "Importateur, grossiste et distributeur de matériel informatique, bureautique et solutions point de vente au Maroc depuis 1990.",
  foundedYear: 1990,
  brandCount: 35,
  topBarMessage: "Importateur officiel Brother au Maroc depuis 1990",
  phone: "(+212) 5 22 27 47 55",
  phoneHref: "tel:+212522274755",
  phoneAgadir: "(+212) 5 28 21 42 55",
  phoneAgadirHref: "tel:+212528214255",
  otherPhone: "(+212) 5 22 26 04 60",
  otherPhoneHref: "tel:+212522260460",
  otherPhoneNote: "Fax — À CONFIRMER",
  email: "polytel@menara.ma",
  emailHref: "mailto:polytel@menara.ma",
  /** Numéro WhatsApp au format international sans « + » — placeholder À CONFIRMER */
  whatsapp: "212522274755",
  whatsappNote: "Numéro WhatsApp — À CONFIRMER",
  hours: TO_CONFIRM,
  supportPhoneHours: "Assistance téléphonique 5j/7 — horaires À CONFIRMER",
  supportEmailHours: "Assistance e-mail 24h/24, 7j/7",
  brotherCertification: "Distributeur agréé matériel de service (DAMS) Brother",
  /** RÈGLE TARIFAIRE B2B : les prix sont réservés aux professionnels. */
  showPublicPrices: false,
  agencies: [
    {
      slug: "casablanca",
      city: "Casablanca",
      address: "10-15, Rue Allal El Fassi",
      postalCity: "Casablanca, Maroc",
      phone: "(+212) 5 22 27 47 55",
      phoneHref: "tel:+212522274755",
      mapQuery: "Rue Allal El Fassi, Casablanca, Maroc",
      hours: TO_CONFIRM,
    },
    {
      slug: "agadir",
      city: "Agadir",
      address: "N°48, Bd Hassan Bounaâmani, Cité Dakhla",
      postalCity: "Agadir, Maroc",
      phone: "(+212) 5 28 21 42 55",
      phoneHref: "tel:+212528214255",
      mapQuery: "Boulevard Hassan Bounaâmani, Cité Dakhla, Agadir, Maroc",
      hours: TO_CONFIRM,
    },
  ] as Agency[],
  socials: {
    facebook: "https://www.facebook.com/Polytel.ma",
    instagram: "https://www.instagram.com/Polytel.ma",
    linkedin: "https://www.linkedin.com/company/polytelmaroc",
    twitter: "https://twitter.com/Polytel_maroc",
    /** URL de la chaîne YouTube — À CONFIRMER */
    youtube: "https://www.youtube.com/",
  },
  defaultWhatsAppMessage: "Bonjour Polytel, je souhaite un devis pour…",
} as const;

export function mapEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function mapLinkUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildWhatsAppLink(message: string = site.defaultWhatsAppMessage): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
