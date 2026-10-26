import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  GraduationCap,
  Heart,
  Layers,
  Package,
  ScanLine,
  Scissors,
  ShieldCheck,
  Shirt,
  Sparkles,
  Store,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogueView } from "@/components/site/catalogue-view";
import { Breadcrumbs, CtaBand, SectionHeading } from "@/components/site/layout-primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { BrandLogo } from "@/components/site/brand-logo";
import { WhatsAppIcon } from "@/components/site/icons";
import { catalogueValidateSearch } from "@/lib/catalogue-search";
import { coutureUniverse } from "@/data/categories";
import { productsBySubcategory, productsByUniverse } from "@/data/products";
import { buildWhatsAppLink } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/espace-couture")({
  validateSearch: catalogueValidateSearch,
  head: () =>
    pageHead({
      title: "Espace couture — machines à coudre et à broder Brother, Alfa au Maroc | Polytel",
      description:
        "Machines à coudre et à broder Brother, Alfa, Jaki et Jack, surjeteuses, Scan N Cut, machines de découpe et accessoires d'origine chez Polytel. Conseil et SAV.",
      path: "/espace-couture",
    }),
  component: CouturePage,
});

/* ---------------- Données ---------------- */

const categoryMeta: Record<string, { note: string; icon: LucideIcon }> = {
  "broderie-couture": { note: "Brother · Alfa · Jaki · Jack", icon: Shirt },
  "surjeteuses-recouvreuses": { note: "Finitions et coutures d'assemblage", icon: Layers },
  "scan-n-cut": { note: "Numériser et découper", icon: ScanLine },
  "machines-decoupe": { note: "Découpe créative", icon: Scissors },
  accessoires: { note: "Accessoires Brother & Alfa", icon: Package },
};

const coutureBrands = [
  { slug: "brother", line: "Couture, broderie, Scan N Cut" },
  { slug: "alfa", line: "Machines et accessoires" },
  { slug: "jaki", line: "Couture & broderie" },
  { slug: "jack", line: "Couture & broderie" },
];

const profiles = [
  { icon: Heart, title: "Passionnés", text: "Couture créative, broderie et loisirs à la maison." },
  { icon: Shirt, title: "Ateliers & confection", text: "Machines robustes pour un usage intensif." },
  { icon: Store, title: "Boutiques & retouches", text: "Finitions nettes et rapides au quotidien." },
  { icon: GraduationCap, title: "Formation", text: "Équipements simples à prendre en main." },
];

const realCount = (sub: string) =>
  productsBySubcategory(coutureUniverse.slug, sub).filter((p) => !p.placeholder).length;

/* ---------------- Motifs couture ---------------- */

