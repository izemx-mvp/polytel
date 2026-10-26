import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { categories } from "@/data/categories";
import { getProduct, productsByUniverse } from "@/data/products";
import { ProductVisual } from "@/components/site/product-visual";
import { BrandLogo } from "@/components/site/brand-logo";
import { cn } from "@/lib/utils";

/**
 * Mega menu « Produits » : colonne des 10 univers (gauche) →
 * sous-catégories en colonnes + produit mis en avant (droite).
 * Clavier : Entrée/↓ ouvre, ↑/↓ parcourt les univers, → entre dans les sous-catégories, Échap ferme.
 */
export function MegaMenu({ active: isRouteActive }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(categories[0]!.slug);
  const closeTimer = useRef<number | undefined>(undefined);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const universeRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const universe = categories.find((c) => c.slug === current) ?? categories[0]!;
  const featured =
    (universe.featuredProduct && getProduct(universe.featuredProduct)) ||
    productsByUniverse(universe.slug).find((p) => !p.placeholder) ||
    productsByUniverse(universe.slug)[0];

  const openNow = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };
  const close = (refocus = false) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const onUniverseKey = (e: KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next =
        (index + (e.key === "ArrowDown" ? 1 : -1) + categories.length) % categories.length;
      universeRefs.current[next]?.focus();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      panelRef.current?.querySelector<HTMLAnchorElement>("[data-sub-link]")?.focus();
    } else if (e.key === "Escape") {
      close(true);
    }
  };

  return (
    <div onMouseEnter={openNow} onMouseLeave={closeSoon} className="static">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="mega-menu-produits"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            window.setTimeout(() => universeRefs.current[0]?.focus(), 20);
          }
          if (e.key === "Escape") close();
        }}
        className={cn(
          "relative flex h-11 items-center gap-1 rounded-md px-3 text-sm font-medium transition-colors hover:text-primary",
          isRouteActive || open ? "text-primary" : "text-foreground/85",
        )}
      >
        Produits
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mega-menu-produits"
            initial={{ opacity: 0, scale: reduced ? 1 : 0.985, y: reduced ? 0 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.985 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ transformOrigin: "top left" }}
            className="absolute inset-x-0 top-full z-40 px-4 pt-2 sm:px-6 lg:px-8"
            onKeyDown={(e) => {
              if (e.key === "Escape") close(true);
            }}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-[280px_1fr] overflow-hidden rounded-2xl border border-border bg-popover shadow-lift">
              <ul className="border-r border-border bg-muted/50 p-2" aria-label="Univers produits">
                {categories.map((cat, i) => (
                  <li key={cat.slug}>
                    <Link
                      ref={(el) => {
                        universeRefs.current[i] = el;
                      }}
                      to="/produits/$univers"
                      params={{ univers: cat.slug }}
                      onMouseEnter={() => setCurrent(cat.slug)}
                      onFocus={() => setCurrent(cat.slug)}
                      onKeyDown={(e) => onUniverseKey(e, i)}
                      onClick={() => close()}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        current === cat.slug
                          ? "bg-card text-primary shadow-soft"
                          : "text-foreground/85 hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex size-7 items-center justify-center rounded-md transition-colors",
                          current === cat.slug
                            ? "bg-primary text-primary-foreground"
                            : "bg-card text-primary",
                        )}
                      >
                        <cat.icon className="size-4" aria-hidden />
                      </span>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div
                ref={panelRef}
                className="grid grid-cols-[1fr_260px] gap-8 p-7"
                key={universe.slug}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-lg font-semibold">{universe.name}</p>
                    <Link
                      to="/produits/$univers"
                      params={{ univers: universe.slug }}
                      onClick={() => close()}
                      className="link-underline inline-flex items-center gap-1 text-sm font-medium text-primary"
                    >
                      Voir tout l'univers
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{universe.blurb}</p>
                  {universe.subcategories.length > 0 ? (
                    <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 xl:grid-cols-3">
                      {universe.subcategories.map((sub, i) => (
                        <motion.li
                          key={sub.slug}
                          initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18, delay: reduced ? 0 : i * 0.02 }}
                        >
                          <Link
                            data-sub-link
                            to="/produits/$univers/$sousCategorie"
                            params={{ univers: universe.slug, sousCategorie: sub.slug }}
                            onClick={() => close()}
                            className="group/sub flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-foreground/85 transition-colors hover:bg-muted hover:text-primary"
                          >
                            {sub.name}
                            <ArrowRight
                              className="size-3 opacity-0 transition-opacity group-hover/sub:opacity-100"
                              aria-hidden
                            />
                          </Link>
                          {sub.types && (
                            <p className="px-2 pb-1 text-[11px] text-muted-foreground">
                              {sub.types.join(" · ")}
                            </p>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <Link
                      data-sub-link
                      to="/produits/$univers"
                      params={{ univers: universe.slug }}
                      onClick={() => close()}
                      className="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary"
                    >
                      Découvrir la gamme {universe.name}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  )}
                </div>

                {featured && (
                  <motion.div
                    initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: reduced ? 0 : 0.06 }}
                  >
                    <Link
                      to="/produit/$slug"
                      params={{ slug: featured.slug }}
                      onClick={() => close()}
                      className="group card-hairline card-lift relative block overflow-hidden"
                    >
                      <div className="product-surface relative border-b border-border">
                        <ProductVisual
                          product={featured}
                          className="aspect-[4/3] w-full"
                          imgClassName="p-5"
                        />
                        <span className="scan-on-hover" aria-hidden />
                      </div>
                      <div className="p-4">
                        <p className="eyebrow text-[10px]">En vedette</p>
                        <div className="mt-2 h-4">
                          <BrandLogo slug={featured.brand} size="sm" />
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm font-semibold">{featured.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          Réf. {featured.reference}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
