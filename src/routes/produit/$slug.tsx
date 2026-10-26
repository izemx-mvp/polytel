import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Cpu,
  Download,
  FileText,
  Gauge,
  Headphones,
  Layers,
  Maximize2,
  Palette,
  PackageCheck,
  Phone,
  Printer,
  ScanLine,
  ShieldCheck,
  Truck,
  Wifi,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductVisual } from "@/components/site/product-visual";
import { ProductBadges } from "@/components/site/badges";
import { BrandLogo } from "@/components/site/brand-logo";
import { LockedPrice } from "@/components/site/locked-price";
import { AddToQuoteButton, ProductMini } from "@/components/site/product-card";
import { ProductCarousel } from "@/components/site/product-carousel";
import { WhatsAppIcon } from "@/components/site/icons";
import {
  Breadcrumbs,
  CtaBand,
  QuantityStepper,
  SectionHeading,
  type Crumb,
} from "@/components/site/layout-primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import {
  brandName,
  compatibleConsumables,
  compatibleDevices,
  frequentlyTogether,
  getProduct,
  SAMPLE_FLAG,
  similarProducts,
  subcategoryName,
  universeName,
  type Product,
} from "@/data/products";
import { getCategory } from "@/data/categories";
import { getBrand } from "@/data/brands";
import { downloads } from "@/data/downloads";
import { buildWhatsAppLink, site } from "@/config/site";
import { breadcrumbLd, jsonLdScript, pageHead, productLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return {
      slug: p.slug,
      name: p.name,
      reference: p.reference,
      description: p.shortDescription,
      image: p.images[0],
      universe: p.universe,
      universeName: universeName(p),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const product = getProduct(loaderData.slug);
    if (!product) return {};
    return {
      ...pageHead({
        title: `${loaderData.name} — ${loaderData.reference} | Polytel Maroc`,
        description:
          `${loaderData.name} (réf. ${loaderData.reference}) chez Polytel, importateur et distributeur au Maroc. ${loaderData.description.replace(SAMPLE_FLAG, "").trim()}`.slice(
            0,
            300,
          ),
        path: `/produit/${loaderData.slug}`,
        image: loaderData.image,
        type: "product",
        noindex: Boolean(product.placeholder),
      }),
      scripts: [
        jsonLdScript(productLd(product)),
        jsonLdScript(
          breadcrumbLd([
            { name: "Accueil", path: "/" },
            { name: "Produits", path: "/produits" },
            { name: loaderData.universeName, path: `/produits/${loaderData.universe}` },
            { name: loaderData.name, path: `/produit/${loaderData.slug}` },
          ]),
        ),
      ],
    };
  },
  component: ProductPage,
});

/* ---------------- Galerie ---------------- */

function Gallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const count = Math.max(product.images.length, 1);
  const hasImage = product.images.length > 0;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  const onLightboxKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (count < 2) return;
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => hasImage && setLightbox(true)}
        onMouseMove={hasImage ? onMove : undefined}
        onMouseLeave={() => setZoom(null)}
        className={cn(
          "group card-hairline product-surface relative block aspect-square w-full overflow-hidden",
          hasImage ? "cursor-zoom-in" : "cursor-default",
        )}
        aria-label={hasImage ? `Agrandir l'image de ${product.name}` : undefined}
        disabled={!hasImage}
      >
        <ProductVisual
          product={product}
          index={index}
          priority
          width={800}
          height={800}
          className="h-full w-full"
          imgClassName="p-10 transition-transform duration-200 ease-out"
        />
        {zoom && hasImage && (
          <span
            className="pointer-events-none absolute inset-0 hidden bg-card bg-no-repeat md:block"
            style={{
              backgroundImage: `url(${product.images[index]})`,
              backgroundSize: "200%",
              backgroundPosition: `${zoom.x}% ${zoom.y}%`,
            }}
            aria-hidden
          />
        )}
        <span className="scan-on-hover" aria-hidden />
        <ProductBadges badges={product.badges} className="absolute top-4 left-4" />
        <span className="absolute top-4 right-4 rounded-full border border-border bg-card/90 px-2.5 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur">
          {product.reference}
        </span>
        {hasImage && (
          <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow-soft backdrop-blur">
            <Maximize2 className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">Survoler pour zoomer</span>
          </span>
        )}
        {count > 1 && (
          <span className="absolute bottom-4 left-4 rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[11px] text-ink-foreground">
            {index + 1} / {count}
          </span>
        )}
      </button>

      {count > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-3" aria-label="Miniatures">
          {product.images.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Image ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "product-surface block aspect-square w-full overflow-hidden rounded-lg border-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  i === index ? "border-primary" : "border-border hover:border-primary/40",
                )}
              >
                <ProductVisual product={product} index={i} compact className="h-full" imgClassName="p-2" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-[min(92vw,1100px)] p-0" onKeyDown={onLightboxKey}>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <DialogDescription className="sr-only">Réf. {product.reference}</DialogDescription>
          <div className="product-surface relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <ProductVisual
              product={product}
              index={index}
              width={1200}
              height={900}
              className="h-full w-full"
              imgClassName="p-8"
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute top-1/2 left-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card shadow-soft"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute top-1/2 right-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card shadow-soft"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="size-5" aria-hidden />
                </button>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-3 py-1 font-mono text-xs text-ink-foreground">
                  {index + 1} / {count}
                </span>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- Caractéristiques ---------------- */

