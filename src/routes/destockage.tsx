import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  ChevronRight,
  Clock,
  PackageCheck,
  PackageOpen,
  ScanSearch,
  ShieldCheck,
  Timer,
  Wrench,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogueView } from "@/components/site/catalogue-view";
import { CtaBand } from "@/components/site/layout-primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { BrandLogo } from "@/components/site/brand-logo";
import { ProductVisual } from "@/components/site/product-visual";
import { catalogueValidateSearch } from "@/lib/catalogue-search";
import { allUniverses } from "@/data/categories";
import { productsWithBadge, type Product } from "@/data/products";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/destockage")({
  validateSearch: catalogueValidateSearch,
  head: () =>
    pageHead({
      title: "Destockage — fins de série en quantités limitées | Polytel Maroc",
      description:
        "Destockage Polytel : fins de série et équipements professionnels d'origine en quantités limitées. Réservation et conditions sur devis.",
      path: "/destockage",
    }),
  component: DestockagePage,
});

/* ---------------- Données ---------------- */

const pool = productsWithBadge("Destockage");
/** Vraies fiches en priorité pour l'étiquette du hero. */
const showcase: Product[] = [
  ...pool.filter((p) => !p.placeholder),
  ...pool.filter((p) => p.placeholder),
];
const universeName = (slug: string) => allUniverses.find((u) => u.slug === slug)?.name ?? "";

const steps = [
  { icon: ScanSearch, title: "Repérez", text: "Parcourez les fins de série disponibles." },
  { icon: FileCheck2, title: "Réservez sur devis", text: "Indiquez vos quantités dans le devis." },
  { icon: PackageCheck, title: "Confirmation", text: "Un conseiller confirme la disponibilité." },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Produits d'origine",
    text: "Des équipements issus des marques que nous distribuons, sans compromis sur l'origine.",
  },
  {
    icon: Timer,
    title: "Quantités limitées",
    text: "Les stocks évoluent vite : la réservation se fait sur devis, au fil des demandes.",
  },
  {
    icon: Wrench,
    title: "Installation & SAV",
    text: "Nos services d'installation et de service après-vente restent disponibles.",
  },
];

/* ---------------- Visuel sans image ---------------- */

/** Les articles en destockage n'ont pas encore de photo : visuel "colis" de marque. */
const hasImage = (p: Product) => Boolean(p.images?.[0]);

function NoImageVisual({ product }: { product: Product }) {
  const Icon = allUniverses.find((u) => u.slug === product.universe)?.icon ?? PackageOpen;
  return (
    <div className="relative flex aspect-square size-full flex-col items-center justify-center gap-3 p-4 text-center">
      {/* Coins de colis */}
      <span className="absolute top-3 left-3 size-3 border-t-2 border-l-2 border-foreground/20" aria-hidden />
      <span className="absolute top-3 right-3 size-3 border-t-2 border-r-2 border-foreground/20" aria-hidden />
      <span className="absolute bottom-3 left-3 size-3 border-b-2 border-l-2 border-foreground/20" aria-hidden />
      <span className="absolute right-3 bottom-3 size-3 border-r-2 border-b-2 border-foreground/20" aria-hidden />
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-tint text-primary">
        <Icon className="size-6" aria-hidden />
      </span>
      <BrandLogo slug={product.brand} size="sm" className="h-4 opacity-80" />
      <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
        Visuel sur demande
      </span>
    </div>
  );
}

/* ---------------- Étiquette logistique (signature) ---------------- */

/** Code-barres décoratif généré à partir de la référence (stable, sans dépendance). */
function Barcode({ value }: { value: string }) {
  const bars = Array.from(value.padEnd(24, "0")).flatMap((ch, i) => {
    const c = ch.charCodeAt(0) + i;
    return [1 + (c % 3), 1 + ((c >> 2) % 2)];
  });
  return (
    <div className="flex h-12 items-stretch gap-[2px]" aria-hidden>
      {bars.map((w, i) => (
        <span
          key={i}
          className={i % 2 === 0 ? "bg-foreground" : "bg-transparent"}
          style={{ width: `${w * 1.5}px` }}
        />
      ))}
    </div>
  );
}

