import { createFileRoute } from "@tanstack/react-router";
import { CatalogueHeader, CatalogueView } from "@/components/site/catalogue-view";
import { catalogueValidateSearch } from "@/lib/catalogue-search";
import { products } from "@/data/products";
import { breadcrumbLd, jsonLdScript, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/produits/")({
  validateSearch: catalogueValidateSearch,
  head: () => ({
    ...pageHead({
      title: "Catalogue produits — matériel informatique, bureautique & POS",
      description:
        "Catalogue Polytel : impression, scanners, caisse & POS, informatique, identification, multimédia, mobilier et fournitures de bureau. Produits 100 % d'origine, prix professionnels sur devis.",
      path: "/produits",
    }),
    scripts: [
      jsonLdScript(
        breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Produits", path: "/produits" },
        ]),
      ),
    ],
  }),
  component: ProduitsPage,
});

function ProduitsPage() {
  const search = Route.useSearch();
  return (
    <>
      <CatalogueHeader
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Produits" }]}
        eyebrow="Catalogue professionnel"
        title="Tout l'équipement professionnel, en un seul catalogue"
        intro="Plus de 35 marques d'origine, de l'impression au point de vente. Filtrez par univers, marque ou offre, puis ajoutez vos références à votre demande de devis."
      />
      <CatalogueView search={search} pool={products} showUniverseLinks />
    </>
  );
}
