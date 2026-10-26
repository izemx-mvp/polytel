import { useMemo, useState, type PointerEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  ClipboardList,
  Factory,
  HeartPulse,
  Landmark,
  Layers,
  PackageCheck,
  Phone,
  ScanLine,
  Scissors,
  Send,
  ShieldCheck,
  Shirt,
  Store,
  UserPlus,
  Wrench,
  FileCheck2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp, Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { ProductCard } from "@/components/site/product-card";
import { ProductCarousel } from "@/components/site/product-carousel";
import { ProductVisual } from "@/components/site/product-visual";
import { BrandMarquee } from "@/components/site/brand-marquee";
import { BrandLogo } from "@/components/site/brand-logo";
import { SearchBox } from "@/components/site/search-box";
import { CtaBand, SectionHeading } from "@/components/site/layout-primitives";
import { categories, coutureUniverse, type Category } from "@/data/categories";
import { getProduct, products, productsWithBadge, type Product } from "@/data/products";
import { site } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

/* ---------------- Données ---------------- */

/** Uniquement les vraies fiches produits : aucun "Modèle exemple" sur la page d'accueil. */
const realProducts = products.filter((p) => !p.placeholder);
const isReal = (p: Product | undefined): p is Product => Boolean(p && !p.placeholder);

const realInUniverse = (slug: string) => realProducts.filter((p) => p.universe === slug);

const heroProducts = ["brother-mfc-j985dw", "sharp-xe-a217", "zebra-tc72-tc77-touch"]
  .map(getProduct)
  .filter(isReal);

const promoProducts = productsWithBadge("Promo").filter((p) => !p.placeholder);

/** Meilleures offres : vraies fiches uniquement, promotions en tête. */
const bestOffers = [...realProducts].sort(
  (a, b) => Number(b.badges.includes("Promo")) - Number(a.badges.includes("Promo")),
);

/** Agences — à garder synchronisé avec src/config/site.ts. */
const agencies = [
  { city: "Casablanca", address: "10-15, Rue Allal El Fassi", phone: "+212522274755", display: "05 22 27 47 55" },
  { city: "Agadir", address: "N°48, Bd Hassan Bounaâmani, Cité Dakhla", phone: "+212528214255", display: "05 28 21 42 55" },
];

const promises = [
  { icon: PackageCheck, title: "Produits 100 % d'origine", text: "Circuit officiel des marques" },
  { icon: BadgeCheck, title: "Garantie constructeur", text: "Sur l'ensemble du catalogue" },
  { icon: Wrench, title: "Installation & mise en service", text: "Par nos techniciens" },
  { icon: ShieldCheck, title: "SAV multi-marques", text: "Distributeur agréé DAMS Brother" },
];

const byBrands = (...brands: string[]) =>
  realProducts.filter((p) => brands.includes(p.brand)).slice(0, 2);

const sectors = [
  {
    icon: Store,
    name: "Commerce & retail",
    items: "Caisses, terminaux POS, lecteurs code-barres, étiquettes",
    to: "/produits/$univers",
    params: { univers: "caisse-pos" },
  },
  {
    icon: Building2,
    name: "Entreprises & bureaux",
    items: "Impression, copieurs, mobilier, fournitures",
    to: "/produits/$univers",
    params: { univers: "impression" },
  },
  {
    icon: Factory,
    name: "Logistique & industrie",
    items: "Zebra, Honeywell, SATO, Videojet, terminaux mobiles",
    to: "/produits",
    search: { marque: "zebra,honeywell,sato,videojet" },
  },
  {
    icon: HeartPulse,
    name: "Santé & hôtellerie",
    items: "Imprimantes à bracelets, badges Evolis",
    to: "/produits/$univers",
    params: { univers: "impression" },
    search: { sub: "imprimantes-bracelets,imprimantes-badges" },
  },
  {
    icon: Landmark,
    name: "Administrations",
    items: "Lecteurs de passeports, destructeurs, gestion de file d'attente",
    to: "/produits",
    search: { sub: "lecteurs-passeports,destructeurs-documents,gestion-file-attente" },
  },
] as const;

/** Vignettes produits par secteur (même ordre que `sectors`). */
const sectorThumbs: Product[][] = [
  realInUniverse("caisse-pos").slice(0, 2),
  realInUniverse("impression").slice(0, 2),
  byBrands("zebra", "honeywell", "sato", "videojet"),
  byBrands("evolis"),
  byBrands("olympia"),
];

const services = [
  {
    icon: Wrench,
    title: "Installation & mise en service",
    text: "Livraison, installation et paramétrage de vos équipements par nos techniciens.",
  },
  {
    icon: CalendarCheck,
    title: "Maintenance préventive",
    text: "Contrat de maintenance incluant 4 visites préventives par an.",
  },
  {
    icon: ShieldCheck,
    title: "Réparation & SAV multi-marques",
    text: "Copieurs, imprimantes, multifonctions, PC et solutions point de vente.",
  },
  {
    icon: PackageCheck,
    title: "Consommables & pièces d'origine",
    text: "Toners, cartouches, rubans et pièces détachées d'origine constructeur.",
  },
];

const orderSteps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ClipboardList,
    title: "Ajoutez vos produits au devis",
    text: "Parcourez le catalogue et ajoutez les références et quantités dont vous avez besoin.",
  },
  {
    icon: Send,
    title: "Envoyez votre demande",
    text: "Transmettez votre sélection en un clic, par WhatsApp ou par email.",
  },
  {
    icon: FileCheck2,
    title: "Recevez votre offre",
    text: "Notre équipe commerciale vous adresse une offre personnalisée.",
  },
];

