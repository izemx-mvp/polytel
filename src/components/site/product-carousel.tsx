import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

/** Carrousel horizontal en scroll-snap natif, avec flèches. */
export function ProductCarousel({
  products,
  label,
  className,
}: {
  products: Product[];
  label: string;
  className?: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)} role="region" aria-label={label}>
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={!canPrev}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-soft transition-colors hover:text-primary disabled:opacity-40"
          aria-label="Produits précédents"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={!canNext}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-soft transition-colors hover:text-primary disabled:opacity-40"
          aria-label="Produits suivants"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
      <ul
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {products.map((p) => (
          <li
            key={p.id}
            className="w-[78%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.7rem)] xl:w-[calc(25%-0.75rem)]"
          >
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
