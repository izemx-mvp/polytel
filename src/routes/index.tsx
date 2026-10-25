import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  Headset,
  PackageCheck,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Reveal, CountUp, ProductImage } from "@/components/site/motion-primitives";
import { ProductCard } from "@/components/site/product-card";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import {
  products,
  productsByUniverse,
  getProduct,
  type Product,
} from "@/data/products";
import { site, buildWhatsAppLink } from "@/config/site";
import { cn } from "@/lib/utils";

const heroProducts: Product[] = ["brother-mfc-j985dw", "sharp-xe-a217", "zebra-tc72-tc77-touch"]
  .map(getProduct)
  .filter((p): p is Product => Boolean(p));

const promoProducts = products.filter((p) => p.badges.includes("Promo"));

const sectors = [
  {
    name: "Commerce & retail",
    blurb: "Caisses, terminaux POS et imprimantes fiscales pour l'encaissement.",
    univers: "caisse-pos",
  },
  {
    name: "Bureaux & services",
    blurb: "Impression, numérisation et consommables pour tous vos documents.",
    univers: "impression",
  },
  {
    name: "Logistique & industrie",
    blurb: "Terminaux mobiles, étiquetage et traçabilité sur le terrain.",
    univers: "identification",
  },
  {
    name: "Santé & hôtellerie",
    blurb: "Informatique mobile, badges et affichage dynamique.",
    univers: "informatique",
  },
  {
    name: "Administrations",
    blurb: "Fournitures, mobilier et équipement standardisé à l'échelle.",
    univers: "fourniture",
  },
];

const servicesBand = [
  {
    icon: Wrench,
    title: "Installation & mise en service",
    text: "Livraison, installation et paramétrage par nos techniciens certifiés.",
  },
  {
    icon: CalendarCheck,
    title: "Maintenance préventive",
    text: "Contrats de maintenance avec 4 visites préventives par an.",
  },
  {
    icon: ShieldCheck,
    title: "Réparation multi-marques",
    text: "Atelier de dépannage pour toutes les marques que nous distribuons.",
  },
  {
    icon: PackageCheck,
    title: "Consommables d'origine",
    text: "Toners, rubans et pièces 100 % d'origine, en stock à Casablanca.",
  },
];

const bentoSpans = [
  "col-span-2 md:row-span-2",
  "col-span-2 md:col-span-2",
  "",
  "",
  "",
  "col-span-2 md:col-span-2",
  "",
  "",
  "",
  "",
];