function StockLabel({ product }: { product: Product }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, rotate: -6, y: 24 }}
      animate={{ opacity: 1, rotate: -2, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative mx-auto w-full max-w-md"
    >
      {/* Ombre "pile" derrière l'étiquette */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-3 rounded-2xl border border-ink-border bg-ink-card" aria-hidden />
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-1 rounded-2xl border border-ink-border bg-ink-card/80" aria-hidden />

      <div className="relative overflow-hidden rounded-2xl bg-card text-foreground shadow-[0_50px_100px_-40px_oklch(0_0_0/80%)]">
        {/* Bande "attention" */}
        <div
          className="h-3"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--cta) 0 12px, var(--foreground) 12px 24px)",
          }}
          aria-hidden
        />
        <div className="flex items-center justify-between border-b border-dashed border-border px-5 py-3">
          <span className="font-mono text-[11px] font-semibold tracking-widest uppercase">
            Polytel · Destockage
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-cta px-2.5 py-0.5 text-[10.5px] font-semibold text-cta-foreground">
            <Clock className="size-3" aria-hidden />
            Stock limité
          </span>
        </div>

        <div className="grid grid-cols-5">
          <div className="product-surface relative col-span-2 border-r border-dashed border-border">
            {hasImage(product) ? (
              <ProductVisual
                product={product}
                priority
                width={200}
                height={200}
                className="aspect-square size-full"
                imgClassName="p-4"
              />
            ) : (
              <NoImageVisual product={product} />
            )}
          </div>
          <dl className="col-span-3 divide-y divide-dashed divide-border text-sm">
            <div className="px-4 py-2.5">
              <dt className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Article</dt>
              <dd className="truncate font-display font-semibold">{product.name}</dd>
            </div>
            <div className="px-4 py-2.5">
              <dt className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Réf.</dt>
              <dd className="font-mono">{product.reference}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 px-4 py-2.5">
              <div className="min-w-0">
                <dt className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Univers</dt>
                <dd className="truncate">{universeName(product.universe)}</dd>
              </div>
              <BrandLogo slug={product.brand} size="sm" className="h-4 shrink-0" />
            </div>
          </dl>
        </div>

        {/* Jauge de stock */}
        <div className="border-t border-dashed border-border px-5 py-4">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            <span>Disponibilité</span>
            <span>Sur devis</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-cta"
              initial={reduced ? false : { width: "100%" }}
              animate={{ width: "22%" }}
              transition={{ duration: 1.6, ease: "easeOut", delay: 0.6 }}
            />
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-dashed border-border px-5 py-4">
          <div>
            <Barcode value={product.reference} />
            <p className="mt-1 font-mono text-[10px] tracking-[0.3em]">{product.reference}</p>
          </div>
          <Link
            to="/produit/$slug"
            params={{ slug: product.slug }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Voir
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  const featured = showcase[0];
  const count = pool.length;

  return (
    <section className="crop-marks relative overflow-hidden bg-ink text-ink-foreground">
      <div
        className="dot-grid pointer-events-none absolute inset-0"
        style={{ maskImage: "radial-gradient(70% 70% at 75% 50%, black, transparent 80%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[-30%] right-[-10%] hidden size-[600px] rounded-full bg-cta/15 blur-[140px] md:block"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 md:pb-20 lg:px-8 lg:pb-24">
        <nav aria-label="Fil d'Ariane" className="text-xs text-ink-muted">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/" className="link-underline hover:text-ink-foreground">
                Accueil
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="text-ink-foreground">
              Destockage
            </li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
            <p className="inline-flex animate-in items-center gap-2 rounded-full border border-ink-border bg-white/5 px-3 py-1 font-mono text-[11px] tracking-wider uppercase duration-700 fade-in fill-mode-both motion-reduce:animate-none">
              <Clock className="size-3.5 text-cta" aria-hidden />
              Fins de série
            </p>
            <h1 className="display-xl mt-6 animate-in text-balance delay-100 duration-700 fade-in slide-in-from-bottom-4 fill-mode-both motion-reduce:animate-none">
              Destockage, <span className="text-cta">quantités limitées.</span>
            </h1>
            <p className="mt-6 max-w-xl animate-in text-base leading-relaxed text-ink-muted delay-200 duration-700 fade-in slide-in-from-bottom-4 fill-mode-both motion-reduce:animate-none md:text-lg">
              Des équipements d'origine en fin de série. Les disponibilités évoluent rapidement :
              demandez votre devis pour réserver vos quantités.
            </p>

            <ol className="mt-8 grid max-w-xl gap-px overflow-hidden rounded-2xl border border-ink-border bg-ink-border sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="bg-ink-card p-4">
                  <div className="flex items-center justify-between">
                    <s.icon className="size-4 text-cta" aria-hidden />
                    <span className="font-mono text-[10px] text-ink-muted">0{i + 1}</span>
                  </div>
                  <p className="mt-3 font-display text-sm font-semibold">{s.title}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{s.text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="cta" size="xl" asChild>
                <a href="#stock">
                  Voir le stock disponible
                  <ArrowDown aria-hidden />
                </a>
              </Button>
              <Button variant="ghost-dark" size="xl" asChild>
                <Link to="/devis">Réserver sur devis</Link>
              </Button>
            </div>
            <p className="mt-5 font-mono text-[11px] text-ink-muted">
              {count > 0
                ? `${count} article${count > 1 ? "s" : ""} en destockage · tarifs professionnels sur devis`
                : "Prochains arrivages bientôt en ligne"}
            </p>
          </div>

          <div className="lg:col-span-5">
            {featured ? (
              <StockLabel product={featured} />
            ) : (
              <div className="flex aspect-square flex-col items-center justify-center rounded-3xl border border-dashed border-ink-border text-center">
                <PackageOpen className="size-8 text-ink-muted" aria-hidden />
                <p className="mt-4 font-display font-semibold">Prochains arrivages bientôt</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bande "attention" basse */}
      <div
        className="h-2 opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--cta) 0 14px, transparent 14px 28px)",
        }}
        aria-hidden
      />
    </section>
  );
}

/* ---------------- Page ---------------- */

function DestockagePage() {
  const search = Route.useSearch();

  return (
    <>
      <Hero />

      {/* Avantages */}
      <section className="border-b border-border bg-card">
        <RevealGroup
          as="ul"
          className="mx-auto grid max-w-7xl divide-y divide-border px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8"
        >
          {benefits.map((b) => (
            <RevealItem as="li" key={b.title} className="flex gap-4 py-6 md:px-6 md:first:pl-0">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-tint text-primary">
                <b.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-display text-[15px] font-semibold">{b.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{b.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Stock */}
      <div id="stock" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 md:pt-20 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-muted-foreground">
                <span className="h-px w-6 bg-current opacity-60" aria-hidden />
                Stock disponible
              </p>
              <h2 className="display-md mt-3">Fins de série</h2>
            </div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
              <span className="relative inline-flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-cta opacity-60 motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-cta" />
              </span>
              Disponibilités confirmées sur devis
            </p>
          </div>
        </div>

        {pool.length > 0 ? (
          <CatalogueView search={search} pool={pool} locked={{ badge: true }} limitedLabel />
        ) : (
          <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
            <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-blue-tint text-primary">
              <PackageOpen className="size-6" aria-hidden />
            </span>
            <h2 className="display-md mt-6">Aucun article en destockage pour le moment</h2>
            <p className="mt-3 text-muted-foreground">
              Les fins de série partent vite. Consultez nos promotions ou demandez à être informé
              des prochains arrivages.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="xl" asChild>
                <Link to="/promotions">
                  Voir les promotions
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/contact">Être informé</Link>
              </Button>
            </div>
          </section>
        )}
      </div>

      {/* Rebonds */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="crop-marks relative flex flex-col justify-between overflow-hidden rounded-2xl bg-ink p-6 text-ink-foreground sm:p-8 md:col-span-3">
              <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
              <div className="relative">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white/10 text-cta">
                  <BellRing className="size-5" aria-hidden />
                </span>
                <h2 className="mt-5 max-w-md font-display text-2xl font-semibold text-balance">
                  Soyez informé des prochains arrivages
                </h2>
                <p className="mt-2 max-w-lg text-sm text-ink-muted">
                  Revendeurs et entreprises : indiquez-nous les familles de produits qui vous
                  intéressent, nos conseillers vous préviennent dès qu'un lot est disponible.
                </p>
              </div>
              <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="lg" asChild>
                  <Link to="/contact">Être informé</Link>
                </Button>
                <Button variant="ghost-dark" size="lg" asChild>
                  <Link to="/devis">Demander un devis</Link>
                </Button>
              </div>
            </div>
            <Link
              to="/promotions"
              className="card-hairline card-lift group relative flex flex-col justify-between overflow-hidden p-6 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:p-8 md:col-span-2"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center rounded-full bg-cta px-3 py-1 text-xs font-semibold text-cta-foreground">
                  Offres du moment
                </span>
                <ArrowUpRight
                  className="size-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </div>
              <div className="mt-12">
                <h2 className="font-display text-2xl font-semibold">Promotions</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Une sélection d'équipements d'origine en promotion pour les professionnels.
                </p>
              </div>
              <span className="scan-on-hover" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}