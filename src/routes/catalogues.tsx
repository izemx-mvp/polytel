import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Download,
  ExternalLink,
  FileQuestion,
  FileSpreadsheet,
  FileText,
  Lock,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/site/layout-primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { ProductVisual } from "@/components/site/product-visual";
import { BrandLogo } from "@/components/site/brand-logo";
import { WhatsAppIcon } from "@/components/site/icons";
import { downloads, eCatalogues, type DownloadKind } from "@/data/downloads";
import { getBrandName } from "@/data/brands";
import { getProduct } from "@/data/products";
import { buildWhatsAppLink } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Tab = "e-catalogues" | "telechargements";
type SearchParams = { onglet?: Tab; q?: string };

export const Route = createFileRoute("/catalogues")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    ...(s["onglet"] === "telechargements" ? { onglet: "telechargements" as const } : {}),
    ...(typeof s["q"] === "string" && s["q"].trim() ? { q: s["q"] } : {}),
  }),
  head: () =>
    pageHead({
      title: "E-catalogues & téléchargements — pilotes, fiches techniques | Polytel",
      description:
        "Consultez les e-catalogues Polytel par marque et téléchargez pilotes, fiches techniques et documents produits : Brother, Sharp, Zebra, Evolis…",
      path: "/catalogues",
    }),
  component: CataloguesPage,
});

/* ---------------- Données ---------------- */

const kinds: (DownloadKind | "Tous")[] = ["Tous", "Pilote", "Fiche technique", "Tarif"];
const brandLabel = (slug: string) => (slug === "polytel" ? "Polytel" : getBrandName(slug));
const catalogueBrands = [...new Set(eCatalogues.map((c) => c.brand))];
const docBrands = new Set(downloads.map((d) => d.brand));

const matchesQuery = (d: (typeof downloads)[number], n: string) =>
  !n || [d.title, d.reference ?? "", brandLabel(d.brand)].join(" ").toLowerCase().includes(n);

const kindIcon = (k: DownloadKind) =>
  k === "Tarif" ? Lock : k === "Pilote" ? Download : k === "Fiche technique" ? FileText : FileSpreadsheet;

/* ---------------- Couverture façon brochure ---------------- */