const specIcons: [RegExp, LucideIcon][] = [
  [/technolog/i, Printer],
  [/fonction/i, Layers],
  [/résolution|numérisation/i, ScanLine],
  [/vitesse/i, Gauge],
  [/connect|wi-fi/i, Wifi],
  [/format|bac/i, FileText],
  [/couleur/i, Palette],
];

const iconFor = (label: string) => specIcons.find(([re]) => re.test(label))?.[1] ?? Cpu;

function NoData({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Button variant="outline" asChild className="mt-4">
        <Link to="/contact">Demander l'information à un conseiller</Link>
      </Button>
    </div>
  );
}

function CopyRef({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          toast.success("Référence copiée", { description: value });
          window.setTimeout(() => setDone(false), 1800);
        } catch {
          toast.error("Copie impossible");
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-xs transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      aria-label={`Copier la référence ${value}`}
    >
      {value}
      {done ? <Check className="size-3 text-primary" aria-hidden /> : <Copy className="size-3" aria-hidden />}
    </button>
  );
}

/* ---------------- Page ---------------- */

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  const [qty, setQty] = useState(1);
  if (!product) return null;

  const universe = getCategory(product.universe);
  const sub = subcategoryName(product);
  const brand = getBrand(product.brand);
  const isBrother = product.brand === "brother";
  const similar = similarProducts(product, 10);
  const together = frequentlyTogether(product);
  const isConsumable = product.subcategory === "consommables";
  const consumables = isConsumable ? compatibleDevices(product) : compatibleConsumables(product);
  const docs = downloads.filter((d) => d.reference && d.reference === product.reference);
  const docCount = docs.filter((d) => d.url !== product.datasheetUrl).length + (product.datasheetUrl ? 1 : 0);
  const waMessage = `Bonjour Polytel, je souhaite un devis pour ${product.name} — Réf. ${product.reference} (quantité : ${qty}).`;

  const couture = product.universe === "espace-couture";
  const crumbs: Crumb[] = [
    { label: "Accueil", to: "/" },
    couture
      ? { label: "Espace couture", to: "/espace-couture" }
      : { label: "Produits", to: "/produits" },
    ...(universe && !couture
      ? [{ label: universe.name, to: "/produits/$univers", params: { univers: universe.slug } }]
      : []),
    ...(universe && product.subcategory && sub
      ? [
          {
            label: sub,
            to: "/produits/$univers/$sousCategorie",
            params: { univers: universe.slug, sousCategorie: product.subcategory },
          },
        ]
      : []),
    { label: product.name },
  ];

  const reassurance = [
    { icon: BadgeCheck, text: "Produit 100 % d'origine" },
    { icon: ShieldCheck, text: isBrother ? "Garantie Brother — distributeur agréé DAMS" : "Garantie constructeur" },
    { icon: Wrench, text: "Installation & SAV assurés par Polytel" },
  ];

  const tabs: [string, string, number | undefined][] = [
    ["description", "Description", undefined],
    ["specs", "Caractéristiques", product.specs.length || undefined],
    ["consommables", isConsumable ? "Appareils compatibles" : "Consommables", consumables.length || undefined],
    ["documents", "Documents", docCount || undefined],
  ];

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      {product.placeholder && (
        <div className="border-b border-border bg-warm">
          <p className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 text-sm text-warm-foreground sm:px-6 lg:px-8">
            <AlertTriangle className="size-4 shrink-0" aria-hidden />
            Fiche exemple — contenu à remplacer. Demandez la référence exacte à nos conseillers.
          </p>
        </div>
      )}

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-36">
            <Gallery product={product} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex h-8 items-center justify-between gap-3">
            {brand ? (
              <Link
                to="/marques/$slug"
                params={{ slug: brand.slug }}
                aria-label={`Marque ${brand.name}`}
                className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <BrandLogo slug={product.brand} />
              </Link>
            ) : (
              <BrandLogo slug={product.brand} />
            )}
            {isBrother && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-tint px-2.5 py-1 text-[11px] font-semibold text-primary">
                <BadgeCheck className="size-3.5" aria-hidden />
                Importateur officiel
              </span>
            )}
          </div>
          <h1 className="display-md mt-4 text-balance">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Réf.</span>
            <CopyRef value={product.reference} />
            {universe && (
              <>
                <span aria-hidden>·</span>
                <span>{universe.name}</span>
              </>
            )}
          </div>
          <ProductBadges badges={product.badges} className="mt-4" />
          <p className="mt-5 leading-relaxed text-muted-foreground">{product.shortDescription}</p>

          {product.specs.length > 0 && (
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {product.specs.slice(0, 6).map((s) => {
                const Icon = iconFor(s.label);
                return (
                  <li key={s.label} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                    <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span className="min-w-0">
                      <span className="block text-[11px] text-muted-foreground">{s.label}</span>
                      <span className="block text-sm font-medium">{s.value}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Bloc demande */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="p-5">
              <LockedPrice priceHT={product.priceHT} variant="full" />
              <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="size-3.5 text-primary" aria-hidden />
                Disponibilité et délai confirmés sur devis
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <QuantityStepper value={qty} onChange={setQty} label={product.name} />
                <AddToQuoteButton product={product} qty={qty} size="xl" className="flex-1" />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Button variant="outline" size="xl" asChild className={cn(!product.datasheetUrl && "sm:col-span-2")}>
                  <a href={buildWhatsAppLink(waMessage)} target="_blank" rel="noreferrer">
                    <WhatsAppIcon className="text-whatsapp" aria-hidden />
                    Demander sur WhatsApp
                  </a>
                </Button>
                {product.datasheetUrl && (
                  <Button variant="outline" size="xl" asChild>
                    <a href={product.datasheetUrl} target="_blank" rel="noreferrer">
                      <Download aria-hidden />
                      Fiche technique
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <ul className="space-y-2.5 border-t border-border bg-background/60 px-5 py-4 text-sm">
              {reassurance.map((r) => (
                <li key={r.text} className="flex items-center gap-3">
                  <r.icon className="size-4 shrink-0 text-success" aria-hidden />
                  {r.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Conseiller */}
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border p-4">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-tint text-primary">
              <Headphones className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Une question sur ce produit ?</p>
              <p className="text-xs text-muted-foreground">Nos conseillers vous répondent.</p>
            </div>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-mono text-xs transition-colors hover:border-primary hover:text-primary"
            >
              <Phone className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">{site.phone}</span>
              <span className="sm:hidden">Appeler</span>
            </a>
          </div>

          {/* Liens rapides */}
          <div className="mt-6 flex flex-wrap gap-2">
            {brand && (
              <Link
                to="/marques/$slug"
                params={{ slug: brand.slug }}
                className="inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                Tout {brand.name}
                <ArrowUpRight className="size-3" aria-hidden />
              </Link>
            )}
            {universe && !couture && (
              <Link
                to="/produits/$univers"
                params={{ univers: universe.slug }}
                className="inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                Univers {universe.name}
                <ArrowUpRight className="size-3" aria-hidden />
              </Link>
            )}
            {couture && (
              <Link
                to="/espace-couture"
                className="inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                Espace couture
                <ArrowUpRight className="size-3" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Onglets */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <Tabs defaultValue="description">
            <TabsList className="no-scrollbar h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl bg-muted p-1">
              {tabs.map(([v, l, n]) => (
                <TabsTrigger
                  key={v}
                  value={v}
                  className="shrink-0 gap-2 rounded-lg px-4 py-2 text-sm data-[state=active]:bg-card data-[state=active]:shadow-soft"
                >
                  {l}
                  {n !== undefined && (
                    <span className="rounded-full bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
                      {n}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="leading-relaxed text-muted-foreground">
                    {product.description ?? product.shortDescription}
                  </p>
                  <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary" aria-hidden />
                      Marque : {brandName(product)}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary" aria-hidden />
                      Univers : {universeName(product)}
                    </li>
                    {sub && (
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-primary" aria-hidden />
                        Rubrique : {sub}
                      </li>
                    )}
                    {product.type && (
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-primary" aria-hidden />
                        Type : {product.type}
                      </li>
                    )}
                  </ul>
                </div>
                <aside className="rounded-2xl border border-border bg-background p-6 lg:col-span-5">
                  <p className="eyebrow text-muted-foreground">Les + Polytel</p>
                  <ul className="mt-4 space-y-4">
                    {[
                      { icon: PackageCheck, t: "Circuit officiel", d: "Produits d'origine, issus des marques que nous distribuons." },
                      { icon: Wrench, t: "Installation sur site", d: "Livraison, paramétrage et prise en main par nos techniciens." },
                      { icon: ShieldCheck, t: "SAV multi-marques", d: "Maintenance, réparation et consommables d'origine." },
                    ].map((x) => (
                      <li key={x.t} className="flex gap-3">
                        <x.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                        <span>
                          <span className="block text-sm font-semibold">{x.t}</span>
                          <span className="block text-sm text-muted-foreground">{x.d}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-8">
              {product.specs.length > 0 ? (
                <dl className="grid overflow-hidden rounded-xl border border-border md:grid-cols-2">
                  {product.specs.map((s) => (
                    <div
                      key={s.label}
                      className="grid grid-cols-[1fr_1.3fr] gap-4 border-b border-border px-5 py-3.5 text-sm odd:bg-muted/40 md:[&:nth-last-child(-n+2)]:border-b-0"
                    >
                      <dt className="text-muted-foreground">{s.label}</dt>
                      <dd className="font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <NoData text={`Caractéristiques techniques détaillées disponibles sur demande. ${SAMPLE_FLAG}.`} />
              )}
            </TabsContent>

            <TabsContent value="consommables" className="mt-8">
              {consumables.length > 0 ? (
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {consumables.map((c) => (
                    <li key={c.id} className="rounded-xl border border-border bg-background transition-colors hover:border-primary/40">
                      <ProductMini product={c} />
                    </li>
                  ))}
                </ul>
              ) : (
                <NoData text="Aucune compatibilité référencée en ligne pour ce produit. Nos conseillers vous indiquent les consommables d'origine adaptés." />
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-8">
              {product.datasheetUrl || docs.length > 0 ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {product.datasheetUrl && (
                    <li>
                      <a
                        href={product.datasheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary"
                      >
                        <FileText className="size-5 text-primary" aria-hidden />
                        <span className="flex-1 text-sm font-medium">Fiche technique constructeur</span>
                        <Download className="size-4 text-muted-foreground" aria-hidden />
                      </a>
                    </li>
                  )}
                  {docs
                    .filter((d) => d.url !== product.datasheetUrl)
                    .map((d) => (
                      <li key={d.id}>
                        <Link
                          to="/catalogues"
                          search={{ onglet: "telechargements", q: product.reference }}
                          className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary"
                        >
                          <PackageCheck className="size-5 text-primary" aria-hidden />
                          <span className="flex-1 text-sm font-medium">{d.title}</span>
                          <span className="font-mono text-[11px] text-muted-foreground">{d.kind}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              ) : (
                <NoData text="Pas encore de document en ligne pour ce produit. Fiches techniques et pilotes disponibles sur simple demande." />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Engagements */}
      <section className="crop-marks relative overflow-hidden bg-ink text-ink-foreground">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <RevealGroup
          as="ul"
          className="relative mx-auto grid max-w-7xl grid-cols-2 gap-px bg-ink-border lg:grid-cols-4"
        >
          {[
            { icon: BadgeCheck, t: "100 % d'origine", d: "Circuit officiel" },
            { icon: ShieldCheck, t: "Garantie", d: isBrother ? "Brother · DAMS" : "Constructeur" },
            { icon: Wrench, t: "Installation", d: "Par nos techniciens" },
            { icon: Headphones, t: "Assistance", d: "5j/7 par téléphone" },
          ].map((x) => (
            <RevealItem as="li" key={x.t} className="bg-ink px-4 py-8 sm:px-8">
              <x.icon className="size-6 text-cta" aria-hidden />
              <p className="mt-4 font-display font-semibold">{x.t}</p>
              <p className="text-sm text-ink-muted">{x.d}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Produits similaires */}
      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 md:pt-28 lg:px-8">
          <SectionHeading eyebrow="À découvrir" title="Produits similaires" />
          <Reveal className="mt-4">
            <ProductCarousel products={similar} label="Produits similaires" />
          </Reveal>
        </section>
      )}

      {together.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Compléter votre demande" title="Souvent demandés ensemble" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {together.map((p) => (
              <li key={p.id} className="card-hairline p-2">
                <ProductMini product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBand
        title="Besoin de plusieurs références ou d'une installation ?"
        description="Ajoutez vos produits à la demande de devis : un conseiller vous répond avec une offre globale, installation et SAV inclus sur demande."
      />

      {/* Espace pour la barre mobile */}
      <div className="h-24 md:hidden" aria-hidden />

      {/* Barre mobile collante */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="mb-2 flex items-center gap-2 px-1">
          <p className="min-w-0 flex-1 truncate text-xs font-medium">{product.name}</p>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{product.reference}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="xl" asChild className="px-4">
            <a href={buildWhatsAppLink(waMessage)} target="_blank" rel="noreferrer" aria-label="Demander sur WhatsApp">
              <WhatsAppIcon className="text-whatsapp" aria-hidden />
            </a>
          </Button>
          <AddToQuoteButton product={product} qty={qty} size="xl" className="flex-1" />
        </div>
      </div>
    </>
  );
}