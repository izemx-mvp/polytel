import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogueHeader, CatalogueView } from "@/components/site/catalogue-view";
import { CtaBand, type Crumb } from "@/components/site/layout-primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { BrandLogo } from "@/components/site/brand-logo";
import { WhatsAppIcon } from "@/components/site/icons";
import { catalogueValidateSearch } from "@/lib/catalogue-search";
import { getCategory, getSubcategory } from "@/data/categories";
import { productsBySubcategory } from "@/data/products";
import { buildWhatsAppLink, site } from "@/config/site";
import { breadcrumbLd, jsonLdScript, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produits/$univers/$sousCategorie")({
  validateSearch: catalogueValidateSearch,
  loader: ({ params }) => {
    const universe = getCategory(params.univers);
    const sub = getSubcategory(params.univers, params.sousCategorie);
    if (!universe || !sub) throw notFound();
    return {
      universe: universe.slug,
      universeName: universe.name,
      sub: sub.slug,
      subName: sub.name,
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          ...pageHead({
            title: `${loaderData.subName} — ${loaderData.universeName} | Polytel Maroc`,
            description: `${loaderData.subName} professionnels chez Polytel, importateur et distributeur au Maroc fondé en 1990. Produits 100 % d'origine, installation et SAV, prix professionnels sur devis.`,
            path: `/produits/${loaderData.universe}/${loaderData.sub}`,
          }),
          scripts: [
            jsonLdScript(
              breadcrumbLd([
                { name: "Accueil", path: "/" },
                { name: "Produits", path: "/produits" },
                { name: loaderData.universeName, path: `/produits/${loaderData.universe}` },
                {
                  name: loaderData.subName,
                  path: `/produits/${loaderData.universe}/${loaderData.sub}`,
                },
              ]),
            ),
          ],
        }
      : {},
  component: SubCategoryPage,
});

function SubCategoryPage() {
  const { univers, sousCategorie } = Route.useParams();
  const search = Route.useSearch();
  const universe = getCategory(univers);
  const sub = getSubcategory(univers, sousCategorie);
  if (!universe || !sub) return null;

  const couture = universe.slug === "espace-couture";
  const pool = productsBySubcategory(universe.slug, sub.slug);
  const realCount = pool.filter((p) => !p.placeholder).length;
  const brandSlugs = [...new Set(pool.filter((p) => !p.placeholder).map((p) => p.brand))];
  const siblings = universe.subcategories.filter((s) => s.slug !== sub.slug);

  const crumbs: Crumb[] = couture
    ? [
        { label: "Accueil", to: "/" },
        { label: universe.name, to: "/espace-couture" },
        { label: sub.name },
      ]
    : [
        { label: "Accueil", to: "/" },
        { label: "Produits", to: "/produits" },
        { label: universe.name, to: "/produits/$univers", params: { univers: universe.slug } },
        { label: sub.name },
      ];

  return (
    <>
      <CatalogueHeader
        crumbs={crumbs}
        eyebrow={universe.name}
        title={sub.name}
        intro={`${sub.name} : ${universe.blurb} Produits 100 % d'origine, conseil, installation et SAV par nos équipes.`}
        universe={couture ? undefined : universe}
        activeSub={sub.slug}
        tone={couture ? "warm" : "light"}
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
            <universe.icon className="size-3.5 text-primary" aria-hidden />
            {realCount > 0
              ? `${realCount} référence${realCount > 1 ? "s" : ""} en ligne`
              : "Catalogue complet sur demande"}
          </span>
          {brandSlugs.map((slug) => (
            <Link
              key={slug}
              to="/marques/$slug"
              params={{ slug }}
              className="inline-flex h-8 items-center rounded-lg border border-border bg-card px-2.5 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label={`Marque ${slug}`}
            >
              <BrandLogo slug={slug} size="sm" className="max-h-3.5" />
            </Link>
          ))}
        </div>
      </CatalogueHeader>

      <CatalogueView search={search} pool={pool} universe={universe} subcategory={sub} />

      {/* Conseil + retour univers */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-20 lg:px-8">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-5">
            <div
              className={cn(
                "relative overflow-hidden rounded-3xl p-6 sm:p-8 md:col-span-3",
                couture ? "border border-border bg-warm" : "crop-marks bg-ink text-ink-foreground",
              )}
            >
              {!couture && <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />}
              <div className="relative">
                <p
                  className={cn(
                    "font-mono text-[11px] tracking-wider uppercase",
                    couture ? "text-warm-foreground" : "text-ink-muted",
                  )}
                >
                  Conseil d'expert
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-balance">
                  Vous hésitez entre plusieurs {sub.name.toLowerCase()} ?
                </h2>
                <p className={cn("mt-2 max-w-lg text-sm", couture ? "text-muted-foreground" : "text-ink-muted")}>
                  Indiquez votre usage et vos volumes : nous vous recommandons la référence adaptée
                  et vous adressons un devis.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button variant="cta" size="lg" asChild>
                    <a
                      href={buildWhatsAppLink(`Bonjour Polytel, j'ai besoin d'un conseil pour : ${sub.name} (usage : …)`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WhatsAppIcon aria-hidden />
                      Conseil WhatsApp
                    </a>
                  </Button>
                  <Button variant={couture ? "outline" : "ghost-dark"} size="lg" asChild>
                    <a href={site.phoneHref}>
                      <Phone aria-hidden />
                      {site.phone}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            {couture ? (
              <Link
                to="/espace-couture"
                className="card-hairline card-lift group flex flex-col justify-between p-6 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:p-8 md:col-span-2"
              >
                <ArrowLeft className="size-5 text-muted-foreground transition-transform group-hover:-translate-x-0.5" aria-hidden />
                <div className="mt-10">
                  <p className="font-mono text-[11px] text-muted-foreground">Retour à l'univers</p>
                  <p className="mt-1 font-display text-xl font-semibold">{universe.name}</p>
                </div>
              </Link>
            ) : (
              <Link
                to="/produits/$univers"
                params={{ univers: universe.slug }}
                className="card-hairline card-lift group flex flex-col justify-between p-6 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:p-8 md:col-span-2"
              >
                <ArrowLeft className="size-5 text-muted-foreground transition-transform group-hover:-translate-x-0.5" aria-hidden />
                <div className="mt-10">
                  <p className="font-mono text-[11px] text-muted-foreground">Retour à l'univers</p>
                  <p className="mt-1 font-display text-xl font-semibold">{universe.name}</p>
                </div>
              </Link>
            )}
          </div>
        </Reveal>
      </section>

      {/* Rubriques voisines */}
      {siblings.length > 0 && (
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-muted-foreground">
                  <span className="h-px w-6 bg-current opacity-60" aria-hidden />
                  {universe.name}
                </p>
                <h2 className="display-md mt-3">Dans le même univers</h2>
              </div>
            </div>
            <RevealGroup as="ul" className="mt-8 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {siblings.map((s) => {
                const count = productsBySubcategory(universe.slug, s.slug).filter((p) => !p.placeholder).length;
                return (
                  <RevealItem as="li" key={s.slug} className="h-full">
                    <Link
                      to="/produits/$univers/$sousCategorie"
                      params={{ univers: universe.slug, sousCategorie: s.slug }}
                      className="group flex h-full items-center justify-between gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{s.name}</span>
                        <span className="block font-mono text-[11px] text-muted-foreground">
                          {count > 0 ? `${count} réf.` : "Sur demande"}
                        </span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                    </Link>
                  </RevealItem>
                );
              })}
            </RevealGroup>
            {!couture && (
              <Link
                to="/produits"
                className="link-underline mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                Tout le catalogue
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}