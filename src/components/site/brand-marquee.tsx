import { Link } from "@tanstack/react-router";
import { brands } from "@/data/brands";
import { BrandLogo } from "@/components/site/brand-logo";

/** Défilement infini des logos — pause au survol, gris → couleur au survol de chaque logo. */
export function BrandMarquee() {
  const loop = [...brands, ...brands];
  return (
    <div
      className="marquee relative overflow-hidden py-2"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <ul className="marquee-track flex w-max items-center gap-4">
        {loop.map((b, i) => (
          <li key={`${b.slug}-${i}`} aria-hidden={i >= brands.length || undefined}>
            <Link
              to="/marques/$slug"
              params={{ slug: b.slug }}
              tabIndex={i >= brands.length ? -1 : undefined}
              className="group flex h-20 w-40 items-center justify-center rounded-xl border border-border bg-card px-5 transition-shadow hover:shadow-soft"
              aria-label={`Marque ${b.name}`}
            >
              <BrandLogo slug={b.slug} reveal className="max-h-9 max-w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
