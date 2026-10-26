import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Handshake,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/site/brand-logo";
import { ProductVisual } from "@/components/site/product-visual";
import { CtaBand, PageHero } from "@/components/site/layout-primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { brands } from "@/data/brands";
import { allUniverses } from "@/data/categories";
import { productsByBrand } from "@/data/products";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marques/")({
  head: () =>
    pageHead({
      title: "Nos marques — distributeur Brother, Sharp, Zebra, Evolis au Maroc",
      description:
        "Polytel distribue plus de 35 marques d'origine au Maroc : Brother, Sharp, Evolis, Olympia, HP, Zebra, Honeywell, Alfa, Salicru, Videojet, SATO… Importateur officiel Brother.",
      path: "/marques",
    }),
  component: BrandsPage,
});

/* ---------------- Données ---------------- */

/** Uniquement les vraies fiches (pas de "Modèle exemple"). */
const realByBrand = (slug: string) => productsByBrand(slug).filter((p) => !p.placeholder);

const featuredBrand = brands.find((b) => b.official);
const otherBrands = brands.filter((b) => !b.official);

/** Univers réellement couverts par au moins une marque. */
const brandUniverses = allUniverses.filter((u) =>
  brands.some((b) => productsByBrand(b.slug).some((p) => p.universe === u.slug)),
);

const pillars = [
  {
    icon: Handshake,
    title: "Des fournisseurs de premier plan",
    text: "Une combinaison unique de marques leaders, réunies chez un seul partenaire.",
  },
  {
    icon: Users,
    title: "Une force de vente expérimentée",
    text: "Des conseillers qui connaissent vos métiers et vos contraintes.",
  },
  {
    icon: Wrench,
    title: "Un savoir-faire technique",
    text: "Installation, maintenance et SAV assurés par nos équipes.",
  },
];

function refLabel(count: number) {
  return count > 0 ? `${count} référence${count > 1 ? "s" : ""}` : "Catalogue sur demande";
}

/* ---------------- Marque mise en avant (Brother) ---------------- */

