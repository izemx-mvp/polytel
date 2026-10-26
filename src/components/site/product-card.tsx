import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ProductVisual } from "@/components/site/product-visual";
import { ProductBadges } from "@/components/site/badges";
import { BrandLogo } from "@/components/site/brand-logo";
import { LockedPrice } from "@/components/site/locked-price";
import { QuantityStepper } from "@/components/site/layout-primitives";
import { useQuote } from "@/lib/quote";
import { brandName, subcategoryName, universeName, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

/** Deux caractéristiques clés pour la carte (ou la rubrique en repli). */
function keySpecs(product: Product): string[] {
  if (product.specs.length > 0) return product.specs.slice(0, 2).map((s) => s.value);
  return [subcategoryName(product) ?? universeName(product), product.type].filter(
    (v): v is string => Boolean(v),
  );
}

function AddToQuoteButton({
  product,
  qty = 1,
  className,
  size = "default",
  label = "Ajouter au devis",
}: {
  product: Product;
  qty?: number;
  className?: string;
  size?: "default" | "sm" | "lg" | "xl";
  label?: string;
}) {
  const { add } = useQuote();
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <Button
      ref={ref}
      type="button"
      variant="brand"
      size={size}
      onClick={() => add(product.id, qty, ref.current)}
      className={className}
      aria-label={`${label} : ${product.name}, réf. ${product.reference}`}
    >
      <Plus aria-hidden />
      {label}
    </Button>
  );
}

export { AddToQuoteButton };

export function ProductCard({
  product,
  view = "grid",
  priority = false,
  limitedLabel = false,
}: {
  product: Product;
  view?: "grid" | "list";
  priority?: boolean;
  /** Affiche « Quantités limitées » (destockage) */
  limitedLabel?: boolean;
}) {
  const [quickOpen, setQuickOpen] = useState(false);
  const specs = keySpecs(product);
  const isList = view === "list";

  return (
    <article
      className={cn(
        "card-hairline card-lift group relative flex h-full overflow-hidden",
        isList ? "flex-col sm:flex-row" : "flex-col",
      )}
    >
      <div
        className={cn(
          "product-surface relative shrink-0 border-border",
          isList ? "border-b sm:w-56 sm:border-r sm:border-b-0" : "border-b",
        )}
      >
        <Link
          to="/produit/$slug"
          params={{ slug: product.slug }}
          className="block"
          tabIndex={-1}
          aria-hidden
        >
          <ProductVisual
            product={product}
            priority={priority}
            className="aspect-[4/3] w-full"
            imgClassName="p-6 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <span className="scan-on-hover" aria-hidden />
        </Link>
        <ProductBadges badges={product.badges} limit={2} className="absolute top-3 left-3" />
        <button
          type="button"
          onClick={() => setQuickOpen(true)}
          className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-border bg-card/95 text-foreground opacity-100 shadow-soft transition-all hover:text-primary focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
          aria-label={`Aperçu rapide : ${product.name}`}
        >
          <Eye className="size-4" aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex h-5 items-center">
          <BrandLogo slug={product.brand} size="sm" />
        </div>
        <h3 className="mt-2.5 line-clamp-2 font-display text-[15px] leading-snug font-semibold text-foreground">
          <Link
            to="/produit/$slug"
            params={{ slug: product.slug }}
            className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">Réf. {product.reference}</p>
        {specs.length > 0 && (
          <ul className="mt-3 space-y-1 text-[13px] text-muted-foreground">
            {specs.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/60" aria-hidden />
                <span className="line-clamp-1">{s}</span>
              </li>
            ))}
          </ul>
        )}
        {limitedLabel && (
          <p className="mt-3 inline-flex w-fit items-center rounded-md bg-cta-soft px-2 py-1 text-xs font-semibold text-warm-foreground">
            Quantités limitées
          </p>
        )}
        <div className={cn("mt-auto pt-4", isList && "sm:flex sm:items-end sm:gap-4")}>
          <LockedPrice priceHT={product.priceHT} className="sm:flex-1" />
          <AddToQuoteButton
            product={product}
            className={cn("relative z-10 mt-3 w-full", isList && "sm:mt-0 sm:w-auto")}
          />
        </div>
      </div>

      <QuickView product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    </article>
  );
}

function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [qty, setQty] = useState(1);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-3xl">
        <div className="grid sm:grid-cols-2">
          <div className="product-surface border-b border-border sm:border-r sm:border-b-0">
            <ProductVisual product={product} className="aspect-square w-full" imgClassName="p-8" />
          </div>
          <div className="flex flex-col p-6">
            <BrandLogo slug={product.brand} size="sm" />
            <DialogTitle className="mt-3 font-display text-xl font-semibold">
              {product.name}
            </DialogTitle>
            <p className="mt-1 font-mono text-xs text-muted-foreground">Réf. {product.reference}</p>
            <ProductBadges badges={product.badges} className="mt-3" />
            <DialogDescription className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </DialogDescription>
            {product.specs.length > 0 && (
              <dl className="mt-4 divide-y divide-border rounded-lg border border-border text-[13px]">
                {product.specs.slice(0, 4).map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 px-3 py-2">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="text-right font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <LockedPrice priceHT={product.priceHT} className="mt-5" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <QuantityStepper value={qty} onChange={setQty} label={product.name} />
              <AddToQuoteButton product={product} qty={qty} className="flex-1" />
            </div>
            <Button variant="link" asChild className="mt-3 h-auto self-start px-0">
              <Link to="/produit/$slug" params={{ slug: product.slug }}>
                Voir la fiche complète
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Ligne compacte (recherche, assistant, panier). */
export function ProductMini({
  product,
  onNavigate,
  className,
}: {
  product: Product;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      to="/produit/$slug"
      params={{ slug: product.slug }}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted",
        className,
      )}
    >
      <ProductVisual
        product={product}
        compact
        width={56}
        height={56}
        className="product-surface size-12 shrink-0 rounded-md border border-border"
        imgClassName="p-1"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{product.name}</span>
        <span className="block truncate font-mono text-[11px] text-muted-foreground">
          {product.reference} · {brandName(product)}
        </span>
      </span>
    </Link>
  );
}
