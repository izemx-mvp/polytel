import { Link, useNavigate } from "@tanstack/react-router";
import { FileText, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useQuote, quoteLines } from "@/lib/quote";
import { ProductVisual } from "@/components/site/product-visual";
import { QuantityStepper } from "@/components/site/layout-primitives";

export function QuoteDrawer() {
  const { items, isOpen, setOpen, setQty, remove, count } = useQuote();
  const navigate = useNavigate();
  const lines = quoteLines(items);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 font-display text-base font-semibold">
            <FileText className="size-5 text-primary" aria-hidden />
            Ma demande de devis
            <span className="ml-1 rounded-full bg-muted px-2.5 py-0.5 font-mono text-xs font-normal text-muted-foreground">
              {count} article{count > 1 ? "s" : ""}
            </span>
          </SheetTitle>
          <SheetDescription className="text-xs">
            Sans engagement — tarifs professionnels communiqués par nos conseillers.
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-blue-tint text-primary">
              <FileText className="size-7" aria-hidden />
            </span>
            <p className="mt-2 font-display font-semibold text-foreground">
              Votre demande de devis est vide
            </p>
            <p className="text-sm text-muted-foreground">
              Ajoutez des produits depuis le catalogue, ou décrivez directement votre besoin.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Button asChild variant="outline">
                <Link to="/produits" onClick={() => setOpen(false)}>
                  Explorer le catalogue
                </Link>
              </Button>
              <Button asChild variant="cta">
                <Link to="/devis" onClick={() => setOpen(false)}>
                  Décrire mon besoin
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 px-5 py-4">
                  <ProductVisual
                    product={product}
                    compact
                    width={64}
                    height={64}
                    className="product-surface size-16 shrink-0 rounded-lg border border-border"
                    imgClassName="p-1.5"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/produit/$slug"
                      params={{ slug: product.slug }}
                      onClick={() => setOpen(false)}
                      className="line-clamp-2 text-sm font-medium hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Réf. {product.reference}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <QuantityStepper
                        size="sm"
                        value={qty}
                        onChange={(v) => setQty(product.id, v)}
                        label={product.name}
                      />
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        className="ml-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Retirer ${product.name} de la demande`}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border bg-muted/40 px-5 py-4">
              <Button
                variant="cta"
                size="xl"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  void navigate({ to: "/devis" });
                }}
              >
                Finaliser ma demande
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Un conseiller vous répond avec une offre adaptée.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
