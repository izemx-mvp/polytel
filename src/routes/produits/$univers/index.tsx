import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Phone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogueHeader, CatalogueView } from "@/components/site/catalogue-view";
import { CtaBand } from "@/components/site/layout-primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { BrandLogo } from "@/components/site/brand-logo";
import { ProductVisual } from "@/components/site/product-visual";
import { WhatsAppIcon } from "@/components/site/icons";
import { catalogueValidateSearch } from "@/lib/catalogue-search";
import { categories, getCategory } from "@/data/categories";
import { productsByUniverse } from "@/data/products";
import { buildWhatsAppLink, site } from "@/config/site";
import { breadcrumbLd, jsonLdScript, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/produits/$univers/")({
  validateSearch: catalogueValidateSearch,
  loader: ({ params }) => {
    if (params.univers === "espace-couture") throw redirect({ to: "/espace-couture" });
    const universe = getCategory(params.univers);
    if (!universe) throw notFound();
    return { slug: universe.slug, name: universe.name, intro: universe.intro };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          ...pageHead({
            title: `${loaderData.name} — matériel professionnel au Maroc | Polytel`,
            description: loaderData.intro,
            path: `/produits/${loaderData.slug}`,
          }),
          scripts: [
            jsonLdScript(
              breadcrumbLd([
                { name: "Accueil", path: "/" },
                { name: "Produits", path: "/produits" },
                { name: loaderData.name, path: `/produits/${loaderData.slug}` },
              ]),
            ),
          ],
        }
      : {},
  component: UniversePage,
});

function UniversePage() {
  const { univers } = Route.useParams();
  const search = Route.useSearch();
  const universe = getCategory(univers);
  if (!universe) return null;

  const pool = productsByUniverse(universe.slug);
  const real = pool.filter((p) => !p.placeholder);
  const brandSlugs = [...new Set(real.map((p) => p.brand))];
  const preview = real.slice(0, 4);
  const others = categories.filter((c) => c.slug !== universe.slug);

  return (
    <>
      <CatalogueHeader
        crumbs={[
          { label: "Accueil", to: "/" },
          { label: "Produits", to: "/produits" },
          { label: universe.name },
        ]}
        eyebrow="Univers"
        title={universe.name}
        intro={universe.intro}
        universe={universe}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
          <dl className="flex gap-8">
            {[
              { k: "Références", v: real.length > 0 ? real.length : "—" },
              { k: "Rubriques", v: universe.subcategories.length },
              { k: "Marques", v: brandSlugs.length > 0 ? brandSlugs.length : "—" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{s.k}</dt>
                <dd className="mt-0.5 font-display text-2xl font-bold">{s.v}</dd>
              </div>
            ))}
          </dl>
          {preview.length > 0 && (
            <div className="flex -space-x-3" aria-hidden>
              {preview.map((p) => (
                <div
                  key={p.id}
                  className="product-surface size-12 overflow-hidden rounded-xl border-2 border-card shadow-sm"
                >
                  <ProductVisual product={p} width={48} height={48} className="size-full" imgClassName="p-1.5" />
                </div>
              ))}
            </div>
          )}
        </div>
        {brandSlugs.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[11px] text-muted-foreground">Marques :</span>
            {brandSlugs.map((slug) => (
              <Link
                key={slug}
                to="/produits/$univers"
                params={{ univers: universe.slug }}
                search={{ marque: slug }}
                className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                aria-label={`Filtrer par marque ${slug}`}
              >
                <BrandLogo slug={slug} size="sm" className="max-h-4" />
              </Link>
            ))}
          </div>
        )}
      </CatalogueHeader>

      <CatalogueView search={search} pool={pool} universe={universe} />

      {/* Aide au choix */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-20 lg:px-8">
        <Reveal>
          <div className="crop-marks relative grid overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
            <div className="relative lg:col-span-7">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-ink-muted uppercase">
                <universe.icon className="size-3.5 text-cta" aria-hidden />
                Conseil {universe.name}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-balance sm:text-3xl">
                Besoin d'aide pour choisir le bon équipement ?
              </h2>
              <p className="mt-3 max-w-lg text-sm text-ink-muted">
                Décrivez votre activité et vos volumes : un conseiller vous oriente vers les
                références adaptées et vous adresse un devis, installation et SAV compris sur
                demande.
              </p>
            </div>
            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:mt-0 lg:justify-end">
              <Button variant="cta" size="lg" asChild>
                <a
                  href={buildWhatsAppLink(`Bonjour Polytel, j'ai besoin d'un conseil pour l'univers ${universe.name} : …`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon aria-hidden />
                  Conseil WhatsApp
                </a>
              </Button>
              <Button variant="ghost-dark" size="lg" asChild>
                <a href={site.phoneHref}>
                  <Phone aria-hidden />
                  {site.phone}
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.06} className="mt-4">
          <Link
            to="/services"
            className="card-hairline card-lift group flex items-center gap-4 p-5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-tint text-primary">
              <Wrench className="size-5" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block font-display font-semibold">Installation, maintenance & SAV</span>
              <span className="block text-sm text-muted-foreground">
                Nos techniciens installent et entretiennent vos équipements, toutes marques.
              </span>
            </span>
            <ArrowRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
          </Link>
        </Reveal>
      </section>

      {/* Autres univers */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-muted-foreground">
                <span className="h-px w-6 bg-current opacity-60" aria-hidden />
                Catalogue
              </p>
              <h2 className="display-md mt-3">Explorer les autres univers</h2>
            </div>
            <Link
              to="/produits"
              className="link-underline hidden items-center gap-1.5 text-sm font-semibold text-primary sm:inline-flex"
            >
              Tout le catalogue
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <RevealGroup as="ul" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {others.map((c) => (
              <RevealItem as="li" key={c.slug} className="h-full">
                <Link
                  to="/produits/$univers"
                  params={{ univers: c.slug }}
                  className="group flex h-full items-center gap-3 rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-tint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <c.icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.name}</span>
                  <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand />
    </>
  );
}