function FeaturedBrand() {
  if (!featuredBrand) return null;
  const real = realByBrand(featuredBrand.slug);
  const thumbs = real.slice(0, 4);

  return (
    <Reveal>
      <article className="card-hairline relative grid overflow-hidden lg:grid-cols-12">
        <div className="relative p-6 sm:p-8 lg:col-span-6 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-tint px-3 py-1 text-xs font-semibold text-primary">
              <BadgeCheck className="size-3.5" aria-hidden />
              Importateur officiel au Maroc
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden />
              DAMS Brother
            </span>
          </div>
          <div className="mt-8 flex h-14 items-center">
            <BrandLogo slug={featuredBrand.slug} size="lg" className="max-h-12" />
          </div>
          <h2 className="display-md mt-6 text-balance">
            {featuredBrand.name}, notre partenaire historique
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Importateur officiel Brother au Maroc et Distributeur Agréé Maintenance & Services
            (DAMS) : vente, installation, garantie, réparation et maintenance de toute la gamme
            Brother par nos équipes formées.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="brand" size="xl" asChild>
              <Link to="/marques/$slug" params={{ slug: featuredBrand.slug }}>
                Découvrir la gamme {featuredBrand.name}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <span className="font-mono text-[11px] text-muted-foreground">
              {refLabel(real.length)}
            </span>
          </div>
        </div>

        <div className="relative border-t border-border bg-background/60 p-4 sm:p-6 lg:col-span-6 lg:border-t-0 lg:border-l">
          {thumbs.length > 0 ? (
            <ul className="grid h-full grid-cols-2 gap-3 sm:gap-4">
              {thumbs.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/produit/$slug"
                    params={{ slug: p.slug }}
                    className="group card-hairline card-lift relative flex h-full flex-col overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    <ProductVisual
                      product={p}
                      width={280}
                      height={210}
                      className="product-surface aspect-[4/3] w-full"
                      imgClassName="p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="scan-on-hover" aria-hidden />
                    <span className="truncate border-t border-border px-3 py-2 font-mono text-[11px] text-muted-foreground">
                      {p.reference}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="product-surface flex h-full min-h-48 items-center justify-center rounded-xl">
              <BrandLogo slug={featuredBrand.slug} size="lg" className="max-h-12 opacity-60" />
            </div>
          )}
        </div>
      </article>
    </Reveal>
  );
}

/* ---------------- Carte marque ---------------- */

function BrandCard({ slug }: { slug: string }) {
  const b = brands.find((x) => x.slug === slug);
  if (!b) return null;
  const real = realByBrand(b.slug);
  const thumbs = real.slice(0, 3);

  return (
    <Link
      to="/marques/$slug"
      params={{ slug: b.slug }}
      className="card-hairline card-lift group relative flex h-full flex-col overflow-hidden p-6 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 items-center">
          <BrandLogo slug={b.slug} reveal size="md" className="max-h-10" />
        </div>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
          aria-hidden
        />
      </div>
      <p className="mt-6 font-display font-semibold">{b.name}</p>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{b.line}</p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <span className="font-mono text-[11px] text-muted-foreground">{refLabel(real.length)}</span>
        {thumbs.length > 0 && (
          <div className="flex -space-x-3" aria-hidden>
            {thumbs.map((p) => (
              <div
                key={p.id}
                className="product-surface size-11 overflow-hidden rounded-lg border-2 border-card shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5"
              >
                <ProductVisual
                  product={p}
                  width={44}
                  height={44}
                  className="size-full"
                  imgClassName="p-1"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <span className="scan-on-hover" aria-hidden />
    </Link>
  );
}

/* ---------------- Page ---------------- */

function BrandsPage() {
  const [universe, setUniverse] = useState<string | null>(null);

  const list = useMemo(
    () =>
      universe
        ? otherBrands.filter((b) => productsByBrand(b.slug).some((p) => p.universe === universe))
        : otherBrands,
    [universe],
  );

  return (
    <>
      <PageHero
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Marques" }]}
        eyebrow="One Stop Shopping"
        title="Un seul partenaire, plus de 35 marques d'origine"
        description="Notre approche « One Stop Shopping » : un interlocuteur unique qui réunit une combinaison de fournisseurs de premier plan, une force de vente expérimentée et un véritable savoir-faire technique."
      >
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <li
              key={p.title}
              className="rounded-xl border border-ink-border bg-ink-card p-5 transition-colors hover:border-white/25"
            >
              <div className="flex items-center justify-between">
                <p.icon className="size-5 text-cta" aria-hidden />
                <span className="font-mono text-[11px] text-ink-muted">0{i + 1}</span>
              </div>
              <p className="mt-3 font-display text-sm font-semibold">{p.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Marque officielle */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 md:pt-24 lg:px-8">
        <FeaturedBrand />
      </section>

      {/* Toutes les marques */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-muted-foreground">
              <span className="h-px w-6 bg-current opacity-60" aria-hidden />
              Marques partenaires
            </p>
            <h2 className="display-md mt-3">Toutes nos marques</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Sélection de nos marques — plus de 35 au catalogue, toutes en produits d'origine.
            </p>
          </div>
          <p className="font-mono text-[11px] text-muted-foreground" aria-live="polite">
            {list.length} marque{list.length > 1 ? "s" : ""} affichée{list.length > 1 ? "s" : ""}
          </p>
        </div>

        {brandUniverses.length > 1 && (
          <div
            className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
            role="group"
            aria-label="Filtrer les marques par univers"
          >
            {[{ slug: null as string | null, name: "Toutes" }, ...brandUniverses].map((u) => (
              <button
                key={u.slug ?? "all"}
                type="button"
                aria-pressed={universe === u.slug}
                onClick={() => setUniverse(u.slug)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                  universe === u.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50 hover:text-primary",
                )}
              >
                {u.name}
              </button>
            ))}
          </div>
        )}

        {list.length > 0 ? (
          <RevealGroup
            key={universe ?? "all"}
            className="mt-8 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {list.map((b) => (
              <RevealItem key={b.slug} className="h-full">
                <BrandCard slug={b.slug} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-display font-semibold">Aucune marque dans cet univers pour l'instant</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Notre catalogue évolue en permanence — demandez-nous la référence recherchée.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setUniverse(null)}>
              Voir toutes les marques
            </Button>
          </div>
        )}

        {/* Marque recherchée */}
        <Reveal className="mt-12">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-display text-lg font-semibold">Vous cherchez une autre marque ?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Plus de 35 marques au catalogue : notre équipe vous répond sur la disponibilité et
                les tarifs professionnels.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button variant="cta" size="lg" asChild>
                <Link to="/devis">Demander un devis</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}