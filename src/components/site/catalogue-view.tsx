import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutGrid, List, ListFilter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { ProductCard } from "@/components/site/product-card";
import { Breadcrumbs, EmptyState, type Crumb } from "@/components/site/layout-primitives";
import { RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import {
  attributeLabels,
  categories,
  universesWithAttributes,
  type Category,
  type SubCategory,
} from "@/data/categories";
import { getBrandName } from "@/data/brands";
import type { Product } from "@/data/products";
import {
  applyFilters,
  countBy,
  sortOptions,
  sortProducts,
  splitList,
  toggleInList,
  type CatalogueSearch,
} from "@/lib/catalogue-search";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;

/* ---------------- En-tête de catalogue ---------------- */

export function CatalogueHeader({
  crumbs,
  eyebrow,
  title,
  intro,
  universe,
  activeSub,
  tone = "light",
  children,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  intro: ReactNode;
  universe?: Category | undefined;
  activeSub?: string | undefined;
  tone?: "light" | "dark" | "warm";
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b",
        dark && "crop-marks border-ink-border bg-ink text-ink-foreground",
        tone === "light" && "border-border bg-card",
        tone === "warm" && "border-border bg-warm",
      )}
    >
      <div
        className={cn("pointer-events-none absolute inset-0", dark ? "dot-grid" : "dot-grid-light")}
        style={{ maskImage: "radial-gradient(60% 100% at 90% 0%, black, transparent 70%)" }}
        aria-hidden
      />
      {dark && (
        <div
          className="pointer-events-none absolute -top-48 right-0 size-[520px] rounded-full bg-primary/40 blur-[120px]"
          aria-hidden
        />
      )}
      <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 md:pt-10 md:pb-14 lg:px-8">
        <Breadcrumbs items={crumbs} dark={dark} />
        <div className="mt-8 max-w-3xl">
          <p
            className={cn("eyebrow", dark && "text-cta", tone === "warm" && "text-warm-foreground")}
          >
            <span className="h-px w-6 bg-current opacity-60" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="display-lg mt-3 text-balance">{title}</h1>
          <p
            className={cn(
              "mt-4 text-base leading-relaxed md:text-lg",
              dark ? "text-ink-muted" : "text-muted-foreground",
            )}
          >
            {intro}
          </p>
        </div>
        {universe && universe.subcategories.length > 0 && (
          <ul className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            <li className="shrink-0">
              <Link
                to="/produits/$univers"
                params={{ univers: universe.slug }}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                  !activeSub
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50 hover:text-primary",
                )}
              >
                Tout
              </Link>
            </li>
            {universe.subcategories.map((sub) => (
              <li key={sub.slug} className="shrink-0">
                <Link
                  to="/produits/$univers/$sousCategorie"
                  params={{ univers: universe.slug, sousCategorie: sub.slug }}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors",
                    activeSub === sub.slug
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary",
                  )}
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </section>
  );
}

/* ---------------- Facette (liste de cases à cocher) ---------------- */

