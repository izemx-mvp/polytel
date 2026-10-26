import { useState } from "react";
import { getBrand, getBrandName } from "@/data/brands";
import { cn } from "@/lib/utils";

/**
 * Logo de marque. Logo absent ou en erreur → logo texte typographique.
 * `reveal` : niveaux de gris → couleur au survol du parent `.group`.
 */
export function BrandLogo({
  slug,
  className,
  reveal = false,
  size = "md",
}: {
  slug: string;
  className?: string;
  reveal?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const brand = getBrand(slug);
  const [failed, setFailed] = useState(false);
  const name = getBrandName(slug);
  const heights = { sm: "h-5", md: "h-7", lg: "h-12" } as const;
  const textSizes = { sm: "text-[11px]", md: "text-sm", lg: "text-xl" } as const;

  if (!brand?.logo || failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center font-display font-bold tracking-tight text-foreground/70 uppercase",
          textSizes[size],
          reveal && "transition-colors group-hover:text-primary",
          className,
        )}
      >
        {name}
      </span>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={`Logo ${name}`}
      loading="lazy"
      decoding="async"
      width={120}
      height={48}
      onError={() => setFailed(true)}
      className={cn(
        "w-auto object-contain",
        heights[size],
        reveal &&
          "opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0",
        className,
      )}
    />
  );
}
