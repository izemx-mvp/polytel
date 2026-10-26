import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CircleUserRound,
  FileText,
  Mail,
  Menu,
  Phone,
  Search,
  Tag,
  Wrench,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { MegaMenu } from "@/components/site/mega-menu";
import { SearchBox } from "@/components/site/search-box";
import { WhatsAppIcon } from "@/components/site/icons";
import { categories } from "@/data/categories";
import { buildWhatsAppLink, site } from "@/config/site";
import { useQuote } from "@/lib/quote";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { label: "Marques", to: "/marques" },
  { label: "Promotions", to: "/promotions", dot: true },
  { label: "Destockage", to: "/destockage" },
  { label: "Espace couture", to: "/espace-couture" },
  { label: "Services & SAV", to: "/services" },
  { label: "E-catalogues", to: "/catalogues" },
  { label: "Contact", to: "/contact" },
] as const;

const topMessages = [
  site.topBarMessage,
  "Produits 100 % d'origine · garantie constructeur",
  "SAV certifié DAMS Brother · assistance 5j/7",
];

/* ---------------- Bouton panier de devis ---------------- */

function QuoteButton({ compact = false }: { compact?: boolean }) {
  const { count, bump, setOpen } = useQuote();
  return (
    <button
      type="button"
      data-quote-target
      onClick={() => setOpen(true)}
      className={cn(
        "relative inline-flex h-10 items-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
        compact
          ? "w-10 justify-center hover:bg-muted"
          : "border border-border bg-card px-3.5 shadow-soft hover:border-primary/40 hover:text-primary",
      )}
      aria-label={`Demande de devis, ${count} article${count > 1 ? "s" : ""}`}
    >
      <FileText className="size-[18px]" aria-hidden />
      {!compact && <span className="hidden xl:inline">Demande de devis</span>}
      <span
        key={bump}
        className={cn(
          "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-semibold",
          count > 0 ? "bg-cta text-cta-foreground" : "bg-muted text-muted-foreground",
          bump > 0 && "badge-bump",
          compact && "absolute -top-1 -right-1 h-5",
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* ---------------- Messages défilants (barre utilitaire) ---------------- */

function RotatingMessage() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % topMessages.length), 4500);
    return () => window.clearInterval(t);
  }, [reduced]);

  return (
    <div className="relative h-5 min-w-0 flex-1 overflow-hidden" aria-live="off">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={i}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 truncate leading-5 font-medium"
        >
          <span className="mr-2 inline-block size-1.5 rounded-full bg-cta align-middle" />
          {topMessages[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Recherche mobile (plein écran haut) ---------------- */

function MobileSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="gap-0 p-0">
        <SheetTitle className="sr-only">Rechercher</SheetTitle>
        <SheetDescription className="sr-only">Rechercher un produit, une référence ou une marque</SheetDescription>
        <div className="p-4 pr-14">
          <SearchBox onNavigate={close} placeholder="Produit, référence, marque…" />
        </div>
        <div className="border-t border-border px-4 py-4">
          <p className="eyebrow mb-3 text-muted-foreground">Univers populaires</p>
          <ul className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/produits/$univers"
                  params={{ univers: c.slug }}
                  onClick={close}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium"
                >
                  <c.icon className="size-3.5 text-primary" aria-hidden />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ---------------- Menu mobile ---------------- */

function MobileMenu({
  open,
  onOpenChange,
  isActive,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  isActive: (to: string) => boolean;
}) {
  const close = () => onOpenChange(false);
  const { count } = useQuote();

  const quick = [
    { label: `Devis${count > 0 ? ` (${count})` : ""}`, to: "/devis", icon: FileText, accent: true },
    { label: "Promotions", to: "/promotions", icon: Tag, accent: false },
    { label: "SAV", to: "/services", icon: Wrench, accent: false },
    { label: "Mon espace", to: "/connexion", icon: CircleUserRound, accent: false },
  ] as const;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-full max-w-none flex-col gap-0 p-0 sm:max-w-md">
        <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
        <SheetDescription className="sr-only">Recherche, univers produits et pages du site Polytel</SheetDescription>
        <div className="border-b border-border p-4 pr-14">
          <Link to="/" onClick={close} aria-label="POLYTEL — Accueil">
            <Logo />
          </Link>
        </div>
        <div className="space-y-3 border-b border-border p-4">
          <SearchBox onNavigate={close} placeholder="Produit, référence, marque…" />
          <ul className="grid grid-cols-4 gap-2">
            {quick.map((q) => (
              <li key={q.to}>
                <Link
                  to={q.to}
                  onClick={close}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 text-center text-[11px] font-semibold",
                    q.accent ? "border-cta bg-cta text-cta-foreground" : "border-border bg-card",
                  )}
                >
                  <q.icon className={cn("size-4", !q.accent && "text-primary")} aria-hidden />
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 pb-6" aria-label="Navigation mobile">
          <p className="eyebrow mt-5 mb-1">Univers produits</p>
          <Accordion type="single" collapsible>
            {categories.map((cat) => (
              <AccordionItem key={cat.slug} value={cat.slug} className="border-border">
                {cat.subcategories.length > 0 ? (
                  <>
                    <AccordionTrigger className="py-3 text-[15px] font-medium hover:no-underline">
                      <span className="flex items-center gap-3">
                        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-blue-tint text-primary">
                          <cat.icon className="size-4" aria-hidden />
                        </span>
                        {cat.name}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="ml-4 space-y-0.5 border-l border-border pl-4">
                        <li>
                          <Link
                            to="/produits/$univers"
                            params={{ univers: cat.slug }}
                            onClick={close}
                            className="flex items-center gap-1 py-1.5 text-sm font-semibold text-primary"
                          >
                            Tout l'univers
                            <ArrowRight className="size-3.5" aria-hidden />
                          </Link>
                        </li>
                        {cat.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              to="/produits/$univers/$sousCategorie"
                              params={{ univers: cat.slug, sousCategorie: sub.slug }}
                              onClick={close}
                              className="block py-1.5 text-sm text-muted-foreground hover:text-primary"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </>
                ) : (
                  <Link
                    to="/produits/$univers"
                    params={{ univers: cat.slug }}
                    onClick={close}
                    className="flex items-center gap-3 py-3 text-[15px] font-medium"
                  >
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-blue-tint text-primary">
                      <cat.icon className="size-4" aria-hidden />
                    </span>
                    {cat.name}
                  </Link>
                )}
              </AccordionItem>
            ))}
          </Accordion>

          <p className="eyebrow mt-6 mb-1">Polytel</p>
          <ul className="divide-y divide-border">
            {[
              ...navLinks.map((l) => ({ label: l.label, to: l.to })),
              { label: "Qui sommes-nous", to: "/a-propos" },
              { label: "Blog", to: "/blog" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={close}
                  className={cn(
                    "flex items-center justify-between py-3 text-[15px] font-medium",
                    isActive(l.to) && "text-primary",
                  )}
                >
                  {l.label}
                  {isActive(l.to) && <span className="size-1.5 rounded-full bg-primary" aria-hidden />}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-3 rounded-xl bg-muted/60 p-4 text-sm">
            {site.agencies.map((a) => (
              <a key={a.city} href={a.phoneHref} className="flex items-center justify-between gap-2 font-medium">
                <span className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" aria-hidden />
                  {a.city}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{a.phone}</span>
              </a>
            ))}
            <a href={site.emailHref} className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4 text-primary" aria-hidden />
              {site.email}
            </a>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex h-10 items-center justify-center gap-2 rounded-lg bg-ink text-sm font-semibold text-ink-foreground"
            >
              <WhatsAppIcon className="size-4 text-whatsapp" aria-hidden />
              Écrire sur WhatsApp
            </a>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

/* ---------------- Header ---------------- */

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastY = useRef(0);
  const { count } = useQuote();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      // Rangée de navigation : masquée en descendant, réaffichée en remontant
      if (y < 220) setNavHidden(false);
      else if (y > lastY.current + 6) setNavHidden(true);
      else if (y < lastY.current - 6) setNavHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setNavHidden(false);
  }, [pathname]);

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const clientActive = isActive("/connexion") || isActive("/espace-client");

  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-[60] rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Aller au contenu
      </a>

      {/* Barre utilitaire */}
      <div className="bg-ink text-ink-foreground">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
          <RotatingMessage />
          <div className="hidden shrink-0 items-center gap-5 text-ink-muted md:flex">
            <a href={site.phoneHref} className="flex items-center gap-1.5 hover:text-ink-foreground">
              <Phone className="size-3.5" aria-hidden />
              {site.phone}
            </a>            <a href={site.emailHref} className="hidden items-center gap-1.5 hover:text-ink-foreground lg:flex">
              <Mail className="size-3.5" aria-hidden />
              {site.email}
            </a>
            <span className="h-3 w-px bg-ink-border" aria-hidden />
            <Link to="/services" hash="sav" className="hover:text-ink-foreground">
              SAV
            </Link>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-ink-foreground"
            >
              <WhatsAppIcon className="size-3.5 text-whatsapp" aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300",
          scrolled
            ? "glass border-border/80 shadow-[0_8px_24px_-16px_oklch(0.17_0.02_264/25%)]"
            : "border-border bg-background",
        )}
      >
        {/* Barre principale */}
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center gap-3 px-4 transition-[height] duration-300 sm:px-6 lg:gap-6 lg:px-8",
            scrolled ? "h-14 md:h-16" : "h-16 md:h-[72px]",
          )}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="-ml-2 inline-flex size-10 items-center justify-center rounded-lg hover:bg-muted lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <Link to="/" aria-label="POLYTEL — Accueil" className="shrink-0">
            <Logo />
          </Link>

          <div className="hidden flex-1 md:block lg:mx-4">
            <SearchBox className="max-w-xl" />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-muted md:hidden"
              aria-label="Rechercher"
            >
              <Search className="size-5" aria-hidden />
            </button>
            <div className="hidden sm:block">
              <QuoteButton />
            </div>
            <div className="sm:hidden">
              <QuoteButton compact />
            </div>
            {/* Espace client → page de connexion : icône sous lg, bouton à partir de lg */}
            <Link
              to="/connexion"
              aria-label="Espace client"
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-muted lg:hidden",
                clientActive && "bg-blue-tint text-primary",
              )}
            >
              <CircleUserRound className="size-5" aria-hidden />
            </Link>
            <Link
              to="/connexion"
              className={cn(
                "btn-slide hidden h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors lg:inline-flex",
                clientActive ? "bg-primary text-primary-foreground" : "bg-ink text-ink-foreground hover:bg-ink/90",
              )}
            >
              <CircleUserRound className="size-4" aria-hidden />
              Espace client
            </Link>
          </div>
        </div>

        {/* Rangée de navigation (se replie au défilement vers le bas) */}
        <nav
          aria-label="Navigation principale"
          className={cn(
            "relative hidden border-t transition-[height,opacity,border-color] duration-300 lg:block",
            navHidden ? "pointer-events-none h-0 overflow-hidden border-transparent opacity-0" : "h-11 border-border/70 opacity-100",
          )}
          {...(navHidden ? { "aria-hidden": true } : {})}
        >
          <div className="mx-auto flex h-11 max-w-7xl items-center gap-0.5 px-5 xl:px-6">
            <MegaMenu active={pathname.startsWith("/produit")} />
            {navLinks.map((l) => {
              const active = isActive(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  {...(navHidden ? { tabIndex: -1 } : {})}
                  className={cn(
                    "relative flex h-11 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors hover:text-primary",
                    active ? "text-primary" : "text-foreground/85",
                  )}
                >
                  {l.label}
                  {"dot" in l && l.dot && <span className="size-1.5 rounded-full bg-cta" aria-hidden />}
                  {active && (
                    <motion.span
                      {...(reduced ? {} : { layoutId: "nav-active" })}
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                      aria-hidden
                    />
                  )}
                </Link>
              );
            })}
            <Link
              to="/devis"
              {...(navHidden ? { tabIndex: -1 } : {})}
              className="group ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              <span className="link-underline">Demander un devis</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </nav>
      </header>

      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} isActive={isActive} />
      <MobileSearch open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Barre d'actions mobile (remplacée par la barre produit sur /produit/…) */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden",
          pathname.startsWith("/produit/") && "hidden",
        )}
      >
        <a href={site.phoneHref} className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium">
          <Phone className="size-[18px] text-primary" aria-hidden />
          Appeler
        </a>
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 border-x border-border py-2.5 text-[11px] font-medium"
        >
          <WhatsAppIcon className="size-[18px] text-whatsapp" aria-hidden />
          WhatsApp
        </a>
        <Link
          to="/devis"
          className="relative flex flex-col items-center justify-center gap-0.5 bg-cta py-2.5 text-[11px] font-semibold text-cta-foreground"
        >
          <FileText className="size-[18px]" aria-hidden />
          Devis{count > 0 ? ` (${count})` : ""}
        </Link>
      </div>
    </>
  );
}