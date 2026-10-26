import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  PackageOpen,
  Send,
  ShieldCheck,
  Tag,
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/promotions")({
  validateSearch: catalogueValidateSearch,
  head: () =>
    pageHead({
      title: "Promotions — équipement professionnel en offre | Polytel Maroc",
      description:
        "Promotions Polytel sur l'impression, les caisses enregistreuses, l'étiquetage et l'équipement de bureau. Produits d'origine, conditions professionnelles sur devis.",
      path: "/promotions",
    }),
  component: PromotionsPage,
});

/* ---------------- Données ---------------- */

/** Uniquement les vraies fiches en promotion (pas de "Modèle exemple"). */
const promoPool = productsWithBadge("Promo").filter((p) => !p.placeholder);
const promoBrands = [...new Set(promoPool.map((p) => p.brand))];
const universeName = (slug: string) => allUniverses.find((u) => u.slug === slug)?.name ?? "";

const SPOTLIGHT_MS = 5000;

const steps = [
  { icon: ClipboardList, title: "Ajoutez au devis", text: "Sélectionnez références et quantités." },
  { icon: Send, title: "Envoyez la demande", text: "Par WhatsApp ou par email, en un clic." },
  { icon: FileCheck2, title: "Recevez vos conditions", text: "Un conseiller vous adresse l'offre." },
];

/* ---------------- Spotlight rotatif ---------------- */

