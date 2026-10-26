/**
 * E-catalogues et téléchargements — CONTENU EXEMPLE À REMPLACER.
 * Les URL « # » sont des emplacements à remplacer par les vrais fichiers PDF.
 */

export interface ECatalogue {
  id: string;
  title: string;
  brand: string;
  /** Slug produit dont l'image sert de couverture */
  coverProductSlug?: string;
  year: string;
  pages: string;
  url: string | null;
}

export type DownloadKind = "Pilote" | "Fiche technique" | "Tarif";

export interface DownloadItem {
  id: string;
  title: string;
  kind: DownloadKind;
  brand: string;
  reference?: string;
  format: string;
  url: string | null;
}

export const eCatalogues: ECatalogue[] = [
  {
    id: "c1",
    title: "Catalogue impression & multifonctions",
    brand: "brother",
    coverProductSlug: "brother-mfc-j985dw",
    year: "À CONFIRMER",
    pages: "À CONFIRMER",
    url: null,
  },
  {
    id: "c2",
    title: "Solutions point de vente",
    brand: "sharp",
    coverProductSlug: "sharp-xe-a217",
    year: "À CONFIRMER",
    pages: "À CONFIRMER",
    url: null,
  },
  {
    id: "c3",
    title: "Impression de badges",
    brand: "evolis",
    coverProductSlug: "evolis-primacy",
    year: "À CONFIRMER",
    pages: "À CONFIRMER",
    url: null,
  },
  {
    id: "c4",
    title: "Étiquetage P-touch",
    brand: "brother",
    coverProductSlug: "brother-pt-h110",
    year: "À CONFIRMER",
    pages: "À CONFIRMER",
    url: null,
  },
  {
    id: "c5",
    title: "Destructeurs & équipement de bureau",
    brand: "olympia",
    coverProductSlug: "olympia-ps-53-cc",
    year: "À CONFIRMER",
    pages: "À CONFIRMER",
    url: null,
  },
  {
    id: "c6",
    title: "Mobilité & terminaux",
    brand: "zebra",
    coverProductSlug: "zebra-tc72-tc77-touch",
    year: "À CONFIRMER",
    pages: "À CONFIRMER",
    url: null,
  },
];

export const downloads: DownloadItem[] = [
  {
    id: "d1",
    title: "Fiche produit Brother DCP-T310",
    kind: "Fiche technique",
    brand: "brother",
    reference: "DCP-T310",
    format: "PDF",
    url: "https://www.brother.ee/-/media/product-downloads/devices/printers/dcp/dcpt310/product_leaflet_dcp-t310.ashx",
  },
  {
    id: "d2",
    title: "Pilotes et logiciels Brother DCP-T310",
    kind: "Pilote",
    brand: "brother",
    reference: "DCP-T310",
    format: "Lien constructeur",
    url: null,
  },
  {
    id: "d3",
    title: "Pilotes Brother MFC-J985DW",
    kind: "Pilote",
    brand: "brother",
    reference: "MFC-J985DW",
    format: "Lien constructeur",
    url: null,
  },
  {
    id: "d4",
    title: "Fiche technique Sharp XE-A217",
    kind: "Fiche technique",
    brand: "sharp",
    reference: "XE-A217",
    format: "PDF",
    url: null,
  },
  {
    id: "d5",
    title: "Pilote Evolis Primacy",
    kind: "Pilote",
    brand: "evolis",
    reference: "PRIMACY",
    format: "Lien constructeur",
    url: null,
  },
  {
    id: "d6",
    title: "Fiche technique Sharp AR-6020N",
    kind: "Fiche technique",
    brand: "sharp",
    reference: "AR-6020N",
    format: "PDF",
    url: null,
  },
  {
    id: "d7",
    title: "Tarifs professionnels — accès réservé",
    kind: "Tarif",
    brand: "polytel",
    format: "Sur demande",
    url: null,
  },
];
