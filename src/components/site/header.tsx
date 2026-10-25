import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Mail, Menu, Phone, Search, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { site } from "@/config/site";
import { useQuote } from "@/lib/quote";
import { ProductImage } from "@/components/site/motion-primitives";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { label: "Marques", to: "/marques" },
  { label: "Promotions", to: "/promotions" },
  { label: "Services & SAV", to: "/services" },
  { label: "À propos", to: "/a-propos" },
  { label: "Contact", to: "/contact" },
] as const;

/* ---------------- Recherche client ---------------- */

function SearchBox({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useRouterState({ select: (s) => s.location.pathname });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => setOpen(false), [navigate]);

  const go = (to: string, params?: Record<string, string>) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    if (params) {
      window.location.assign(
        Object.entries(params).reduce(
          (acc, [k, v]) => acc.replace(new RegExp(`:${k}`), v),
          to,
        ),
      );
    } else {
      window.location.assign(to);
    }
  };

  return (
    <div ref={boxRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim().length >= 2) go("/produits");
        }}
        role="search"
      >
        <label htmlFor="site-search" className="sr-only">
          Rechercher un produit, une référence, une marque
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Rechercher un produit, une réf., une marque…"
          className="h-10 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
        />
      </form>
      {open && query.trim().length >= 2 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Aucun produit trouvé pour « {query} ».
            </p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => go("/produit/$slug", { slug: p.slug })}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent"
                  >
                    <ProductImage
                      src={p.image}
                      alt=""
                      className="size-10 shrink-0 rounded bg-white object-contain"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block font-mono text-xs text-muted-foreground">
                        {p.brand} · Réf. {p.reference}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              <li className="border-t">
                <button
                  type="button"
                  onClick={() => go("/produits")}
                  className="block w-full px-4 py-2.5 text-left text-sm font-medium text-primary hover:bg-accent"
                >
                  Voir tous les résultats
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Mega menu Produits ---------------- */

function MegaMenu() {
  const [active, setActive] = useState<string>(categories[0]?.slug ?? "impression");
  const current = categories.find((c) => c.slug === active) ?? categories[0]!;

  return (
    <div className="invisible absolute top-full left-0 z-40 w-screen max-w-4xl translate-y-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="mx-auto mt-1 grid max-w-4xl grid-cols-[240px_1fr] overflow-hidden rounded-lg border border-border bg-popover shadow-xl">
        <ul className="border-r bg-muted/50 p-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                type="button"
                onMouseEnter={() => setActive(cat.slug)}
                onFocus={() => setActive(cat.slug)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                  active === cat.slug
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <cat.icon className="size-4 shrink-0" aria-hidden />
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="p-5">
          <Link
            to="/produits/$univers"
            params={{ univers: current.slug }}
            className="font-display text-base font-semibold text-foreground hover:text-primary"
          >
            {current.name}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{current.blurb}</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
            {current.subcategories.map((sub) => (
              <li key={sub}>
                <Link
                  to="/produits/$univers"
                  params={{ univers: current.slug }}
                  search={{ sub: sub }}
                  className="block rounded px-1 py-1 text-sm text-foreground/90 hover:text-primary"
                >
                  {sub}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Menu mobile ---------------- */

function MobileMenu() {
  const { count } = useQuote();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center rounded-md text-foreground hover:bg-accent lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-85 overflow-y-auto p-0">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            <Logo />
            <div className="mt-3">
              <SearchBox onNavigate={() => setOpen(false)} />
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <Accordion type="single" collapsible className="border-b">
              <AccordionItem value="produits" className="border-0">
                <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                  Produits
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1 pb-2">
                    {categories.map((cat) => (
                      <li key={cat.slug}>
                        <Accordion type="single" collapsible>
                          <AccordionItem value={cat.slug} className="border-0">
                            <AccordionTrigger className="py-1.5 text-sm text-muted-foreground hover:no-underline">
                              {cat.name}
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-1 border-l pl-3">
                                {cat.subcategories.map((sub) => (
                                  <li key={sub}>
                                    <Link
                                      to="/produits/$univers"
                                      params={{ univers: cat.slug }}
                                      search={{ sub }}
                                      className="block py-1 text-sm text-muted-foreground hover:text-primary"
                                    >
                                      {sub}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <ul className="mt-2 divide-y">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="block py-3 text-base font-medium hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t p-4">
            <Link
              to="/devis"
              className="flex items-center justify-center gap-2 rounded-md bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground"
            >
              <ShoppingCart className="size-4" aria-hidden />
              Demander un devis {count > 0 && `(${count})`}
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ---------------- Header ---------------- */

export function Header() {
  const { count, setOpen: setQuoteOpen } = useQuote();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const linkClass = (to: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      pathname === to ? "text-primary" : "text-foreground/90",
    );

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Barre supérieure */}
        <div className="bg-ink text-ink-foreground">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs">
            <p className="truncate font-medium tracking-wide">
              {site.topBarMessage}
            </p>
            <div className="hidden items-center gap-4 sm:flex">
              <a href={site.phoneHref} className="flex items-center gap-1.5 hover:text-white/80">
                <Phone className="size-3.5" aria-hidden />
                {site.phone}
              </a>
              <a href={site.emailHref} className="flex items-center gap-1.5 hover:text-white/80">
                <Mail className="size-3.5" aria-hidden />
                {site.email}
              </a>
            </div>
          </div>
        </div>

        {/* Barre principale */}
        <div className="border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
            <Link to="/" aria-label="POLYTEL — Accueil" className="shrink-0">
              <Logo />
            </Link>

            <div className="hidden max-w-md flex-1 lg:block">
              <SearchBox />
            </div>

            <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
              <div className="group relative">
                <Link
                  to="/produits"
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                    pathname.startsWith("/produits") ? "text-primary" : "text-foreground/90",
                  )}
                >
                  Produits
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden />
                </Link>
                <MegaMenu />
              </div>
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} className={linkClass(l.to)}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 lg:ml-4">
              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="relative inline-flex size-10 items-center justify-center rounded-md text-foreground hover:bg-accent"
                aria-label={`Panier de devis, ${count} article${count > 1 ? "s" : ""}`}
              >
                <ShoppingCart className="size-5" aria-hidden />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-cta text-[11px] font-bold text-cta-foreground">
                    {count}
                  </span>
                )}
              </button>
              <Link
                to="/devis"
                className="hidden items-center justify-center rounded-md bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover md:inline-flex"
              >
                Demander un devis
              </Link>
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Barre d'actions mobile */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
        <a
          href={site.phoneHref}
          className="flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-foreground"
        >
          <Phone className="size-4 text-primary" aria-hidden />
          Appeler
        </a>
        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 border-x border-border py-3 text-sm font-medium text-foreground"
        >
          WhatsApp
        </a>
        <Link
          to="/devis"
          className="flex items-center justify-center gap-1.5 bg-cta py-3 text-sm font-semibold text-cta-foreground"
        >
          Devis{count > 0 ? ` (${count})` : ""}
        </Link>
      </div>
    </>
  );
}
