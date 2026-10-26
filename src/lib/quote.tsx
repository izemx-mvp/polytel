import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { getProductById, type Product } from "@/data/products";

export interface QuoteItem {
  productId: string;
  qty: number;
}

const STORAGE_KEY = "polytel-devis-v2";

interface QuoteContextValue {
  items: QuoteItem[];
  count: number;
  /** Incrémenté à chaque ajout — sert à rejouer l'animation du badge */
  bump: number;
  add: (productId: string, qty?: number, origin?: HTMLElement | null) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

function readStorage(): QuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is QuoteItem =>
        typeof i?.productId === "string" &&
        typeof i?.qty === "number" &&
        i.qty > 0 &&
        Boolean(getProductById(i.productId)),
    );
  } catch {
    return [];
  }
}

/** Petite pastille qui vole de l'élément cliqué vers l'icône du panier de devis. */
function flyToBasket(origin: HTMLElement | null | undefined) {
  if (!origin || typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const targets = [...document.querySelectorAll<HTMLElement>("[data-quote-target]")];
  const target = targets.find((t) => t.getClientRects().length > 0);
  if (!target) return;
  const from = origin.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const dot = document.createElement("div");
  dot.setAttribute("aria-hidden", "true");
  dot.className = "pointer-events-none fixed z-[100] size-4 rounded-full bg-cta shadow-lg";
  const x0 = from.left + from.width / 2 - 8;
  const y0 = from.top + from.height / 2 - 8;
  const x1 = to.left + to.width / 2 - 8;
  const y1 = to.top + to.height / 2 - 8;
  dot.style.left = "0px";
  dot.style.top = "0px";
  document.body.appendChild(dot);
  const anim = dot.animate(
    [
      { transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 1 },
      {
        transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 80}px) scale(1.2)`,
        opacity: 1,
        offset: 0.45,
      },
      { transform: `translate(${x1}px, ${y1}px) scale(0.4)`, opacity: 0.2 },
    ],
    { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
  anim.onfinish = () => dot.remove();
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage indisponible — le panier vit en mémoire pour la session
    }
  }, [items, hydrated]);

  const add = useCallback((productId: string, qty = 1, origin?: HTMLElement | null) => {
    const product = getProductById(productId);
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { productId, qty }];
    });
    flyToBasket(origin);
    window.setTimeout(() => setBump((b) => b + 1), 550);
    toast.success("Ajouté à votre demande de devis", {
      description: `${product.name} — Réf. ${product.reference} × ${qty}`,
      action: { label: "Voir", onClick: () => setOpen(true) },
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, qty: Math.min(qty, 9999) } : i)),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, count, bump, add, setQty, remove, clear, isOpen, setOpen }),
    [items, count, bump, add, setQty, remove, clear, isOpen],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}

export interface QuoteLine {
  product: Product;
  qty: number;
}

export function quoteLines(items: QuoteItem[]): QuoteLine[] {
  return items
    .map((i) => ({ product: getProductById(i.productId), qty: i.qty }))
    .filter((l): l is QuoteLine => Boolean(l.product));
}
