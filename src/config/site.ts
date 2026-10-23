/**
 * Central site configuration for POLYTEL.
 * All unknown values are marked "À CONFIRMER" and must be confirmed before launch.
 */

export interface Agency {
  city: string;
  address: string;
  phone: string;
  phoneHref: string;
  mapQuery: string;
}

export const site = {
  name: "POLYTEL",
  tagline: "Négociant Import-Export",
  pitch:
    "Importateur, grossiste et distributeur d'équipement de bureau, informatique et point de vente au Maroc depuis 1990. Produits 100 % d'origine, installation, maintenance et service après-vente certifié.",
  foundedYear: 1990,
  topBarMessage: "Importateur officiel Brother au Maroc depuis 1990",
  phone: "(+212) 5 22 27 47 55",
  phoneHref: "tel:+212522274755",
  phoneAgadir: "(+212) 5 28 21 42 55",
  phoneAgadirHref: "tel:+212528214255",
  otherPhone: "(+212) 5 22 26 04 60",
  otherPhoneNote: "Fax — À CONFIRMER",
  email: "polytel@menara.ma",
  emailHref: "mailto:polytel@menara.ma",
  /** Placeholder — À CONFIRMER */
  whatsapp: "212600000000",
  whatsappNote: "Numéro WhatsApp — À CONFIRMER",
  hours: "À CONFIRMER",
  brotherCertification: "Distributeur agréé matériel de service (DAMS) Brother",
  agencies: [
    {
      city: "Casablanca",
      address: "10-15, Rue Allal El Fassi",
      phone: "(+212) 5 22 27 47 55",
      phoneHref: "tel:+212522274755",
      mapQuery: "Polytel, Rue Allal El Fassi, Casablanca, Maroc",
    },
    {
      city: "Agadir",
      address: "N°48, Bd Hassan Bounaâmani, Cité Dakhla",
      phone: "(+212) 5 28 21 42 55",
      phoneHref: "tel:+212528214255",
      mapQuery: "Boulevard Hassan Bounaâmani, Cité Dakhla, Agadir, Maroc",
    },
  ] as Agency[],
  socials: {
    facebook: "https://www.facebook.com/Polytel.ma",
    instagram: "https://www.instagram.com/Polytel.ma",
    linkedin: "https://www.linkedin.com/company/polytelmaroc",
    twitter: "https://twitter.com/Polytel_maroc",
  },
} as const;

export function mapEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