/** Fil animé qui "coud" à travers la composition du hero. */
function Thread({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      aria-hidden
    >
      <motion.path
        d="M20 60 C 140 10, 260 120, 200 190 S 60 300, 180 330 S 360 300, 385 360"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

/** Mètre ruban décoratif (graduations + chiffres en mono). */
function TapeMeasure() {
  return (
    <div className="relative h-12 overflow-hidden border-y border-foreground/10 bg-cta/90" aria-hidden>
      <div
        className="absolute inset-x-0 top-0 h-3"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, color-mix(in oklch, var(--foreground) 55%, transparent) 0 1px, transparent 1px 8px)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--foreground) 0 1.5px, transparent 1.5px 40px)",
        }}
      />
      <div className="absolute bottom-1.5 left-0 flex">
        {Array.from({ length: 60 }, (_, i) => (
          <span key={i} className="w-10 shrink-0 pl-1 font-mono text-[10px] font-semibold text-cta-foreground">
            {i * 5}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Étiquette "cousue" (bordure en pointillés intérieure). */
function SewnPatch({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative rounded-2xl border border-border bg-card p-1.5 shadow-sm", className)}>
      <div className="h-full rounded-xl border-2 border-dashed border-warm-foreground/30">{children}</div>
    </div>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  const reduced = useReducedMotion();
  const rotations = ["-rotate-3", "rotate-2", "rotate-1", "-rotate-2"];

  return (
    <section className="relative overflow-hidden bg-warm">
      <div
        className="dot-grid-light pointer-events-none absolute inset-0"
        aria-hidden
        style={{ maskImage: "radial-gradient(60% 100% at 85% 0%, black, transparent 70%)" }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-8 pb-16 sm:px-6 md:pb-20 lg:grid-cols-12 lg:items-center lg:px-8">
        <div className="lg:col-span-7">
          <Breadcrumbs items={[{ label: "Accueil", to: "/" }, { label: "Espace couture" }]} />
          <Reveal className="mt-10">
            <p className="eyebrow text-warm-foreground">
              <Scissors className="size-3.5" aria-hidden />
              Espace couture
            </p>
            <h1 className="display-lg mt-4 text-balance">
              Couture,{" "}
              <span className="relative inline-block">
                broderie
                <svg
                  viewBox="0 0 200 12"
                  className="absolute -bottom-2 left-0 h-3 w-full text-warm-foreground"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <motion.path
                    d="M2 8 Q 50 2, 100 7 T 198 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="6 5"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  />
                </svg>
              </span>{" "}
              et découpe : l'équipement des passionnés et des pros
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {coutureUniverse.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="cta" size="xl" asChild>
                <a href="#machines">
                  Voir les machines
                  <ArrowDown aria-hidden />
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a
                  href={buildWhatsAppLink(
                    "Bonjour Polytel, je souhaite un conseil pour une machine à coudre ou à broder…",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon className="text-whatsapp" aria-hidden />
                  Conseil sur WhatsApp
                </a>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] tracking-wide text-muted-foreground">
              {["Produits d'origine", "Accessoires Brother & Alfa", "SAV Polytel"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-warm-foreground" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Composition : étiquettes de marque cousues reliées par un fil */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <Thread className="text-warm-foreground/50" />
            <ul className="relative grid size-full grid-cols-2 place-items-center gap-4 p-2" aria-label="Marques de l'espace couture">
              {coutureBrands.map((b, i) => (
                <li key={b.slug} className={cn("w-full transition-transform duration-500 hover:rotate-0", rotations[i])}>
                  <Link
                    to="/marques/$slug"
                    params={{ slug: b.slug }}
                    className="group block focus-visible:outline-none"
                  >
                    <SewnPatch className="card-lift group-focus-visible:ring-2 group-focus-visible:ring-primary">
                      <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center">
                        <BrandLogo slug={b.slug} size="md" reveal className="max-h-9" />
                        <span className="text-[11px] text-muted-foreground">{b.line}</span>
                      </div>
                    </SewnPatch>
                  </Link>
                </li>
              ))}
            </ul>
            <span className="absolute -top-2 right-6 inline-flex rotate-6 items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-ink-foreground shadow-lift">
              <Sparkles className="size-3.5 text-cta" aria-hidden />
              4 marques
            </span>
          </div>
        </div>
      </div>
      <TapeMeasure />
    </section>
  );
}

/* ---------------- Page ---------------- */

function CouturePage() {
  const search = Route.useSearch();

  return (
    <>
      <Hero />

      {/* Pour qui */}
      <section className="border-b border-border bg-card">
        <RevealGroup
          as="ul"
          className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-4 min-[480px]:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:px-8"
        >
          {profiles.map((p) => (
            <RevealItem as="li" key={p.title} className="flex items-center gap-4 py-6 lg:px-6 lg:first:pl-0">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-warm text-warm-foreground">
                <p.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-display text-[15px] font-semibold">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Rubriques */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 md:pt-24 lg:px-8">
        <SectionHeading
          eyebrow="Rubriques"
          title="Choisissez votre univers créatif"
          description="De la machine à coudre à la découpe de précision, tout l'équipement pour créer, finir et personnaliser."
        />
        <RevealGroup className="mt-10 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-5">
          {coutureUniverse.subcategories.map((sub, i) => {
            const count = realCount(sub.slug);
            const meta = categoryMeta[sub.slug] ?? { note: "", icon: Scissors };
            return (
              <RevealItem key={sub.slug} className="h-full">
                <Link
                  to="/produits/$univers/$sousCategorie"
                  params={{ univers: coutureUniverse.slug, sousCategorie: sub.slug }}
                  className="group block h-full focus-visible:outline-none"
                >
                  <SewnPatch className="card-lift h-full bg-warm transition-colors group-hover:bg-card group-focus-visible:ring-2 group-focus-visible:ring-primary">
                    <div className="flex h-full flex-col p-4">
                      <div className="flex items-start justify-between">
                        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-card text-warm-foreground transition-colors group-hover:bg-warm">
                          <meta.icon className="size-5" aria-hidden />
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-6 font-display font-semibold">{sub.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{meta.note}</p>
                      <div className="mt-auto flex items-center justify-between pt-5">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {count > 0 ? `${count} référence${count > 1 ? "s" : ""}` : "Sur demande"}
                        </span>
                        <ArrowUpRight
                          className="size-4 text-warm-foreground opacity-60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                          aria-hidden
                        />
                      </div>
                    </div>
                  </SewnPatch>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* Catalogue */}
      <div id="machines" className="scroll-mt-24 pt-8">
        <CatalogueView
          search={search}
          pool={productsByUniverse(coutureUniverse.slug)}
          universe={coutureUniverse}
        />
      </div>

      {/* Conseil & service */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground sm:p-10 md:col-span-3">
              <Thread className="text-white/10" />
              <div className="relative">
                <p className="font-mono text-[11px] tracking-wider text-ink-muted uppercase">
                  Conseil personnalisé
                </p>
                <h2 className="mt-3 max-w-md font-display text-2xl font-semibold text-balance sm:text-3xl">
                  Quelle machine pour votre projet ?
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
                  Couture d'entretien, confection, broderie ou découpe : décrivez votre usage, un
                  conseiller vous oriente vers l'équipement adapté et vous adresse un devis.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button variant="cta" size="lg" asChild>
                    <a
                      href={buildWhatsAppLink(
                        "Bonjour Polytel, j'aimerais un conseil pour choisir une machine (usage : …)",
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WhatsAppIcon aria-hidden />
                      Écrire sur WhatsApp
                    </a>
                  </Button>
                  <Button variant="ghost-dark" size="lg" asChild>
                    <Link to="/devis">Demander un devis</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:col-span-2">
              <SewnPatch className="flex-1">
                <div className="flex h-full gap-4 p-5">
                  <ShieldCheck className="size-6 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-display font-semibold">Brother, distributeur agréé DAMS</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Garantie, réparation et maintenance des machines Brother par nos équipes.
                    </p>
                  </div>
                </div>
              </SewnPatch>
              <Link to="/services" className="group block flex-1 focus-visible:outline-none">
                <SewnPatch className="card-lift h-full group-focus-visible:ring-2 group-focus-visible:ring-primary">
                  <div className="flex h-full gap-4 p-5">
                    <Wrench className="size-6 shrink-0 text-primary" aria-hidden />
                    <div className="flex-1">
                      <p className="font-display font-semibold">Services & SAV</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Mise en service, entretien et réparation.
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                  </div>
                </SewnPatch>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <CtaBand
        title="Un projet d'atelier ou de boutique ?"
        description="Machines, accessoires et consommables : un conseiller vous accompagne dans le choix de votre équipement couture."
      />
    </>
  );
}