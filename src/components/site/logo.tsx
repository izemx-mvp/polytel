import logoAsset from "@/assets/polytel-logo.gif.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md",
        onDark && "bg-white px-2.5 py-1.5",
        className,
      )}
    >
      <img
        src={logoAsset.url}
        alt="POLYTEL — Négociant Import-Export"
        className="h-9 w-auto md:h-10"
      />
    </span>
  );
}
