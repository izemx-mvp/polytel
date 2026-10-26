import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * RÈGLE TARIFAIRE : les prix sont réservés aux professionnels.
 * Tant que `site.showPublicPrices` vaut false, aucun prix n'est affiché.
 */
export function LockedPrice({
  priceHT,
  className,
  variant = "compact",
}: {
  priceHT?: number | null;
  className?: string;
  variant?: "compact" | "full";
}) {
  if (site.showPublicPrices && typeof priceHT === "number") {
    return (
      <p className={cn("font-display text-lg font-semibold text-foreground", className)}>
        {priceHT.toLocaleString("fr-MA")} MAD <span className="text-xs font-normal">HT</span>
      </p>
    );
  }

  if (variant === "full") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/50 p-4",
          className,
        )}
      >
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-soft">
          <Lock className="size-4" aria-hidden />
        </span>
        <div className="text-sm">
          <p className="font-semibold text-foreground">Prix professionnel</p>
          <p className="text-muted-foreground">
            <Link to="/connexion" className="link-underline font-medium text-primary">
              Connectez-vous
            </Link>{" "}
            ou demandez un devis pour obtenir votre tarif.
          </p>
        </div>
      </div>
    );
  }

  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-[11.5px] leading-snug text-muted-foreground",
        className,
      )}
    >
      <Lock className="size-3.5 shrink-0 text-primary" aria-hidden />
      <span>Prix professionnel — Connectez-vous ou demandez un devis</span>
    </p>
  );
}
