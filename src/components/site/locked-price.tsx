import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * RÈGLE TARIFAIRE : les prix sont réservés aux professionnels.
 * Aucun prix n'est jamais affiché — uniquement le message sur devis.
 */
export function LockedPrice({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      <Lock className="size-3.5 text-primary" aria-hidden />
      <span>Prix professionnel — sur devis</span>
    </p>
  );
}