function Facet({
  prefix,
  title,
  options,
  selected,
  onToggle,
}: {
  prefix: string;
  title: string;
  options: { value: string; label: string; count: number }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-muted-foreground">{title}</legend>
      <ul className="space-y-1">
        {options.map((o) => {
          const id = `${prefix}-${title}-${o.value}`.replace(/[^a-zA-Z0-9-]/g, "");
          const checked = selected.includes(o.value);
          return (
            <li key={o.value}>
              <label
                htmlFor={id}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm transition-colors hover:bg-muted",
                  o.count === 0 && !checked && "opacity-50",
                )}
              >
                <Checkbox id={id} checked={checked} onCheckedChange={() => onToggle(o.value)} />
                <span className="flex-1">{o.label}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{o.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/* ---------------- Vue catalogue ---------------- */

export interface CatalogueViewProps {
  search: CatalogueSearch;
  /** Produits de départ (univers, marque, badge…) */
  pool: Product[];
  universe?: Category | undefined;
  subcategory?: SubCategory | undefined;
  /** Filtres non modifiables (page Promotions, Destockage, page marque) */
  locked?: { badge?: boolean; marque?: boolean };
  limitedLabel?: boolean;
  /** Afficher la facette « Univers » (page catalogue globale) */
  showUniverseLinks?: boolean;
}

export function CatalogueView({
  search,
  pool,
  universe,
  subcategory,
  locked = {},
  limitedLabel = false,
  showUniverseLinks = false,
}: CatalogueViewProps) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [query, setQuery] = useState(search.q ?? "");
  const view = search.vue === "liste" ? "list" : "grid";

  const patch = (next: Partial<CatalogueSearch>) => {
    void navigate({
      to: ".",
      search: ((prev: CatalogueSearch) => {
        const merged: CatalogueSearch = { ...prev, ...next };
        const clean: CatalogueSearch = {};
        for (const [k, v] of Object.entries(merged)) {
          if (v) clean[k as keyof CatalogueSearch] = v;
        }
        return clean;
      }) as never,
      replace: true,
      resetScroll: false,
    });
  };

  // Recherche texte : debounce vers l'URL
  useEffect(() => setQuery(search.q ?? ""), [search.q]);
  useEffect(() => {
    const t = window.setTimeout(() => {
      if ((search.q ?? "") !== query.trim()) patch({ q: query.trim() || undefined });
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const filterKey = JSON.stringify({ ...search, vue: undefined, tri: undefined });
  useEffect(() => setVisible(PAGE_SIZE), [filterKey]);

  const results = useMemo(
    () => sortProducts(applyFilters(pool, search), search.tri),
    [pool, search],
  );

  /* Facettes avec compteurs (chaque facette ignore son propre filtre) */
  const facets = useMemo(() => {
    const subPool = applyFilters(pool, search, { skip: "sub" });
    const brandPool = applyFilters(pool, search, { skip: "marque" });
    const badgePool = applyFilters(pool, search, { skip: "badge" });
    const typePool = applyFilters(pool, search, { skip: "type" });
    const attrPool = applyFilters(pool, search, { skip: "attr" });

    const subCounts = countBy(subPool, (p) => p.subcategory);
    const brandCounts = countBy(brandPool, (p) => p.brand);
    const badgeCounts = countBy(badgePool, (p) => p.badges);
    const typeCounts = countBy(typePool, (p) => p.type);
    const attrCounts = countBy(attrPool, (p) => p.attributes);

    const allBrands = [...new Set(pool.map((p) => p.brand))].sort((a, b) =>
      getBrandName(a).localeCompare(getBrandName(b), "fr"),
    );
    const typeSource = subcategory
      ? (subcategory.types ?? [])
      : [...new Set(pool.map((p) => p.type).filter((t): t is string => Boolean(t)))];
    const showAttrs = universe ? universesWithAttributes.includes(universe.slug) : false;

    return {
      subs:
        universe && !subcategory
          ? universe.subcategories.map((s) => ({
              value: s.slug,
              label: s.name,
              count: subCounts.get(s.slug) ?? 0,
            }))
          : [],
      types: typeSource.map((t) => ({ value: t, label: t, count: typeCounts.get(t) ?? 0 })),
      brands: allBrands.map((b) => ({
        value: b,
        label: getBrandName(b),
        count: brandCounts.get(b) ?? 0,
      })),
      badges: locked.badge
        ? []
        : (["Promo", "Destockage", "Nouveau"] as const)
            .map((b) => ({ value: b, label: b, count: badgeCounts.get(b) ?? 0 }))
            .filter((b) => b.count > 0 || splitList(search.badge).includes(b.value)),
      attrs: showAttrs
        ? Object.entries(attributeLabels).map(([value, label]) => ({
            value,
            label,
            count: attrCounts.get(value) ?? 0,
          }))
        : [],
    };
  }, [pool, search, universe, subcategory, locked.badge]);

  /* Filtres actifs → puces supprimables */
  const chips: { key: keyof CatalogueSearch; value: string; label: string }[] = [
    ...(search.q ? [{ key: "q" as const, value: search.q, label: `« ${search.q} »` }] : []),
    ...splitList(search.sub).map((v) => ({
      key: "sub" as const,
      value: v,
      label: universe?.subcategories.find((s) => s.slug === v)?.name ?? v,
    })),
    ...splitList(search.type).map((v) => ({ key: "type" as const, value: v, label: v })),
    ...(locked.marque
      ? []
      : splitList(search.marque).map((v) => ({
          key: "marque" as const,
          value: v,
          label: getBrandName(v),
        }))),
    ...(locked.badge
      ? []
      : splitList(search.badge).map((v) => ({ key: "badge" as const, value: v, label: v }))),
    ...splitList(search.attr).map((v) => ({
      key: "attr" as const,
      value: v,
      label: attributeLabels[v] ?? v,
    })),
  ];

  const removeChip = (key: keyof CatalogueSearch, value: string) =>
    patch({ [key]: key === "q" ? undefined : toggleInList(search[key], value) });

  const resetAll = () =>
    patch({
      q: undefined,
      sub: undefined,
      type: undefined,
      attr: undefined,
      ...(locked.marque ? {} : { marque: undefined }),
      ...(locked.badge ? {} : { badge: undefined }),
    });

  const renderFilterPanel = (prefix: string) => (
    <div className="space-y-7">
      <div>
        <label htmlFor={`${prefix}-q`} className="eyebrow mb-3 text-muted-foreground">
          Affiner
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id={`${prefix}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom, référence, marque…"
            className="h-10 w-full rounded-lg border border-input bg-card pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {showUniverseLinks && (
        <nav aria-label="Univers">
          <p className="eyebrow mb-3 text-muted-foreground">Univers</p>
          <ul className="space-y-0.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/produits/$univers"
                  params={{ univers: c.slug }}
                  className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm transition-colors hover:bg-muted hover:text-primary"
                >
                  <c.icon className="size-4 text-primary" aria-hidden />
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/espace-couture"
                className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm transition-colors hover:bg-muted hover:text-primary"
              >
                <span className="inline-block size-4" aria-hidden />
                Espace couture
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <Facet
        prefix={prefix}
        title="Sous-catégorie"
        options={facets.subs}
        selected={splitList(search.sub)}
        onToggle={(v) => patch({ sub: toggleInList(search.sub, v) })}
      />
      <Facet
        prefix={prefix}
        title="Type"
        options={facets.types}
        selected={splitList(search.type)}
        onToggle={(v) => patch({ type: toggleInList(search.type, v) })}
      />
      <Facet
        prefix={prefix}
        title="Technologie"
        options={facets.attrs}
        selected={splitList(search.attr)}
        onToggle={(v) => patch({ attr: toggleInList(search.attr, v) })}
      />
      {!locked.marque && (
        <Facet
          prefix={prefix}
          title="Marque"
          options={facets.brands}
          selected={splitList(search.marque)}
          onToggle={(v) => patch({ marque: toggleInList(search.marque, v) })}
        />
      )}
      <Facet
        prefix={prefix}
        title="Offres"
        options={facets.badges}
        selected={splitList(search.badge)}
        onToggle={(v) => patch({ badge: toggleInList(search.badge, v) })}
      />
    </div>
  );

  const shown = results.slice(0, visible);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[264px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtres">
          <div className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 pb-6">
            {renderFilterPanel("fd")}
          </div>
        </aside>

        <div className="min-w-0">
          {/* Barre d'outils */}
          <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
            <p className="mr-auto text-sm text-muted-foreground" aria-live="polite">
              <span className="font-mono font-semibold text-foreground">{results.length}</span>{" "}
              produit{results.length > 1 ? "s" : ""}
            </p>
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label={`Filtres${chips.length ? `, ${chips.length} actif(s)` : ""}`}
            >
              <ListFilter aria-hidden />
              Filtres
              {chips.length > 0 && (
                <span className="rounded-full bg-primary px-1.5 font-mono text-[11px] text-primary-foreground">
                  {chips.length}
                </span>
              )}
            </Button>
            <Select
              value={search.tri ?? "pertinence"}
              onValueChange={(v) => patch({ tri: v === "pertinence" ? undefined : v })}
            >
              <SelectTrigger className="w-44" aria-label="Trier les produits">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div
              className="hidden rounded-lg border border-input p-0.5 sm:flex"
              role="group"
              aria-label="Affichage"
            >
              {(
                [
                  { v: "grid", icon: LayoutGrid, label: "Grille" },
                  { v: "list", icon: List, label: "Liste" },
                ] as const
              ).map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => patch({ vue: o.v === "list" ? "liste" : undefined })}
                  aria-pressed={view === o.v}
                  aria-label={`Affichage ${o.label}`}
                  className={cn(
                    "inline-flex size-8 items-center justify-center rounded-md transition-colors",
                    view === o.v ? "bg-muted text-foreground" : "text-muted-foreground",
                  )}
                >
                  <o.icon className="size-4" aria-hidden />
                </button>
              ))}
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={`${c.key}-${c.value}`}
                  type="button"
                  onClick={() => removeChip(c.key, c.value)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-primary/25 bg-blue-tint pr-2 pl-3 text-xs font-medium text-primary transition-colors hover:border-primary"
                  aria-label={`Retirer le filtre ${c.label}`}
                >
                  {c.label}
                  <X className="size-3.5" aria-hidden />
                </button>
              ))}
              <button
                type="button"
                onClick={resetAll}
                className="link-underline ml-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Tout effacer
              </button>
            </div>
          )}

          <div className="mt-6">
            {results.length === 0 ? (
              <EmptyState
                title="Aucun produit ne correspond à ces critères"
                description="Notre catalogue complet est plus large que le site : demandez-nous la référence recherchée, nous la sourçons pour vous."
                onReset={chips.length ? resetAll : undefined}
              />
            ) : (
              <>
                <RevealGroup
                  key={`${filterKey}-${view}`}
                  className={cn(
                    "grid gap-4 sm:gap-5",
                    view === "grid"
                      ? "grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1",
                  )}
                >
                  {shown.map((p, i) => (
                    <RevealItem key={p.id}>
                      <ProductCard
                        product={p}
                        view={view}
                        priority={i < 3}
                        limitedLabel={limitedLabel}
                      />
                    </RevealItem>
                  ))}
                </RevealGroup>
                {visible < results.length && (
                  <div className="mt-10 flex flex-col items-center gap-2">
                    <Button
                      variant="outline"
                      size="xl"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    >
                      Charger plus de produits
                    </Button>
                    <p className="font-mono text-xs text-muted-foreground">
                      {shown.length} / {results.length}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
          <div className="border-b border-border px-5 py-4">
            <SheetTitle className="font-display text-base">Filtres</SheetTitle>
            <SheetDescription className="text-xs">
              Affinez la sélection — les filtres sont conservés dans l'adresse de la page.
            </SheetDescription>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">{renderFilterPanel("fm")}</div>
          <div className="flex gap-2 border-t border-border p-4">
            {chips.length > 0 && (
              <Button variant="outline" onClick={resetAll}>
                Effacer
              </Button>
            )}
            <Button variant="brand" className="flex-1" onClick={() => setDrawerOpen(false)}>
              Voir {results.length} produit{results.length > 1 ? "s" : ""}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ---------------- Squelette (chargement) ---------------- */

export function CatalogueSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-busy="true">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="mt-6 h-10 w-2/3 max-w-lg" />
      <div className="mt-10 grid gap-5 min-[480px]:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-hairline overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-2 p-5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-4 h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
