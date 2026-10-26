import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Clock, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/site/layout-primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { ProductVisual } from "@/components/site/product-visual";
import { postCategories, posts } from "@/data/posts";
import { getProductById } from "@/data/products";
import { getCategory } from "@/data/categories";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageHead({
      title: "Blog — conseils pour bien équiper votre entreprise | Polytel",
      description:
        "Guides et comparatifs Polytel : choisir une imprimante, une caisse enregistreuse, une imprimante d'étiquettes pour votre activité au Maroc.",
      path: "/blog",
    }),
  component: BlogPage,
});

type Post = (typeof posts)[number];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

/* ---------------- Couverture ---------------- */

function Cover({ post, className, large = false }: { post: Post; className?: string; large?: boolean }) {
  const product = getProductById(post.relatedProductIds[0] ?? "");
  const hasImage = Boolean(product?.images?.[0]);
  const universe = getCategory(post.universe);
  const Icon = universe?.icon ?? BookOpen;

  return (
    <div className={cn("product-surface relative overflow-hidden", className)}>
      {product && hasImage ? (
        <ProductVisual
          product={product}
          width={large ? 720 : 480}
          height={large ? 540 : 300}
          className="size-full"
          imgClassName={cn("transition-transform duration-500 group-hover:scale-105", large ? "p-12" : "p-8")}
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-blue-tint text-primary">
            <Icon className="size-7" aria-hidden />
          </span>
        </div>
      )}
      <span className="scan-on-hover" aria-hidden />
      <span className="absolute top-4 left-4 rounded-full bg-card px-3 py-1 text-xs font-semibold text-primary shadow-soft">
        {post.category}
      </span>
    </div>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden>·</span>
      <Clock className="size-3" aria-hidden />
      {post.readingMinutes} min
    </p>
  );
}

/* ---------------- Page ---------------- */

function BlogPage() {
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const n = q.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      sorted.filter(
        (p) =>
          (!cat || p.category === cat) &&
          (!n || [p.title, p.excerpt, p.category].join(" ").toLowerCase().includes(n)),
      ),
    [cat, n],
  );

  const showFeatured = !cat && !n && filtered.length > 0;
  const featured = showFeatured ? filtered[0] : undefined;
  const list = showFeatured ? filtered.slice(1) : filtered;
  const countFor = (c: string | null) => (c ? posts.filter((p) => p.category === c).length : posts.length);

  return (
    <>
      <PageHero
        dark={false}
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Blog" }]}
        eyebrow="Conseils & guides"
        title="Le blog Polytel"
        description="Comparatifs, guides d'achat et bonnes pratiques pour bien choisir et entretenir vos équipements professionnels."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        {/* À la une */}
        {featured && (
          <Reveal>
            <article className="card-hairline card-lift group relative grid overflow-hidden lg:grid-cols-12">
              <Cover post={featured} large className="aspect-[16/10] border-b border-border lg:col-span-7 lg:aspect-auto lg:min-h-[420px] lg:border-r lg:border-b-0" />
              <div className="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-cta px-3 py-1 text-xs font-semibold text-cta-foreground">
                  À la une
                </span>
                <div className="mt-6">
                  <Meta post={featured} />
                </div>
                <h2 className="display-md mt-3 text-balance">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: featured.slug }}
                    className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-primary"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-4 text-muted-foreground">{featured.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold text-primary">
                  Lire l'article
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </article>
          </Reveal>
        )}

        {/* Filtres */}
        <div className={cn("flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", featured && "mt-16")}>
          <div
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
            role="group"
            aria-label="Filtrer par catégorie"
          >
            {[null, ...postCategories].map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                  cat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50 hover:text-primary",
                )}
              >
                {c ?? "Tous les articles"}
                <span className={cn("font-mono text-[10px]", cat === c ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {countFor(c)}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <label htmlFor="blog-search" className="sr-only">
              Rechercher un article
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="blog-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un guide…"
              className="h-10 w-full rounded-xl border border-input bg-card pr-9 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute top-1/2 right-2.5 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Effacer la recherche"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Grille */}
        {list.length > 0 ? (
          <RevealGroup key={`${cat ?? "all"}-${n}`} className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((post) => (
              <RevealItem
                key={post.slug}
                as="article"
                className="card-hairline card-lift group relative flex flex-col overflow-hidden"
              >
                <Cover post={post} className="aspect-[16/10] border-b border-border" />
                <div className="flex flex-1 flex-col p-6">
                  <Meta post={post} />
                  <h2 className="mt-3 font-display text-lg leading-snug font-semibold">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="mt-auto flex items-center justify-between pt-5 text-xs">
                    <span className="rounded bg-cta-soft px-2 py-0.5 font-mono text-[10px] text-warm-foreground">
                      CONTENU EXEMPLE À REMPLACER
                    </span>
                    <ArrowUpRight
                      className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      aria-hidden
                    />
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          !featured && (
            <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
              <BookOpen className="mx-auto size-8 text-muted-foreground" aria-hidden />
              <p className="mt-4 font-display font-semibold">Aucun article ne correspond</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Essayez un autre mot-clé ou posez directement votre question à nos conseillers.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => { setQ(""); setCat(null); }}>
                  Réinitialiser
                </Button>
                <Button variant="cta" asChild>
                  <Link to="/contact">Poser une question</Link>
                </Button>
              </div>
            </div>
          )
        )}
      </section>

      <CtaBand
        title="Un projet d'équipement en tête ?"
        description="Nos conseillers transforment vos besoins en une sélection d'équipements adaptés, avec devis, installation et SAV."
      />
    </>
  );
}