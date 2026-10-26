import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

/** Silhouette neutre (aucun visuel disponible) avec la référence en mono. */
export function ProductSilhouette({
  reference,
  className,
  compact = false,
}: {
  reference: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/70",
        className,
      )}
      role="img"
      aria-label={`Visuel à venir — réf. ${reference}`}
    >
      <svg
        viewBox="0 0 120 80"
        className={cn(compact ? "w-3/5" : "w-2/5 max-w-28")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M34 26V14a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v12" />
        <rect x="16" y="26" width="88" height="36" rx="6" />
        <rect x="26" y="38" width="22" height="12" rx="2" opacity="0.5" />
        <circle cx="90" cy="44" r="4" opacity="0.5" />
        <path d="M34 62v6a4 4 0 0 0 4 4h44a4 4 0 0 0 4-4v-6" />
      </svg>
      {!compact && (
        <span className="max-w-full truncate px-2 font-mono text-[11px] tracking-wide">
          {reference}
        </span>
      )}
    </div>
  );
}

/**
 * Image produit sur surface claire uniforme : lazy loading, dimensions explicites,
 * repli gracieux sur la silhouette en cas d'absence ou d'erreur.
 */
export function ProductVisual({
  product,
  index = 0,
  className,
  imgClassName,
  priority = false,
  compact = false,
  width = 480,
  height = 360,
}: {
  product: Pick<Product, "images" | "name" | "reference">;
  index?: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  compact?: boolean;
  width?: number;
  height?: number;
}) {
  const src = product.images[index];
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src && !failed ? (
        <img
          src={src}
          alt={`${product.name} — réf. ${product.reference}`}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-contain", imgClassName)}
        />
      ) : (
        <ProductSilhouette reference={product.reference} compact={compact} />
      )}
    </div>
  );
}
