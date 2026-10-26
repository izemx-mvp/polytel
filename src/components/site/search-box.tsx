import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { searchProducts } from "@/lib/search";
import { ProductVisual } from "@/components/site/product-visual";
import { subcategoryName, universeName } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Champ de recherche instantanée (Fuse.js) avec résultats en direct :
 * image, référence en mono, rubrique. Navigable au clavier (combobox ARIA).
 */
export function SearchBox({
  className,
  onNavigate,
  placeholder = "Rechercher un produit, une référence, une marque…",
  dark = false,
  size = "md",
  autoFocus = false,
}: {
  className?: string;
  onNavigate?: () => void;
  placeholder?: string;
  dark?: boolean;
  size?: "md" | "lg";
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const listId = useId();

  const results = useMemo(() => searchProducts(query, 6), [query]);
  const showPanel = open && query.trim().length >= 2;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => setActive(-1), [query]);

  const reset = () => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
  };

  const goToProduct = (slug: string) => {
    reset();
    void navigate({ to: "/produit/$slug", params: { slug } });
  };

  const goToResults = () => {
    const q = query.trim();
    reset();
    void navigate({ to: "/produits", search: q ? { q } : {} });
  };

  return (
    <div ref={boxRef} className={cn("relative w-full", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const hit = results[active];
          if (hit) goToProduct(hit.slug);
          else goToResults();
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          Rechercher un produit, une référence, une marque
        </label>
        <Search
          className={cn(
            "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2",
            dark ? "text-ink-muted" : "text-muted-foreground",
          )}
          aria-hidden
        />
        <input
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((a) => Math.min(a + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, -1));
            }
          }}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border pr-4 pl-10 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
            size === "lg" ? "h-13" : "h-11",
            dark
              ? "border-ink-border bg-white/6 text-ink-foreground placeholder:text-ink-muted focus:bg-white/10"
              : "border-input bg-card text-foreground placeholder:text-muted-foreground",
          )}
        />
      </form>

      {showPanel && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lift">
          {results.length === 0 ? (
            <div className="px-4 py-4 text-sm">
              <p className="text-muted-foreground">Aucun produit trouvé pour « {query} ».</p>
              <button
                type="button"
                onClick={() => {
                  reset();
                  void navigate({ to: "/devis" });
                }}
                className="link-underline mt-1 font-medium text-primary"
              >
                Demander ce produit sur devis
              </button>
            </div>
          ) : (
            <ul id={listId} role="listbox" aria-label="Résultats de recherche" className="py-1.5">
              {results.map((p, i) => (
                <li key={p.id} id={`${listId}-opt-${i}`} role="option" aria-selected={active === i}>
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToProduct(p.slug)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                      active === i ? "bg-muted" : "hover:bg-muted",
                    )}
                  >
                    <ProductVisual
                      product={p}
                      compact
                      width={44}
                      height={44}
                      className="product-surface size-11 shrink-0 rounded-md border border-border"
                      imgClassName="p-1"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        <span className="font-mono">{p.reference}</span>
                        {" · "}
                        {subcategoryName(p) ?? universeName(p)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              <li className="mt-1 border-t border-border">
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={goToResults}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-primary hover:bg-muted"
                >
                  Voir tous les résultats pour « {query.trim()} »
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
