import { BadgeCheck, Clock, Sparkles, Tag } from "lucide-react";
import type { ProductBadge } from "@/data/products";
import { cn } from "@/lib/utils";

const styles: Record<ProductBadge, { className: string; icon: typeof Tag; label: string }> = {
  Promo: { className: "bg-cta text-cta-foreground", icon: Tag, label: "Promo" },
  Destockage: {
    className: "bg-ink text-ink-foreground",
    icon: Clock,
    label: "Destockage",
  },
  Nouveau: { className: "bg-primary text-primary-foreground", icon: Sparkles, label: "Nouveau" },
  "Brother officiel": {
    className: "border border-primary/20 bg-blue-tint text-primary",
    icon: BadgeCheck,
    label: "Brother officiel",
  },
};

export function PillBadge({ badge, className }: { badge: ProductBadge; className?: string }) {
  const s = styles[badge];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wide whitespace-nowrap uppercase",
        s.className,
        className,
      )}
    >
      <s.icon className="size-3" aria-hidden />
      {s.label}
    </span>
  );
}

export function ProductBadges({
  badges,
  className,
  limit,
}: {
  badges: ProductBadge[];
  className?: string;
  limit?: number;
}) {
  if (badges.length === 0) return null;
  const list = limit ? badges.slice(0, limit) : badges;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {list.map((b) => (
        <PillBadge key={b} badge={b} />
      ))}
    </div>
  );
}