/** Familles Brother → sous-catégories de l'univers Impression (null = Espace couture). */
const brotherFamilies = [
  { label: "Imprimantes", sub: "imprimantes" },
  { label: "Multifonctions", sub: "multifonctions" },
  { label: "Étiqueteuses P-touch", sub: "etiqueteuses" },
  { label: "Imprimantes mobiles", sub: "imprimantes-mobiles" },
  { label: "Machines à coudre & broder", sub: null },
] as const;

const coutureIcons: LucideIcon[] = [Shirt, Layers, ScanLine, Scissors];

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "POLYTEL — Grossiste matériel informatique & bureautique, distributeur Brother Maroc",
      description:
        "Polytel, importateur grossiste fondé en 1990 à Casablanca et importateur officiel Brother au Maroc : imprimantes, caisses enregistreuses, imprimantes d'étiquettes, informatique et mobilier. 35+ marques d'origine, installation et SAV partout au Maroc.",
      path: "/",
      image: heroProducts[0]?.images[0],
    }),
  component: Home,
});

/* ---------------- Hero ---------------- */

function HeroCard({
  product,
  className,
  depth,
  mx,
  my,
  float,
}: {
  product: Product;
  className?: string;
  depth: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  float: number;
}) {
  const reduced = useReducedMotion();
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={cn("absolute", className)}>
      <motion.div
        {...(reduced ? {} : { animate: { y: [0, -10, 0] } })}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: float }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[0_40px_80px_-30px_oklch(0_0_0/70%)]"
      >
        <ProductVisual
          product={product}
          priority
          width={420}
          height={320}
          className="product-surface aspect-[4/3] w-full"
          imgClassName="p-4 sm:p-5"
        />
        <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2 sm:px-3.5 sm:py-2.5">
          <span className="truncate font-mono text-[10px] text-muted-foreground sm:text-[11px]">
            {product.reference}
          </span>
          <BrandLogo slug={product.brand} size="sm" className="h-3 sm:h-3.5" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const [p0, p1, p2] = heroProducts;
  const enter =
    "animate-in duration-700 fade-in slide-in-from-bottom-4 fill-mode-both motion-reduce:animate-none";

  return (
    <section className="crop-marks relative overflow-hidden bg-ink text-ink-foreground">
      <div
        className="dot-grid pointer-events-none absolute inset-0"
        style={{ maskImage: "radial-gradient(80% 70% at 70% 40%, black, transparent 80%)" }}
        aria-hidden
      />
      {/* Mobile : dégradé léger (pas de gros flou, meilleures perfs) */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "radial-gradient(90% 60% at 85% 75%, color-mix(in oklch, var(--primary) 35%, transparent), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[-20%] right-[-10%] hidden size-[720px] rounded-full bg-primary/45 blur-[140px] md:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-30%] left-[-10%] hidden size-[480px] rounded-full bg-cta/10 blur-[120px] md:block"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="lg:col-span-7">
          <p className="inline-flex animate-in items-center gap-2 rounded-full border border-ink-border bg-white/5 py-1 pr-3 pl-1 text-xs font-medium duration-700 fade-in fill-mode-both motion-reduce:animate-none">
            <span className="rounded-full bg-cta px-2 py-0.5 font-mono text-[10px] font-semibold text-cta-foreground">
              Officiel
            </span>
            Importateur Brother au Maroc
          </p>
          <h1 className={cn("display-xl mt-5 text-balance delay-100 sm:mt-6", enter)}>
            L'équipement professionnel, de l'impression au point de vente.
          </h1>
          <p
            className={cn(
              "mt-5 max-w-xl text-base leading-relaxed text-ink-muted delay-200 sm:mt-6 md:text-lg",
              enter,
            )}
          >
            Fondée en {site.foundedYear}, Polytel importe et distribue plus de 35 marques d'origine
            et assure installation et service après-vente partout au Maroc.
          </p>
          <div className={cn("mt-8 flex flex-col gap-3 delay-300 sm:mt-9 sm:flex-row", enter)}>
            <Button variant="cta" size="xl" asChild>
              <Link to="/produits">
                Explorer le catalogue
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button variant="ghost-dark" size="xl" asChild>
              <Link to="/devis">Demander un devis</Link>
            </Button>
          </div>
          <ul
            className={cn(
              "mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] tracking-wide text-ink-muted delay-300",
              enter,
            )}
          >
            {[`Fondée en ${site.foundedYear}`, "35+ marques", "SAV DAMS Brother"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-cta" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-9 max-w-xl animate-in delay-500 duration-700 fade-in fill-mode-both motion-reduce:animate-none">
            <p className="mb-2.5 font-mono text-[11px] tracking-wider text-ink-muted uppercase">
              Recherche rapide
            </p>
            <SearchBox
              dark
              size="lg"
              placeholder="Rechercher une référence (ex : DCP-T310, TN-2410…)"
            />
          </div>
        </div>

        <div
          className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[440px] lg:col-span-5 lg:max-w-none"
          onPointerMove={onMove}
          onPointerLeave={() => {
            rawX.set(0);
            rawY.set(0);
          }}
          aria-hidden
        >
          <div className="absolute inset-[8%] rounded-[2rem] border border-ink-border bg-ink-card/60" />
          <div className="absolute inset-[8%] overflow-hidden rounded-[2rem]">
            <div className="scan-head" />
          </div>
          {p0 && (
            <HeroCard
              product={p0}
              depth={-14}
              mx={mx}
              my={my}
              float={0}
              className="top-[2%] left-0 z-10 w-[62%] -rotate-3 sm:w-[58%]"
            />
          )}
          {p2 && (
            <HeroCard
              product={p2}
              depth={10}
              mx={mx}
              my={my}
              float={1.2}
              className="top-[16%] right-0 hidden w-[44%] rotate-2 sm:block"
            />
          )}
          {p1 && (
            <HeroCard
              product={p1}
              depth={22}
              mx={mx}
              my={my}
              float={2.2}
              className="right-[4%] bottom-[2%] z-20 w-[56%] rotate-1 sm:right-[14%] sm:w-[52%]"
            />
          )}
          <div className="absolute bottom-[10%] left-[2%] z-30 rounded-xl border border-ink-border bg-ink/90 px-3.5 py-2.5 text-xs shadow-lift">
            <p className="font-mono text-[10px] tracking-wider text-ink-muted uppercase">
              Produits
            </p>
            <p className="mt-0.5 font-semibold text-ink-foreground">100 % d'origine</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Bento des univers ---------------- */

/** Impression et Caisse & POS en grandes tuiles, côte à côte, puis les autres univers. */
const BIG_TILES = ["impression", "caisse-pos"];
const bentoOrder: Category[] = [
  ...BIG_TILES.map((slug) => categories.find((c) => c.slug === slug)).filter(
    (c): c is Category => Boolean(c),
  ),
  ...categories.filter((c) => !BIG_TILES.includes(c.slug)),
];

function UniverseTile({ cat }: { cat: Category }) {
  const big = BIG_TILES.includes(cat.slug);
  const real = realInUniverse(cat.slug);
  const featuredCandidate = cat.featuredProduct ? getProduct(cat.featuredProduct) : undefined;
  const featured = isReal(featuredCandidate) ? featuredCandidate : real[0];
  const count = real.length;

  return (
    <div
      className={cn(
        "card-hairline card-lift group relative flex h-full flex-col overflow-hidden",
        big ? "p-6 md:p-8" : "p-5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-xl bg-blue-tint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
            big ? "size-12" : "size-10",
          )}
        >
          <cat.icon className={big ? "size-6" : "size-5"} aria-hidden />
        </span>
        <ArrowUpRight
          className="size-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
          aria-hidden
        />
      </div>
      <h3 className={cn("font-display font-semibold", big ? "mt-6 text-2xl" : "mt-4 text-base")}>
        <Link
          to="/produits/$univers"
          params={{ univers: cat.slug }}
          className="rounded-sm after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary focus-visible:after:ring-offset-2"
        >
          {cat.name}
        </Link>
      </h3>
      <p className={cn("mt-1.5 text-sm text-muted-foreground", big ? "max-w-sm" : "line-clamp-2")}>
        {cat.blurb}
      </p>
      {cat.subcategories.length > 0 && (
        <ul className="relative z-10 mt-4 flex flex-wrap gap-1.5">
          {cat.subcategories.slice(0, big ? 4 : 3).map((sub) => (
            <li key={sub.slug}>
              <Link
                to="/produits/$univers/$sousCategorie"
                params={{ univers: cat.slug, sousCategorie: sub.slug }}
                className="inline-flex rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground/80 transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                {sub.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {big && featured && (
        <div className="product-surface relative mt-6 flex-1 overflow-hidden rounded-xl border border-border">
          <ProductVisual
            product={featured}
            width={640}
            height={360}
            className="aspect-[16/9] w-full"
            imgClassName="p-6 transition-transform duration-500 group-hover:scale-105"
          />
          <span className="scan-on-hover" aria-hidden />
        </div>
      )}
      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <p className="font-mono text-[11px] text-muted-foreground">
          {count > 0 ? `${count} référence${count > 1 ? "s" : ""}` : "Catalogue sur demande"}
        </p>
        {!big && featured && (
          <div className="product-surface relative size-16 shrink-0 overflow-hidden rounded-lg border border-border">
            <ProductVisual
              product={featured}
              width={64}
              height={64}
              className="size-full"
              imgClassName="p-1.5 transition-transform duration-500 group-hover:scale-110"
            />
            <span className="scan-on-hover" aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Meilleures offres ---------------- */

function BestOffers() {
  const [filter, setFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const universes = useMemo(
    () => categories.filter((c) => bestOffers.some((p) => p.universe === c.slug)),
    [],
  );
  const list = filter ? bestOffers.filter((p) => p.universe === filter) : bestOffers;
  const shown = expanded ? list : list.slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <SectionHeading
        eyebrow="Sélection"
        title="Nos meilleures offres"
        description="Les références les plus demandées par nos clients professionnels."
        action={
          <Link
            to="/produits"
            className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Tout le catalogue
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <div
        className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
        role="group"
        aria-label="Filtrer par univers"
      >
        {[{ slug: null as string | null, name: "Tous" }, ...universes].map((u) => (
          <button
            key={u.slug ?? "all"}
            type="button"
            aria-pressed={filter === u.slug}
            onClick={() => {
              setFilter(u.slug);
              setExpanded(false);
            }}
            className={cn(
              "inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
              filter === u.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/50 hover:text-primary",
            )}
          >
            {u.name}
          </button>
        ))}
      </div>
      <RevealGroup
        key={filter ?? "all"}
        className="mt-8 grid gap-4 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-4"
      >
        {shown.map((p) => (
          <RevealItem key={p.id} className="h-full">
            <ProductCard product={p} />
          </RevealItem>
        ))}
      </RevealGroup>
      {list.length > 8 && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="xl" onClick={() => setExpanded((e) => !e)}>
            {expanded ? "Voir moins" : `Voir plus (${list.length - 8})`}
          </Button>
        </div>
      )}
    </section>
  );
}

/* ---------------- Chiffres (bande sombre) ---------------- */

function Stats() {
  return (
    <section className="crop-marks relative overflow-hidden bg-ink text-ink-foreground">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-px bg-ink-border lg:grid-cols-4">
        <Reveal className="bg-ink px-4 py-12 sm:px-8 md:py-16">
          <p className="eyebrow text-ink-muted">Fondée en</p>
          <p className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">
            {site.foundedYear}
          </p>
          <p className="mt-2 text-sm text-ink-muted">À Casablanca</p>
        </Reveal>
        <Reveal delay={0.06} className="bg-ink px-4 py-12 sm:px-8 md:py-16">
          <p className="eyebrow text-ink-muted">Marques</p>
          <p className="mt-3 font-display text-5xl font-bold tracking-tight text-cta md:text-6xl">
            <CountUp to={35} suffix="+" />
          </p>
          <p className="mt-2 text-sm text-ink-muted">Partenaires d'origine</p>
        </Reveal>
        <Reveal delay={0.12} className="bg-ink px-4 py-12 sm:px-8 md:py-16">
          <p className="eyebrow text-ink-muted">Agences</p>
          <p className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">
            <CountUp to={agencies.length} />
          </p>
          <p className="mt-2 text-sm text-ink-muted">Casablanca & Agadir</p>
        </Reveal>
        <Reveal delay={0.18} className="col-span-2 bg-ink-card px-4 py-10 sm:px-8 lg:col-span-1 lg:py-16">
          <p className="eyebrow text-ink-muted">Couverture nationale</p>
          <ul className="mt-4 space-y-4">
            {agencies.map((a) => (
              <li key={a.city}>
                <p className="font-display font-semibold">{a.city}</p>
                <p className="text-xs text-ink-muted">{a.address}</p>
                <a
                  href={`tel:${a.phone}`}
                  className="link-underline mt-1 inline-flex items-center gap-1.5 font-mono text-sm text-cta"
                >
                  <Phone className="size-3.5" aria-hidden />
                  {a.display}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Comment commander ---------------- */

function HowToOrder() {
  const reduced = useReducedMotion();
  return (
    <section className="border-y border-border bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Commande professionnelle"
          title="Votre devis en 3 étapes"
          description="Une démarche simple, pensée pour les entreprises, revendeurs et administrations."
          align="center"
        />
        <div className="relative mt-14">
          {/* Ligne de liaison (desktop) */}
          <div
            className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-border md:block"
            aria-hidden
          >
            <motion.div
              className="h-full origin-left bg-primary"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <RevealGroup as="ul" className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {orderSteps.map((s, i) => (
              <RevealItem
                as="li"
                key={s.title}
                className="relative flex gap-5 md:flex-col md:items-center md:text-center"
              >
                {/* Ligne verticale (mobile) */}
                {i < orderSteps.length - 1 && (
                  <span
                    className="absolute top-14 bottom-[-2.5rem] left-7 w-px bg-border md:hidden"
                    aria-hidden
                  />
                )}
                <span className="relative z-10 inline-flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-primary shadow-sm">
                  <s.icon className="size-6" aria-hidden />
                  <span className="absolute -top-2 -right-2 inline-flex size-6 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold md:mt-6">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
        <Reveal className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="cta" size="xl" asChild>
            <Link to="/devis">
              Démarrer mon devis
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link to="/connexion">
              <UserPlus aria-hidden />
              Créer un compte pro
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

function Home() {
  const brotherProducts = realProducts.filter((p) => p.brand === "brother");

  return (
    <>
      {/* 1. Hero — ink */}
      <Hero />

      {/* 2. Engagements — card */}
      <section className="border-b border-border bg-card">
        <RevealGroup
          as="ul"
          className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-4 min-[480px]:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:px-8"
        >
          {promises.map((t) => (
            <RevealItem
              as="li"
              key={t.title}
              className="flex items-center gap-4 py-6 lg:px-6 lg:first:pl-0"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-tint text-primary">
                <t.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-display text-[15px] font-semibold">{t.title}</p>
                <p className="text-sm text-muted-foreground">{t.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 3. Univers — bg */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading
          eyebrow="Catalogue"
          title="Dix univers pour équiper toute votre activité"
          description="De l'impression au mobilier, toutes vos références auprès d'un seul partenaire — sélectionnées chez les grandes marques internationales."
          action={
            <Button variant="outline" asChild>
              <Link to="/produits">
                Tout le catalogue
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
        />
        <RevealGroup className="mt-12 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-4">
          {bentoOrder.map((cat) => (
            <RevealItem
              key={cat.slug}
              className={cn("h-full", BIG_TILES.includes(cat.slug) && "min-[480px]:col-span-2")}
            >
              <UniverseTile cat={cat} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 4. Promotions — card */}
      {promoProducts.length > 0 && (
        <section className="border-y border-border bg-card py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Offres du moment"
              title="Promotions professionnelles"
              description="Une sélection d'équipements en promotion — tarifs communiqués sur devis."
              action={
                <Link
                  to="/promotions"
                  className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  Toutes les promotions
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              }
            />
            <Reveal className="mt-6">
              <ProductCarousel products={promoProducts} label="Produits en promotion" />
            </Reveal>
          </div>
        </section>
      )}

      {/* 5. Marques — bg */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Nos marques partenaires"
            title="35+ marques, une seule exigence : l'origine"
            description="Un interlocuteur unique pour une combinaison de fournisseurs de premier plan."
            align="center"
          />
        </div>
        <Reveal className="mt-12">
          <BrandMarquee />
        </Reveal>
        <div className="mt-10 text-center">
          <Link
            to="/marques"
            className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Découvrir toutes nos marques
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* 6. Chiffres — ink */}
      <Stats />

      {/* 7. Brother — bg */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-6">
          <div className="relative grid grid-cols-2 gap-4">
            <div className="card-hairline col-span-2 flex flex-wrap items-center justify-between gap-4 p-6">
              <BrandLogo slug="brother" size="lg" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-tint px-3 py-1 text-xs font-semibold text-primary">
                <BadgeCheck className="size-3.5" aria-hidden />
                Importateur officiel
              </span>
            </div>
            {brotherProducts.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                to="/produit/$slug"
                params={{ slug: p.slug }}
                className="group card-hairline card-lift relative overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <ProductVisual
                  product={p}
                  width={300}
                  height={300}
                  className="product-surface aspect-square w-full"
                  imgClassName="p-5"
                />
                <span className="scan-on-hover" aria-hidden />
                <span className="absolute bottom-2.5 left-3 font-mono text-[11px] text-muted-foreground">
                  {p.reference}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
        <div className="lg:col-span-6 lg:pl-8">
          <SectionHeading
            eyebrow="Partenaire historique"
            title="Brother, notre partenaire historique"
            description="Importateur officiel Brother au Maroc, Polytel distribue l'ensemble de la gamme Brother auprès des entreprises, administrations et revendeurs."
          />
          <Reveal delay={0.08}>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">
                  Distributeur Agréé Maintenance & Services (DAMS) Brother
                </strong>{" "}
                — installation, garantie, réparation et maintenance des produits Brother assurées
                par nos équipes formées.
              </p>
            </div>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {brotherFamilies.map((f) => (
                <li key={f.label}>
                  <Link
                    {...(f.sub
                      ? {
                          to: "/produits/$univers/$sousCategorie" as const,
                          params: { univers: "impression", sousCategorie: f.sub },
                        }
                      : { to: "/espace-couture" as const })}
                    className="group flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    {f.label}
                    <ArrowRight
                      className="size-4 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Button variant="brand" size="xl" asChild className="mt-8">
              <Link to="/marques/$slug" params={{ slug: "brother" }}>
                Découvrir la gamme Brother
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* 8. Meilleures offres — card */}
      <div className="border-t border-border bg-card">
        <BestOffers />
      </div>

      {/* 9. Secteurs — bg */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading
          eyebrow="Solutions par secteur"
          title="Des équipements pensés pour votre métier"
          description="Des ensembles cohérents de matériel, selon les contraintes de chaque activité."
        />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {sectors.map((s, i) => {
            const thumbs = sectorThumbs[i] ?? [];
            return (
              <RevealItem
                key={s.name}
                className={cn(
                  "h-full",
                  i < 3 ? "lg:col-span-2" : "lg:col-span-3",
                  i === sectors.length - 1 && "sm:col-span-2 lg:col-span-3",
                )}
              >
                <Link
                  to={s.to}
                  {...("params" in s ? { params: s.params } : {})}
                  {...("search" in s ? { search: s.search } : {})}
                  className="card-hairline card-lift group relative flex h-full flex-col overflow-hidden p-6 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-tint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <s.icon className="size-5" aria-hidden />
                    </span>
                    {thumbs.length > 0 && (
                      <div className="flex -space-x-3" aria-hidden>
                        {thumbs.map((p) => (
                          <div
                            key={p.id}
                            className="product-surface size-14 overflow-hidden rounded-lg border-2 border-card shadow-sm"
                          >
                            <ProductVisual
                              product={p}
                              width={56}
                              height={56}
                              className="size-full"
                              imgClassName="p-1.5"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.items}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-primary">
                    Voir la sélection
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* 10. Comment commander — card */}
      <HowToOrder />

      {/* 11. Services — ink */}
      <section className="crop-marks relative overflow-hidden bg-ink py-20 text-ink-foreground md:py-28">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            dark
            eyebrow="Services & SAV"
            title="Bien plus qu'un distributeur"
            description="Nos équipes techniques vous accompagnent avant, pendant et après l'achat."
            action={
              <Button variant="cta" size="xl" asChild>
                <Link to="/services">
                  Découvrir nos services
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            }
          />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <RevealItem
                key={s.title}
                className="group relative h-full overflow-hidden rounded-2xl border border-ink-border bg-ink-card p-6 transition-colors hover:border-white/25"
              >
                <p className="font-mono text-[11px] text-ink-muted">0{i + 1}</p>
                <s.icon className="mt-6 size-7 text-cta" aria-hidden />
                <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 12. Espace couture — bg */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 md:pt-28 lg:px-8">
        <Reveal>
          <div className="relative grid overflow-hidden rounded-3xl border border-border bg-warm lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <p className="eyebrow text-warm-foreground">
                <span className="h-px w-6 bg-current opacity-60" aria-hidden />
                Espace couture
              </p>
              <h2 className="display-md mt-3 text-balance">Couture, broderie & découpe créative</h2>
              <p className="mt-4 max-w-md text-muted-foreground">{coutureUniverse.intro}</p>
              <Button variant="cta" size="xl" asChild className="mt-8">
                <Link to="/espace-couture">
                  Découvrir l'espace couture
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
            <ul className="grid grid-cols-2 gap-px border-t border-border bg-border lg:border-t-0 lg:border-l">
              {coutureUniverse.subcategories.slice(0, 4).map((sub, i) => {
                const Icon = coutureIcons[i % coutureIcons.length] ?? Shirt;
                return (
                  <li key={sub.slug} className="bg-warm">
                    <Link
                      to="/produits/$univers/$sousCategorie"
                      params={{ univers: coutureUniverse.slug, sousCategorie: sub.slug }}
                      className="group flex h-full min-h-36 flex-col justify-between p-6 transition-colors hover:bg-card focus-visible:bg-card focus-visible:outline-none"
                    >
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-card text-warm-foreground transition-colors group-hover:bg-warm">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="mt-6 flex items-end justify-between gap-2 font-display font-semibold">
                        {sub.name}
                        <ArrowUpRight
                          className="size-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* 13. CTA final */}
      <CtaBand />
    </>
  );
}