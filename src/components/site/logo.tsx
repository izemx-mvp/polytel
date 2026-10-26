import logoAsset from "@/assets/polytel-logo.gif.asset.json";
import { cn } from "@/lib/utils";

/**
 * Logo POLYTEL. Source : l'asset du projet (polytel-logo.gif, 555 Ko animé).
 * On sert une version PNG optimisée (même visuel, fond transparent, ~50 Ko)
 * depuis /public pour la performance, avec repli sur l'asset Lovable.
 */
const OPTIMIZED_LOGO = "/images/polytel-logo.png";

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        onDark && "rounded-lg bg-card px-3 py-2 shadow-soft",
        className,
      )}
    >
      <img
        src={OPTIMIZED_LOGO}
        alt="POLYTEL — Négociant Import-Export"
        width={439}
        height={112}
        decoding="async"
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.endsWith(logoAsset.url)) img.src = logoAsset.url;
        }}
        className="h-8 w-auto md:h-9"
      />
    </span>
  );
}
