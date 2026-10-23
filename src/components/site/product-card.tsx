import { Link } from "@tanstack/react-router";
import { Lock, Plus, Tag } from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/site/motion-primitives";
import { LockedPrice } from "@/components/site/locked-price";
import { useQuote } from "@/lib/quote";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

function Badge({ label }: { label: string }) {
  const isPromo = label === "Promo";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        isPromo ? "bg-cta text-cta-foreground" : "bg-accent text-accent-foreground",
      )}
    >
      <Tag className="size-3" aria-hidden />
      {label}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useQuote();

  const addToQuote = () => {
    add(product.id, 1);
    toast.success(`${product.name} ajouté au devis`, {
      description: `Réf. ${product.reference}`,
    });
  };

  return (
    <article className="card-hairline group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to="/produit/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden bg-white"
      >
        <div className="relative">
          <ProductImage
            src={product.image}
            alt={`${product.name} — réf. ${product.reference}`}
            className="mx-auto aspect-4/3 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="scan-on-hover scan-beam left-0 opacity-0 group-hover:opacity-100" aria-hidden />
        </div>
        {product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badges.map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 border-t p-4">
        <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
          {product.brand}
        </p>
        <Link
          to="/produit/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 font-display text-sm font-semibold leading-snug text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="font-mono text-xs text-muted-foreground">Réf. {product.reference}</p>
        <LockedPrice className="mt-auto pt-2" />
        <button
          type="button"
          onClick={addToQuote}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
        >
          <Plus className="size-4" aria-hidden />
          Ajouter au devis
        </button>
      </div>
    </article>
  );
}

export function LockedPriceHero() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Lock className="size-4 text-primary" aria-hidden />
      Prix réservés aux professionnels
    </div>
  );
}
