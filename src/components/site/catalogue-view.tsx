import { useMemo, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ChevronRight, ListFilter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/site/product-card";
import { Reveal } from "@/components/site/motion-primitives";
import { categories, getCategory } from "@/data/categories";
import { getBrand, brands } from "@/data/brands";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

export interface CatalogueSearch {
  q?: string;
  marque?: string;
  badge?: string;
  sub?: string;
  tri?: string;
}

export function CatalogueView({
  universeSlug,
  search,
  lockedBadge,
}: {
  universeSlug?: string;
  search: CatalogueSearch;
  lockedBadge?: string;
}) {
  const router = useRouter();
  const universe = universeSlug ? getCategory(universeSlug) : undefined;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const patchSearch = (patch: Partial<CatalogueSearch>) => {
    router.navigate({
      search: (prev: CatalogueSearch) => {
        const next = { ...prev, ...patch };
        for (const k of Object.keys(next) as (keyof CatalogueSearch)[]) {
          if (!next[k]) delete next[k];
        }
        return next;
      },
      replace: true,
    });
  };

  const pool = useMemo(
    () => (universeSlug ? products.filter((p) => p.universe === universeSlug) : products),
    [universeSlug],
  );

  const availableBrands = useMemo(() => {
    const names = [...new Set(pool.map((p) => p.brand))];
    return brands.filter((b) => names.includes(b.name));
  }, [pool]);

  const availableSubs = useMemo(
    () => (universe ? universe.subcategories : [...new Set(pool.map((p) => p.subcategory))]),
    [universe, pool],
  );

  const filtered = useMemo(() => {
    let list = pool;
    const q = (search.q ?? "").trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      );
    }
    if (search.marque) list = list.filter((p) => getBrand(search.marque!)?.name === p.brand);
    if (search.sub) list = list.filter((p) => p.subcategory === search.sub);
    if (search.badge) list = list.filter((p) => p.badges.includes(search.badge!));
    const tri = search.tri ?? "az";
    list = [...list].sort((a, b) => {
      if (tri === "za") return b.name.localeCompare(a.name, "fr");
      if (tri === "marque") return a.brand.localeCompare(b.brand, "fr") || a.name.localeCompare(a.name === b.name ? b.name : a.name, "fr");
      return a.name.localeCompare(b.name, "fr");
    });
    return list;
  }, [pool, search]);

  const activeCount =
    (search.marque ? 1 : 0) +
    (search.sub ? 1 : 0) +
    (search.badge && !lockedBadge ? 1 : 0) +
    (search.q ? 1 : 0);

  const FilterPanel = (
    <div className="space-y-6">
      {/* Recherche */}
      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Recherche
        </h3>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            value={search.q ?? ""}
            onChange={(e) => patchSearch({ q: e.target.value })}
            placeholder="Nom, réf., marque…"
            className="pl-8"
          />
        </div>
      </div>

      {/* Sous-catégorie */}
      {availableSubs.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Sous-catégorie
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {availableSubs.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => patchSearch({ sub: search.sub === sub ? undefined : sub })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  search.sub === sub
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground/80 hover:border-primary/50 hover:text-primary",
                )}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Marques */}
      {availableBrands.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Marque
          </h3>
          <ul className="space-y-2">
            {availableBrands.map((b) => (
              <li key={b.slug}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={search.marque === b.slug}
                    onCheckedChange={(checked) =>
                      patchSearch({ marque: checked ? b.slug : undefined })
                    }
                  />
                  {b.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Badges */}
      {!lockedBadge && (
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Offres
          </h3>
          <ul className="space-y-2">
            {["Promo", "Destockage"].map((badge) => (
              <li key={badge}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={search.badge === badge}
                    onCheckedChange={(checked) =>
                      patchSearch({ badge: checked ? badge : undefined })
                    }
                  />
                  {badge === "Promo" ? "Promotions" : "Déstockage"}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => patchSearch({ q: undefined, marque: undefined, sub: undefined, badge: undefined })}
          className="text-muted-foreground"
        >
          <X className="size-4" aria-hidden />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Fil d'Ariane */}
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Accueil
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <Link to="/produits" className={cn(!universe && "font-medium text-foreground", "hover:text-primary")}>
          Produits
        </Link>
        {universe && (
          <>
            <ChevronRight className="size-3.5" aria-hidden />
            <span className="font-medium text-foreground">{universe.name}</span>
          </>
        )}
      </nav>

      {/* Intro univers */}
      <header className="mt-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          {universe ? universe.name : "Catalogue POLYTEL"}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {universe
            ? universe.blurb
            : "L'ensemble de notre équipement professionnel : impression, caisse & POS, informatique, identification, multimédia et plus — produits 100 % d'origine."}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filtres desktop */}
        <aside className="hidden lg:block">
          <div className="card-hairline sticky top-32 p-5">{FilterPanel}</div>
        </aside>

        <div>
          {/* Barre d'outils */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-semibold text-foreground">{filtered.length}</span> produit
              {filtered.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              {/* Filtres mobile */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <ListFilter className="size-4" aria-hidden />
                    Filtres{activeCount > 0 ? ` (${activeCount})` : ""}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <h2 className="mb-4 font-display text-base font-semibold">Filtres</h2>
                  {FilterPanel}
                </SheetContent>
              </Sheet>
              <Select
                value={search.tri ?? "az"}
                onValueChange={(v) => patchSearch({ tri: v === "az" ? undefined : v })}
              >
                <SelectTrigger className="w-44" aria-label="Trier les produits">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="az">Nom (A → Z)</SelectItem>
                  <SelectItem value="za">Nom (Z → A)</SelectItem>
                  <SelectItem value="marque">Marque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chips sous-catégories (univers) */}
          {universe && (
            <div className="mb-6 flex flex-wrap gap-2">
              {universe.subcategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => patchSearch({ sub: search.sub === sub ? undefined : sub })}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    search.sub === sub
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground/80 hover:border-primary/50 hover:text-primary",
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Grille produits */}
          {filtered.length === 0 ? (
            <div className="card-hairline flex flex-col items-center gap-3 px-6 py-16 text-center">
              <p className="font-medium">Aucun produit ne correspond à votre recherche.</p>
              <p className="text-sm text-muted-foreground">
                Modifiez vos filtres ou demandez-nous le produit recherché — nous le sourçons pour vous.
              </p>
              <Button variant="outline" asChild className="mt-2">
                <Link to="/contact">Demander ce produit</Link>
              </Button>
            </div>
          ) : (
            <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
