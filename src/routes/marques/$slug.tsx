import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  PackageCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogueHeader, CatalogueView } from "@/components/site/catalogue-view";
import { BrandLogo } from "@/components/site/brand-logo";
import { CtaBand } from "@/components/site/layout-primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { catalogueValidateSearch } from "@/lib/catalogue-search";
import { brands, getBrand } from "@/data/brands";
import { allUniverses } from "@/data/categories";
import { productsByBrand } from "@/data/products";
import { breadcrumbLd, jsonLdScript, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/marques/$slug")({
  validateSearch: catalogueValidateSearch,
  loader: ({ params }) => {
    const brand = getBrand(params.slug);
    if (!brand) throw notFound();
    return { slug: brand.slug, name: brand.name, line: brand.line };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          ...pageHead({
            title:
              loaderData.slug === "brother"
                ? "Brother Maroc — importateur officiel et distributeur agréé DAMS"
                : `${loaderData.name} au Maroc — distributeur Polytel`,
            description: `${loaderData.name} chez Polytel : ${loaderData.line} Produits 100 % d'origine, installation et SAV, prix professionnels sur devis.`,
            path: `/marques/${loaderData.slug}`,
          }),
          scripts: [
            jsonLdScript(
              breadcrumbLd([
                { name: "Accueil", path: "/" },
                { name: "Marques", path: "/marques" },
                { name: loaderData.name, path: `/marques/${loaderData.slug}` },
              ]),
            ),
          ],
        }
      : {},
  component: BrandPage,
});

const chipClass =
  "inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none";

function BrandPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const brand = getBrand(slug);
  if (!brand) return null;

  const pool = productsByBrand(brand.slug);
  const realCount = pool.filter((p) => !p.placeholder).length;
  const universes = allUniverses.filter((u) => pool.some((p) => p.universe === u.slug));
  const official = Boolean(brand.official);

  const reasons = official
    ? [
        {
          icon: BadgeCheck,
          title: "Importateur officiel",
          text: `Produits ${brand.name} issus du circuit officiel, avec garantie constructeur.`,
        },
        {
          icon: ShieldCheck,
          title: "Distributeur agréé DAMS",
          text: "Distributeur Agréé Maintenance & Services : garantie, réparation et maintenance Brother par nos équipes formées.",
        },
        {
          icon: CalendarCheck,
          title: "Contrat de maintenance",
          text: "Entretien préventif avec 4 visites par an dans le cadre d'un contrat établi.",
        },
        {
          icon: Wrench,
          title: "Installation & mise en service",
          text: "Livraison, installation et paramétrage de vos équipements sur site.",
        },
      ]
    : [
        {
          icon: PackageCheck,
          title: "Produits d'origine",
          text: `Équipements ${brand.name} 100 % d'origine, avec garantie constructeur.`,
        },
        {
          icon: Wrench,
          title: "Installation & mise en service",
          text: "Nos techniciens installent et paramètrent vos équipements.",
        },
        {
          icon: ShieldCheck,
          title: "SAV multi-marques",
          text: "Dépannage, réparation et entretien assurés par le service après-vente Polytel.",
        },
      ];

  const others = brands.filter((b) => b.slug !== brand.slug).slice(0, 8);

  return (
    <>
      <CatalogueHeader
        crumbs={[
          { label: "Accueil", to: "/" },
          { label: "Marques", to: "/marques" },
          { label: brand.name },
        ]}
        eyebrow={official ? "Partenaire officiel" : "Marque partenaire"}
        title={
          official
            ? `${brand.name}, partenaire historique de Polytel`
            : `${brand.name} chez Polytel`
        }
        intro={
          official
            ? `Importateur officiel ${brand.name} au Maroc et Distributeur Agréé Maintenance & Services (DAMS). ${brand.line}`
            : `${brand.line} Produits d'origine, installation et service après-vente par nos équipes.`
        }
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="card-hairline flex h-20 w-48 items-center justify-center px-6">
            <BrandLogo slug={brand.slug} size="lg" className="max-h-12" />
          </div>
          <div className="flex flex-col gap-2">
            {official && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-tint px-3 py-1 text-xs font-semibold text-primary">
                <BadgeCheck className="size-3.5" aria-hidden />
                Importateur officiel · DAMS
              </span>
            )}
            <span className="font-mono text-[11px] text-muted-foreground">
              {realCount > 0
                ? `${realCount} référence${realCount > 1 ? "s" : ""} en ligne`
                : "Catalogue complet sur demande"}
            </span>
          </div>
        </div>

        {universes.length > 0 && (
          <div className="mt-8">
            <p className="eyebrow text-muted-foreground">Univers disponibles</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {universes.map((u) => (
                <li key={u.slug}>
                  {u.slug === "espace-couture" ? (
                    <Link to="/espace-couture" search={{ marque: brand.slug }} className={chipClass}>
                      <u.icon className="size-4 text-primary" aria-hidden />
                      {u.name}
                    </Link>
                  ) : (
                    <Link
                      to="/produits/$univers"
                      params={{ univers: u.slug }}
                      search={{ marque: brand.slug }}
                      className={chipClass}
                    >
                      <u.icon className="size-4 text-primary" aria-hidden />
                      {u.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CatalogueHeader>

      <CatalogueView search={search} pool={pool} locked={{ marque: true }} />

      {/* Pourquoi acheter la marque chez Polytel */}
      <section className="crop-marks relative overflow-hidden bg-ink py-20 text-ink-foreground md:py-28">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-ink-muted">
                <span className="h-px w-6 bg-current opacity-60" aria-hidden />
                {official ? "Partenaire officiel" : "Chez Polytel"}
              </p>
              <h2 className="display-md mt-3 max-w-2xl text-balance">
                Pourquoi choisir {brand.name} chez Polytel
              </h2>
            </div>
            <Button variant="cta" size="xl" asChild>
              <Link to="/devis">
                Demander un devis {brand.name}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <RevealGroup
            className={
              official
                ? "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                : "mt-12 grid gap-4 sm:grid-cols-3"
            }
          >
            {reasons.map((r, i) => (
              <RevealItem
                key={r.title}
                className="h-full rounded-2xl border border-ink-border bg-ink-card p-6 transition-colors hover:border-white/25"
              >
                <p className="font-mono text-[11px] text-ink-muted">0{i + 1}</p>
                <r.icon className="mt-6 size-7 text-cta" aria-hidden />
                <h3 className="mt-5 font-display text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{r.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          {official && (
            <Reveal className="mt-10">
              <Link
                to="/services"
                className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold text-cta"
              >
                Découvrir nos services & SAV
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      {/* Autres marques */}
      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-muted-foreground">
                <span className="h-px w-6 bg-current opacity-60" aria-hidden />
                One Stop Shopping
              </p>
              <h2 className="display-md mt-3">Nos autres marques</h2>
            </div>
            <Link
              to="/marques"
              className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              Toutes les marques
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <RevealGroup as="ul" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {others.map((b) => (
              <RevealItem as="li" key={b.slug} className="h-full">
                <Link
                  to="/marques/$slug"
                  params={{ slug: b.slug }}
                  className="card-hairline card-lift group relative flex h-24 items-center justify-center px-5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  aria-label={`Marque ${b.name}`}
                >
                  <BrandLogo slug={b.slug} reveal size="md" className="max-h-9" />
                  <ArrowUpRight
                    className="absolute top-3 right-3 size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      <CtaBand />
    </>
  );
}