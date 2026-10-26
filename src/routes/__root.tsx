import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { MotionConfig, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight, Home } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { QuoteDrawer } from "@/components/site/quote-drawer";
import { FloatingActions } from "@/components/site/floating-actions";
import { SearchBox } from "@/components/site/search-box";
import { Button } from "@/components/ui/button";
import { QuoteProvider } from "@/lib/quote";
import { Toaster } from "@/components/ui/sonner";
import { categories } from "@/data/categories";
import { site } from "@/config/site";
import { jsonLdScript, localBusinessLd, organizationLd } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <section className="crop-marks relative overflow-hidden bg-ink text-ink-foreground">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 md:py-28">
        <p className="eyebrow justify-center text-cta">Erreur 404</p>
        <h1 className="display-lg mt-4 text-balance">Cette page n'est plus en rayon.</h1>
        <p className="mx-auto mt-5 max-w-lg text-ink-muted">
          La page demandée n'existe pas ou a été déplacée. Recherchez une référence ou explorez l'un
          de nos univers.
        </p>
        <div className="mx-auto mt-8 max-w-xl text-left">
          <SearchBox dark size="lg" placeholder="Rechercher une référence (ex : DCP-T310)…" />
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
          {categories.slice(0, 6).map((c) => (
            <li key={c.slug}>
              <Link
                to="/produits/$univers"
                params={{ univers: c.slug }}
                className="group flex items-center justify-between gap-2 rounded-xl border border-ink-border bg-ink-card px-4 py-3 text-sm font-medium transition-colors hover:border-white/30"
              >
                <span className="flex items-center gap-2.5">
                  <c.icon className="size-4 text-cta" aria-hidden />
                  {c.name}
                </span>
                <ArrowUpRight
                  className="size-4 opacity-50 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
        <Button variant="ghost-dark" size="xl" asChild className="mt-10">
          <Link to="/">
            <Home aria-hidden />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Cette page n'a pas pu se charger
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Une erreur est survenue de notre côté. Vous pouvez réessayer ou revenir à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              void router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "POLYTEL — Importateur grossiste matériel informatique & bureautique au Maroc" },
      { name: "description", content: site.description },
      { name: "theme-color", content: "#0B0F17" },
      { property: "og:site_name", content: "POLYTEL" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_MA" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://www.polytel.ma" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      jsonLdScript(organizationLd()),
      ...site.agencies.map((a) => jsonLdScript(localBusinessLd(a))),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Transition de page rapide (fondu + léger glissement). */
function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Pas d'animation au premier rendu (SSR) : le contenu reste visible avant l'hydratation.
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);
  return (
    <motion.div
      key={pathname}
      initial={firstRender.current ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <QuoteProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="contenu" className="flex-1">
              <PageTransition>
                {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                <Outlet />
              </PageTransition>
            </main>
            <Footer />
          </div>
          <QuoteDrawer />
          <FloatingActions />
          <Toaster position="top-center" richColors closeButton />
        </QuoteProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