function Spotlight({ items }: { items: Product[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoplay = !reduced && !paused && items.length > 1;

  useEffect(() => {
    if (!autoplay) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), SPOTLIGHT_MS);
    return () => window.clearTimeout(t);
  }, [autoplay, index, items.length]);

  const current = items[index];
  if (!current) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Carte principale */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card text-foreground shadow-[0_50px_100px_-40px_oklch(0_0_0/80%)]">
        <div className="product-surface relative aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
          <div className="scan-head" aria-hidden />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduced ? false : { opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              {...(!reduced && { exit: { opacity: 0, scale: 1.03, y: -8 } })}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <ProductVisual
                product={current}
                priority
                width={640}
                height={440}
                className="size-full"
                imgClassName="p-8 sm:p-10"
              />
            </motion.div>
          </AnimatePresence>

          {/* Tampon promo */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-cta px-3 py-1 text-xs font-semibold text-cta-foreground shadow-sm">
            <Tag className="size-3.5" aria-hidden />
            Promo
          </div>
          <div className="absolute top-4 right-4 rounded-full border border-border bg-card/90 px-2.5 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </div>
        </div>

        <div className="border-t border-border p-5 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              {...(reduced ? {} : { exit: { opacity: 0, y: -6 } })}
              className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <BrandLogo slug={current.brand} size="sm" className="h-4" />
                  <span className="truncate text-xs text-muted-foreground">
                    {universeName(current.universe)}
                  </span>
                </div>
                <p className="mt-2 truncate font-display text-xl font-semibold">{current.name}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{current.reference}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/produit/$slug" params={{ slug: current.slug }}>
                    Voir la fiche
                  </Link>
                </Button>
                <Button variant="cta" size="lg" asChild>
                  <Link to="/devis">
                    Mes conditions
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Sélecteur + progression */}
      {items.length > 1 && (
        <div
          className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1"
          role="tablist"
          aria-label="Produits en promotion"
        >
          {items.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${p.name} — ${p.reference}`}
              onClick={() => setIndex(i)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none",
                i === index ? "border-cta" : "border-ink-border opacity-60 hover:opacity-100",
              )}
            >
              <ProductVisual
                product={p}
                width={64}
                height={64}
                className="product-surface size-14 sm:size-16"
                imgClassName="p-1.5"
              />
              {i === index && autoplay && (
                <motion.span
                  key={`progress-${index}`}
                  className="absolute inset-x-0 bottom-0 h-1 origin-left bg-cta"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: SPOTLIGHT_MS / 1000, ease: "linear" }}
                  aria-hidden
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Bandeau défilant des références ---------------- */

function RefTicker({ items }: { items: Product[] }) {
  const reduced = useReducedMotion();
  if (items.length === 0) return null;
  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-ink-border bg-cta py-3 text-cta-foreground" aria-hidden>
      <motion.div
        className="flex w-max gap-8 whitespace-nowrap"
        {...(reduced ? {} : { animate: { x: ["0%", "-50%"] } })}
        transition={{ duration: Math.max(20, items.length * 4), ease: "linear", repeat: Infinity }}
      >
        {row.map((p, i) => (
          <span key={`${p.id}-${i}`} className="inline-flex items-center gap-3 font-mono text-sm font-semibold">
            <Tag className="size-3.5 opacity-70" />
            {p.reference}
            <span className="font-sans font-medium opacity-75">{p.name}</span>
            <span className="opacity-40">/</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  const count = promoPool.length;

  return (
    <section className="crop-marks relative overflow-hidden bg-ink text-ink-foreground">
      <div
        className="dot-grid pointer-events-none absolute inset-0"
        style={{ maskImage: "radial-gradient(70% 70% at 75% 45%, black, transparent 80%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[-25%] right-[-10%] hidden size-[640px] rounded-full bg-cta/20 blur-[140px] md:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-35%] left-[-15%] hidden size-[520px] rounded-full bg-primary/35 blur-[140px] md:block"
        aria-hidden
      />
      {/* Grand mot en filigrane */}
      <p
        className="pointer-events-none absolute -bottom-6 left-0 font-display text-[22vw] leading-none font-bold tracking-tighter text-white/[0.03] select-none lg:text-[16rem]"
        aria-hidden
      >
        PROMO
      </p>

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
              Promotions
            </li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <p className="inline-flex animate-in items-center gap-2 rounded-full border border-ink-border bg-white/5 py-1 pr-3 pl-1 text-xs font-medium duration-700 fade-in fill-mode-both motion-reduce:animate-none">
              <span className="relative inline-flex size-5 items-center justify-center rounded-full bg-cta">
                <span className="absolute inset-0 animate-ping rounded-full bg-cta opacity-40 motion-reduce:animate-none" />
                <Tag className="relative size-3 text-cta-foreground" aria-hidden />
              </span>
              Offres du moment
            </p>
            <h1 className="display-xl mt-6 animate-in text-balance delay-100 duration-700 fade-in slide-in-from-bottom-4 fill-mode-both motion-reduce:animate-none">
              Promotions <span className="text-cta">professionnelles</span>
            </h1>
            <p className="mt-6 max-w-lg animate-in text-base leading-relaxed text-ink-muted delay-200 duration-700 fade-in slide-in-from-bottom-4 fill-mode-both motion-reduce:animate-none md:text-lg">
              Une sélection d'équipements d'origine en promotion, réservée aux professionnels.
              Ajoutez vos références au devis : nos conseillers vous communiquent les conditions.
            </p>

            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-ink-border bg-ink-border">
              {[
                { k: "Offres", v: String(count) },
                { k: "Marques", v: String(promoBrands.length) },
                { k: "Origine", v: "100 %" },
              ].map((s) => (
                <div key={s.k} className="bg-ink-card px-4 py-4">
                  <dt className="font-mono text-[10px] tracking-wider text-ink-muted uppercase">{s.k}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold">{s.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="cta" size="xl" asChild>
                <a href="#offres">
                  Voir toutes les offres
                  <ArrowDown aria-hidden />
                </a>
              </Button>
              <Button variant="ghost-dark" size="xl" asChild>
                <Link to="/devis">Demander mes conditions</Link>
              </Button>
            </div>

            {promoBrands.length > 0 && (
              <ul className="mt-10 flex flex-wrap items-center gap-2" aria-label="Marques en promotion">
                {promoBrands.map((slug) => (
                  <li key={slug}>
                    <Link
                      to="/marques/$slug"
                      params={{ slug }}
                      className="inline-flex h-9 items-center rounded-lg bg-white px-3 transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none"
                      aria-label={`Marque ${slug}`}
                    >
                      <BrandLogo slug={slug} size="sm" className="max-h-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-6">
            {count > 0 ? (
              <Spotlight items={promoPool} />
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-3xl border border-dashed border-ink-border text-center">
                <PackageOpen className="size-8 text-ink-muted" aria-hidden />
                <p className="mt-4 font-display font-semibold">Nouvelles offres bientôt disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

function PromotionsPage() {
  const search = Route.useSearch();
  const count = promoPool.length;

  return (
    <>
      <Hero />
      <RefTicker items={promoPool} />

      {/* Comment profiter des offres */}
      <section className="border-b border-border bg-card">
        <RevealGroup
          as="ul"
          className="mx-auto grid max-w-7xl divide-y divide-border px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8"
        >
          {steps.map((s, i) => (
            <RevealItem as="li" key={s.title} className="flex items-center gap-4 py-6 md:px-6 md:first:pl-0">
              <span className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-tint text-primary">
                <s.icon className="size-5" aria-hidden />
                <span className="absolute -top-1.5 -right-1.5 inline-flex size-5 items-center justify-center rounded-full bg-primary font-mono text-[10px] font-semibold text-primary-foreground">
                  {i + 1}
                </span>
              </span>
              <div>
                <p className="font-display text-[15px] font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Catalogue des offres */}
      <div id="offres" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 md:pt-20 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-muted-foreground">
                <span className="h-px w-6 bg-current opacity-60" aria-hidden />
                Catalogue promotions
              </p>
              <h2 className="display-md mt-3">Toutes les offres</h2>
            </div>
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" aria-hidden />
              Produits d'origine · garantie constructeur
            </p>
          </div>
        </div>

        {count > 0 ? (
          <CatalogueView search={search} pool={promoPool} locked={{ badge: true }} />
        ) : (
          <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
            <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-blue-tint text-primary">
              <PackageOpen className="size-6" aria-hidden />
            </span>
            <h2 className="display-md mt-6">Aucune promotion en ligne pour le moment</h2>
            <p className="mt-3 text-muted-foreground">
              Nos offres évoluent régulièrement. Parcourez le catalogue ou demandez directement vos
              conditions à notre équipe commerciale.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="xl" asChild>
                <Link to="/produits">
                  Explorer le catalogue
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/devis">Demander un devis</Link>
              </Button>
            </div>
          </section>
        )}
      </div>

      {/* Rebonds */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-5">
            <Link
              to="/destockage"
              className="card-hairline card-lift group relative flex flex-col justify-between overflow-hidden p-6 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:p-8 md:col-span-2"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center rounded-full bg-cta px-3 py-1 text-xs font-semibold text-cta-foreground">
                  Quantités limitées
                </span>
                <ArrowUpRight
                  className="size-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </div>
              <div className="mt-12">
                <h2 className="font-display text-2xl font-semibold">Destockage</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Des équipements d'origine disponibles en quantités limitées.
                </p>
              </div>
              <span className="scan-on-hover" aria-hidden />
            </Link>
            <div className="crop-marks relative flex flex-col justify-between overflow-hidden rounded-2xl bg-ink p-6 text-ink-foreground sm:p-8 md:col-span-3">
              <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
              <div className="relative">
                <p className="font-mono text-[11px] tracking-wider text-ink-muted uppercase">
                  Revendeurs · Entreprises · Administrations
                </p>
                <h2 className="mt-3 max-w-md font-display text-2xl font-semibold text-balance">
                  Un volume ou une référence hors promotion ?
                </h2>
                <p className="mt-2 max-w-lg text-sm text-ink-muted">
                  Nos conseillers étudient vos quantités et vous proposent des conditions adaptées
                  à votre activité.
                </p>
              </div>
              <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="lg" asChild>
                  <Link to="/devis">Demander un devis</Link>
                </Button>
                <Button variant="ghost-dark" size="lg" asChild>
                  <Link to="/contact">Nous contacter</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}