import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBasket, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useQuote, quoteLines } from "@/lib/quote";
import { ProductImage } from "@/components/site/motion-primitives";
import { LockedPrice } from "@/components/site/locked-price";

export function QuoteDrawer() {
  const { items, isOpen, setOpen, setQty, remove, count } = useQuote();
  const navigate = useNavigate();
  const lines = quoteLines(items);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="flex items-center justify-between font-display text-base font-semibold">
            <span className="flex items-center gap-2">
              <ShoppingBasket className="size-5 text-primary" aria-hidden />
              Mon panier de devis
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
              {count} article{count > 1 ? "s" : ""}
            </span>
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBasket className="size-10 text-muted-foreground/50" aria-hidden />
            <p className="font-medium text-foreground">Votre panier de devis est vide</p>
            <p className="text-sm text-muted-foreground">
              Parcourez le catalogue et ajoutez les produits qui vous intéressent.
            </p>
            <Button asChild className="mt-2" variant="outline">
              <Link to="/produits" onClick={() => setOpen(false)}>
                Explorer le catalogue
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 px-5 py-4">
                  <ProductImage
                    src={product.image}
                    alt={`${product.name} — réf. ${product.reference}`}
                    className="size-16 shrink-0 rounded-md border border-border bg-white object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Réf. {product.reference}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-md border border-input">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label={`Retirer une unité de ${product.name}`}
                        >
                          <Minus className="size-3.5" aria-hidden />
                        </button>
                        <span className="w-8 text-center font-mono text-sm" aria-live="polite">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label={`Ajouter une unité de ${product.name}`}
                        >
                          <Plus className="size-3.5" aria-hidden />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          remove(product.id);
                          toast.success(`${product.name} retiré du devis`);
                        }}
                        className="ml-auto flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Retirer ${product.name} du devis`}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t bg-muted/50 px-5 py-4">
              <LockedPrice className="mb-3 justify-center" />
              <Button
                className="w-full bg-cta text-cta-foreground hover:bg-cta-hover"
                size="lg"
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/devis" });
                }}
              >
                Finaliser ma demande de devis
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Sans engagement — un conseiller vous répond rapidement.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function QuoteDrawerTriggerFloating() {
  return null;
}

export { X as QuoteCloseIcon };