function BrochureCover({ c }: { c: (typeof eCatalogues)[number] }) {
  const cover = c.coverProductSlug ? getProduct(c.coverProductSlug) : undefined;
  const hasImage = Boolean(cover?.images?.[0]);

  return (
    <div className="relative mx-auto w-[78%] [perspective:1200px]">
      {/* Pages (tranche) */}
      <div className="absolute inset-y-2 right-[-10px] w-3 rounded-r-md bg-[repeating-linear-gradient(90deg,var(--card)_0_2px,var(--border)_2px_3px)] shadow-sm" aria-hidden />
      <div
        className="relative aspect-[3/4] origin-left overflow-hidden rounded-r-lg rounded-l-sm border border-border bg-card shadow-[0_30px_60px_-30px_oklch(0_0_0/45%)] transition-transform duration-500 ease-out group-hover:[transform:rotateY(-14deg)] motion-reduce:transition-none"
      >
        {/* Dos (reliure) */}
        <div className="absolute inset-y-0 left-0 z-10 w-3 bg-gradient-to-r from-black/20 to-transparent" aria-hidden />
        {/* Bandeau marque */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <BrandLogo slug={c.brand} size="sm" className="max-h-4" />
          <span className="font-mono text-[10px] text-muted-foreground">{c.year}</span>
        </div>
        <div className="product-surface relative h-[58%]">
          {cover && hasImage ? (
            <ProductVisual product={cover} className="size-full" imgClassName="p-6" />
          ) : (
            <div className="flex size-full items-center justify-center">
              <BookOpen className="size-10 text-primary/40" aria-hidden />
            </div>
          )}
          <span className="scan-on-hover" aria-hidden />
        </div>
        <div className="p-4">
          <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
            Catalogue
          </p>
          <p className="mt-1 line-clamp-2 font-display text-sm leading-tight font-semibold">
            {c.title}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-primary" aria-hidden />
      </div>
    </div>
  );
}

/* ---------------- E-catalogues ---------------- */

function ECatalogues() {
  const [brand, setBrand] = useState<string | null>(null);
  const list = brand ? eCatalogues.filter((c) => c.brand === brand) : eCatalogues;

  return (
    <div>
      {catalogueBrands.length > 1 && (
        <div
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
          role="group"
          aria-label="Filtrer les catalogues par marque"
        >
          {[null, ...catalogueBrands].map((b) => (
            <button
              key={b ?? "all"}
              type="button"
              aria-pressed={brand === b}
              onClick={() => setBrand(b)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                brand === b
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50 hover:text-primary",
              )}
            >
              {b ? brandLabel(b) : "Toutes les marques"}
            </button>
          ))}
        </div>
      )}

      <RevealGroup
        key={brand ?? "all"}
        className="mt-10 grid gap-x-6 gap-y-12 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {list.map((c) => (
          <RevealItem key={c.id} as="article" className="group flex flex-col">
            <BrochureCover c={c} />
            <div className="mt-6 flex flex-1 flex-col px-1">
              <h2 className="font-display font-semibold">{c.title}</h2>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {brandLabel(c.brand)} · Édition {c.year} · {c.pages} pages
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.url ? (
                  <>
                    <Button variant="brand" size="sm" asChild>
                      <a href={c.url} target="_blank" rel="noreferrer">
                        <ExternalLink aria-hidden />
                        Consulter
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={c.url} download>
                        <Download aria-hidden />
                        PDF
                      </a>
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={buildWhatsAppLink(`Bonjour Polytel, je souhaite recevoir le catalogue « ${c.title} » (PDF).`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WhatsAppIcon className="text-whatsapp" aria-hidden />
                      Recevoir le PDF
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      <p className="mt-10 text-xs text-muted-foreground">
        Brochures PDF À CONFIRMER — CONTENU EXEMPLE À REMPLACER par les e-catalogues réels.
      </p>
    </div>
  );
}

/* ---------------- Téléchargements ---------------- */

function Downloads({ initialQuery }: { initialQuery: string }) {
  const [q, setQ] = useState(initialQuery);
  const [kind, setKind] = useState<(typeof kinds)[number]>("Tous");

  const n = q.trim().toLowerCase();
  const byQuery = useMemo(() => downloads.filter((d) => matchesQuery(d, n)), [n]);
  const list = kind === "Tous" ? byQuery : byQuery.filter((d) => d.kind === kind);
  const countFor = (k: (typeof kinds)[number]) =>
    k === "Tous" ? byQuery.length : byQuery.filter((d) => d.kind === k).length;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Filtres */}
      <aside className="lg:col-span-3">
        <div className="lg:sticky lg:top-32">
          <div className="relative">
            <label htmlFor="dl-search" className="sr-only">
              Rechercher un document
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              id="dl-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Référence, marque…"
              className="h-11 w-full rounded-xl border border-input bg-card pr-9 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute top-1/2 right-2.5 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Effacer la recherche"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <p className="eyebrow mt-6 mb-3 text-muted-foreground">Type de document</p>
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1" role="group" aria-label="Type de document">
            {kinds.map((k) => {
              const active = kind === k;
              return (
                <li key={k}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setKind(k)}
                    className={cn(
                      "flex h-10 w-full items-center justify-between gap-3 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                      active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    {k}
                    <span
                      className={cn(
                        "font-mono text-[11px]",
                        active ? "text-primary-foreground/80" : "text-muted-foreground",
                      )}
                    >
                      {countFor(k)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 hidden rounded-xl border border-border bg-card p-4 lg:block">
            <Lock className="size-4 text-primary" aria-hidden />
            <p className="mt-2 text-sm font-semibold">Tarifs professionnels</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Réservés aux comptes professionnels validés.
            </p>
            <Link to="/connexion" className="link-underline mt-3 inline-flex text-xs font-semibold text-primary">
              Accéder à l'espace pro
            </Link>
          </div>
        </div>
      </aside>

      {/* Liste */}
      <div className="lg:col-span-9">
        <p className="font-mono text-[11px] text-muted-foreground" aria-live="polite">
          {list.length} document{list.length > 1 ? "s" : ""}
          {n && ` pour « ${q.trim()} »`}
        </p>
        {list.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center">
            <FileQuestion className="mx-auto size-8 text-muted-foreground" aria-hidden />
            <p className="mt-4 font-display font-semibold">Aucun document trouvé</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nous pouvons vous transmettre le pilote ou la fiche technique recherchée.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={buildWhatsAppLink(`Bonjour Polytel, je recherche un document : ${q.trim() || "…"}`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon className="text-whatsapp" aria-hidden />
                  Demander sur WhatsApp
                </a>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setQ(""); setKind("Tous"); }}>
                Réinitialiser
              </Button>
            </div>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {list.map((d) => {
              const Icon = kindIcon(d.kind);
              return (
                <li
                  key={d.id}
                  className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-background sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <span className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-tint text-primary">
                      <Icon className="size-4" aria-hidden />
                      <span className="absolute -right-1.5 -bottom-1.5 rounded bg-ink px-1 font-mono text-[8px] font-semibold text-ink-foreground uppercase">
                        {d.format}
                      </span>
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{d.title}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                        <span>{d.kind}</span>
                        <span aria-hidden>·</span>
                        <span>{brandLabel(d.brand)}</span>
                        {d.reference && (
                          <>
                            <span aria-hidden>·</span>
                            <span className="font-mono">{d.reference}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 sm:pl-4">
                    {d.url ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={d.url} target="_blank" rel="noreferrer">
                          <Download aria-hidden />
                          Télécharger
                        </a>
                      </Button>
                    ) : d.kind === "Tarif" ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/connexion">
                          <Lock aria-hidden />
                          Espace pro
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={buildWhatsAppLink(`Bonjour Polytel, je souhaite recevoir : ${d.title}${d.reference ? ` (${d.reference})` : ""}.`)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Sur demande
                          <ArrowRight aria-hidden />
                        </a>
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Liste de démonstration — CONTENU EXEMPLE À REMPLACER par les fichiers réels.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

function CataloguesPage() {
  const { onglet, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogues" });
  const tab: Tab = onglet ?? "e-catalogues";
  const [heroQ, setHeroQ] = useState(q ?? "");

  const onHeroSearch = (e: FormEvent) => {
    e.preventDefault();
    const value = heroQ.trim();
    void navigate({
      search: { onglet: "telechargements", ...(value ? { q: value } : {}) },
      replace: true,
      resetScroll: false,
    }).then(() =>
      document.getElementById("documentation")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <>
      <PageHero
        crumbs={[{ label: "Accueil", to: "/" }, { label: "E-catalogues & téléchargements" }]}
        eyebrow="Documentation"
        title="E-catalogues & téléchargements"
        description="Brochures par marque, pilotes, fiches techniques et documents commerciaux : toute la documentation de vos équipements, au même endroit."
      >
        <form onSubmit={onHeroSearch} className="mt-8 flex max-w-xl flex-col gap-2 sm:flex-row" role="search">
          <div className="relative flex-1">
            <label htmlFor="hero-doc-search" className="sr-only">
              Rechercher un pilote ou une fiche technique
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
            <input
              id="hero-doc-search"
              type="search"
              value={heroQ}
              onChange={(e) => setHeroQ(e.target.value)}
              placeholder="Pilote ou fiche : DCP-T310, TN-2410…"
              className="h-12 w-full rounded-xl border border-ink-border bg-white/5 pr-4 pl-11 text-sm text-ink-foreground placeholder:text-ink-muted outline-none focus-visible:ring-2 focus-visible:ring-cta"
            />
          </div>
          <Button type="submit" variant="cta" size="xl">
            Rechercher
          </Button>
        </form>
        <dl className="mt-8 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-ink-border bg-ink-border">
          {[
            { k: "E-catalogues", v: eCatalogues.length },
            { k: "Documents", v: downloads.length },
            { k: "Marques", v: new Set([...catalogueBrands, ...docBrands]).size },
          ].map((s) => (
            <div key={s.k} className="bg-ink-card px-4 py-3.5">
              <dt className="font-mono text-[10px] tracking-wider text-ink-muted uppercase">{s.k}</dt>
              <dd className="mt-1 font-display text-2xl font-bold">{s.v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section id="documentation" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <Tabs
          value={tab}
          onValueChange={(v) =>
            void navigate({
              search: v === "telechargements" ? { onglet: "telechargements" } : {},
              replace: true,
              resetScroll: false,
            })
          }
        >
          <TabsList className="h-auto w-full rounded-xl bg-muted p-1 sm:w-auto">
            <TabsTrigger
              value="e-catalogues"
              className="flex-1 rounded-lg px-5 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-soft sm:flex-none"
            >
              <BookOpen className="size-4" aria-hidden />
              E-catalogues
              <span className="ml-1 font-mono text-[11px] text-muted-foreground">{eCatalogues.length}</span>
            </TabsTrigger>
            <TabsTrigger
              value="telechargements"
              className="flex-1 rounded-lg px-5 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-soft sm:flex-none"
            >
              <Download className="size-4" aria-hidden />
              Téléchargements
              <span className="ml-1 font-mono text-[11px] text-muted-foreground">{downloads.length}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="e-catalogues" className="mt-10">
            <ECatalogues />
          </TabsContent>

          <TabsContent value="telechargements" className="mt-10">
            <Downloads key={q ?? ""} initialQuery={q ?? ""} />
          </TabsContent>
        </Tabs>
      </section>

      {/* Aide */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <Reveal>
          <div className="crop-marks relative grid overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground sm:p-10 md:grid-cols-12 md:items-center md:gap-8">
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
            <div className="relative md:col-span-7">
              <p className="font-mono text-[11px] tracking-wider text-ink-muted uppercase">Support documentation</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-balance sm:text-3xl">
                Un pilote, une notice ou une fiche introuvable ?
              </h2>
              <p className="mt-3 max-w-lg text-sm text-ink-muted">
                Indiquez la référence de votre équipement : notre équipe vous transmet le document
                ou vous accompagne pour l'installation.
              </p>
            </div>
            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row md:col-span-5 md:mt-0 md:justify-end">
              <Button variant="cta" size="lg" asChild>
                <a
                  href={buildWhatsAppLink("Bonjour Polytel, je recherche un document pour la référence : …")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon aria-hidden />
                  WhatsApp
                </a>
              </Button>
              <Button variant="ghost-dark" size="lg" asChild>
                <Link to="/services">Services & SAV</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}