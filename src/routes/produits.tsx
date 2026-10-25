import { createFileRoute } from "@tanstack/react-router";
import { CatalogueView } from "@/components/site/catalogue-view";
import { catalogueValidateSearch } from "@/lib/catalogue-search";

export const Route = createFileRoute("/produits")({
  validateSearch: catalogueValidateSearch,
  component: ProduitsPage,
  head: () => ({
    meta: [
      { title: "Produits — Catalogue POLYTEL" },
      {
        name: "description",
        content:
          "Catalogue complet POLYTEL : impression, caisse & POS, informatique, identification, multimédia, mobilier et fournitures — produits 100 % d'origine, prix professionnels sur devis.",
      },
      { property: "og:title", content: "Produits — Catalogue POLYTEL" },
      {
        property: "og:description",
        content:
          "Dix univers d'équipement professionnel : impression, caisse & POS, informatique, identification, multimédia et plus.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function ProduitsPage() {
  const search = Route.useSearch();
  return <CatalogueView search={search} />;
}