function FloatImage({ product, delay, className }: { product: Product; delay: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={cn("relative", className)}
      animate={reduced ? undefined : { y: [0, -12, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="card-hairline relative overflow-hidden p-2 shadow-2xl">
        <div className="scan-beam left-0" aria-hidden />
        <ProductImage
          src={product.image}
          alt={`${product.name} — réf. ${product.reference}`}
          className="mx-auto h-28 w-auto object-contain sm:h-36 lg:h-44"
        />
      </div>
      <p className="mt-2 text-center font-mono text-[11px] text-ink-foreground/60">
        {product.reference}
      </p>
    </motion.div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "POLYTEL — Importateur équipement de bureau, informatique & point de vente au Maroc",
      },
      {
        name: "description",
        content:
          "POLYTEL, négociant import-export à Casablanca depuis 1990 : impression, caisse & POS, informatique, identification et multimédia. Produits 100 % d'origine, installation et SAV certifié.",
      },
      { property: "og:title", content: "POLYTEL — Négociant Import-Export au Maroc" },
      {
        property: "og:description",
        content:
          "L'équipement professionnel, de l'impression au point de vente. Importateur officiel Brother au Maroc depuis 1990.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroProducts[0]?.image ?? "" },
      { name: "twitter:image", content: heroProducts[0]?.image ?? "" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(60% 80% at 85% 20%, oklch(0.46 0.145 262 / 35%) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-ink-border bg-white/5 px-3 py-1 text-xs font-medium tracking-wide">
                <BadgeCheck className="size-3.5 text-cta" aria-hidden />
                Importateur officiel Brother au Maroc depuis {site.foundedYear}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="text-balance mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                L'équipement professionnel, de l'impression au point de vente.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-foreground/70 sm:text-lg">
                Depuis {site.foundedYear}, POLYTEL importe et distribue au Maroc plus de 35 marques
                d'équipement 100 % d'origine — avec installation, maintenance et service
                après-vente certifié.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/produits"
                  className="inline-flex items-center gap-2 rounded-md bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover"
                >
                  Explorer le catalogue
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  to="/devis"
                  className="inline-flex items-center gap-2 rounded-md border border-ink-border bg-white/5 px-6 py-3 text-sm font-semibold text-ink-foreground transition-colors hover:bg-white/15"
                >
                  Demander un devis
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative mx-auto grid w-full max-w-lg grid-cols-3 items-center gap-3 lg:gap-5">
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cta/60 to-transparent"
              aria-hidden
            />
            {heroProducts[0] && (
              <FloatImage product={heroProducts[0]} delay={0} className="-rotate-3" />
            )}
            {heroProducts[1] && (
              <FloatImage product={heroProducts[1]} delay={0.7} className="z-10 scale-110" />
            )}
            {heroProducts[2] && (
              <FloatImage product={heroProducts[2]} delay={1.4} className="rotate-3" />
            )}
          </div>
        </div>
      </section>

      {/* 2. Bandeau de confiance */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
          {[
            { value: site.foundedYear, suffix: "", label: "Année de création" },
            { value: 35, suffix: "+", label: "Marques d'origine" },
            { value: 10, suffix: "", label: "Univers de produits" },
            { value: 2, suffix: "", label: "Agences — Casablanca & Agadir" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="text-center sm:text-left">
                <p className="font-display text-3xl font-bold text-primary">
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. Bento des 10 univers */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Nos univers de produits</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Dix univers pour équiper l'ensemble de vos postes de travail — sélectionnés auprès des
            plus grandes marques internationales.
          </p>
        </Reveal>
        <div className="mt-8 grid auto-rows-min grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat, i) => {
            const count = productsByUniverse(cat.slug).length;
            const featured = i === 0;
            return (
              <Reveal key={cat.slug} delay={i * 0.04} className={cn(bentoSpans[i], "h-full")}>
                <Link
                  to={featured ? "/produits/impression" : "/produits/$univers"}
                  params={featured ? undefined : { univers: cat.slug }}
                  className="card-hairline group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-blue-tint text-primary">
                      <cat.icon className="size-5" aria-hidden />
                    </span>
                    <ArrowUpRight
                      className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
                      aria-hidden
                    />
                  </div>
                  <h3
                    className={cn(
                      "mt-4 font-display font-semibold text-foreground",
                      featured ? "text-2xl" : "text-base",
                    )}
                  >
                    {cat.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-sm text-muted-foreground",
                      featured ? "max-w-md" : "line-clamp-2",
                    )}
                  >
                    {cat.blurb}
                  </p>
                  <p className="mt-auto pt-3 font-mono text-xs text-muted-foreground">
                    {count} produit{count > 1 ? "s" : ""}
                  </p>
                  {featured && (
                    <div className="mt-4 hidden flex-wrap gap-1.5 md:flex">
                      {cat.subcategories.slice(0, 6).map((sub) => (
                        <span
                          key={sub}
                          className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 4. Carrousel promotions */}
      <section className="border-y border-border bg-blue-tint py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">Promotions en cours</h2>
                <p className="mt-2 text-muted-foreground">
                  Offres réservées aux professionnels — tarification sur devis.
                </p>
              </div>
              <Link
                to="/promotions"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Voir toutes les promotions
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Carousel opts={{ align: "start" }} className="mt-8">
              <CarouselContent className="-ml-4">
                {promoProducts.map((p) => (
                  <CarouselItem key={p.id} className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <ProductCard product={p} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </Reveal>
        </div>
      </section>

      {/* 5. Marques — défilement */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
            Plus de 35 marques internationales
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Une stratégie « One Stop Shopping » : toutes vos références auprès d'un seul
            interlocuteur.
          </p>
        </Reveal>
        <div className="mt-10 overflow-hidden" aria-hidden>
          <div className="marquee-track flex w-max items-center">
            {[...brands, ...brands].map((b, i) => (
              <span key={`${b.slug}-${i}`} className="mx-10 flex shrink-0 items-center">
                <img
                  src={b.logo}
                  alt={i < brands.length ? b.name : ""}
                  loading="lazy"
                  className="h-9 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/marques"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Découvrir nos marques
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* 6. Brother, partenaire historique */}
      <section className="border-y border-border bg-background py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2">
          <Reveal>
            <div className="card-hairline relative overflow-hidden p-8">
              <div className="scan-beam left-0" aria-hidden />
              <ProductImage
                src={heroProducts[0]?.image ?? ""}
                alt="Brother MFC-J985DW — multifonction jet d'encre Brother"
                className="mx-auto h-64 w-auto object-contain lg:h-80"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Partenariat historique
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Brother, notre partenaire depuis 1990
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Importateur officiel Brother au Maroc depuis plus de 35 ans, POLYTEL accompagne les
              entreprises, administrations et revendeurs avec la gamme complète d'imprimantes,
              multifonctions, scanners et consommables d'origine Brother.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Notre certification <strong className="text-foreground">DAMS</strong> (Distributeur
              Agréé Matériel de Service) garantit installation, garantie et service après-vente
              aux standards du constructeur.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/produits"
                search={{ marque: "brother" }}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Produits Brother
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Services & SAV certifiés
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. Solutions par secteur */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Solutions par secteur</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Des ensembles cohérents de matériel, adaptés aux contraintes de chaque métier.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {sectors.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.06} className="h-full">
              <Link
                to="/produits/$univers"
                params={{ univers: s.univers }}
                className="card-hairline group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary">
                  Voir la sélection
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 8. Bande services */}
      <section className="relative overflow-hidden bg-ink py-16 text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Bien plus qu'un distributeur
            </h2>
            <p className="mt-2 max-w-2xl text-ink-foreground/70">
              Nos équipes techniques vous accompagnent avant, pendant et après l'achat.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {servicesBand.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06} className="h-full">
                <div className="h-full rounded-xl border border-ink-border bg-ink-card p-6 transition-colors hover:border-white/25">
                  <s.icon className="size-6 text-cta" aria-hidden />
                  <h3 className="mt-4 font-display text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-foreground/70">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-10">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-md border border-ink-border bg-white/5 px-6 py-3 text-sm font-semibold text-ink-foreground transition-colors hover:bg-white/15"
              >
                Découvrir nos services
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. CTA final */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <div className="card-hairline relative overflow-hidden bg-blue-tint p-8 text-center sm:p-12">
            <div className="scan-beam left-0" aria-hidden />
            <h2 className="text-balance font-display text-2xl font-bold sm:text-3xl">
              Un projet d'équipement ? Parlons-en.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Prix réservés aux professionnels : demandez votre devis personnalisé, sans engagement.
              Un conseiller vous répond rapidement.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/devis"
                className="inline-flex items-center gap-2 rounded-md bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover"
              >
                <Headset className="size-4" aria-hidden />
                Demander un devis
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <Phone className="size-4 text-primary" aria-hidden />
                {site.phone}
              </a>
              <a
                href={buildWhatsAppLink("Bonjour POLYTEL, je souhaite un devis pour un projet d'équipement.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
