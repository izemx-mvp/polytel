import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock,
  Link2,
  List,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs, CtaBand, SectionHeading } from "@/components/site/layout-primitives";
import { ProductCard, ProductMini } from "@/components/site/product-card";
import { ProductVisual } from "@/components/site/product-visual";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { WhatsAppIcon } from "@/components/site/icons";
import { getPost, posts } from "@/data/posts";
import { getProductById, type Product } from "@/data/products";
import { getCategory } from "@/data/categories";
import { buildWhatsAppLink, site } from "@/config/site";
import { articleLd, breadcrumbLd, jsonLdScript, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { slug: post.slug, title: post.title, excerpt: post.excerpt };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const post = getPost(loaderData.slug);
    if (!post) return {};
    return {
      ...pageHead({
        title: `${loaderData.title} | Blog Polytel`,
        description: loaderData.excerpt,
        path: `/blog/${loaderData.slug}`,
        type: "article",
      }),
      scripts: [
        jsonLdScript(articleLd(post)),
        jsonLdScript(
          breadcrumbLd([
            { name: "Accueil", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: loaderData.title, path: `/blog/${loaderData.slug}` },
          ]),
        ),
      ],
    };
  },
  component: ArticlePage,
});

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/* ---------------- Barre de progression de lecture ---------------- */

function ReadingProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-primary"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
      aria-hidden
    />
  );
}

/* ---------------- Partage ---------------- */

function Share({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : `/blog/${slug}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Lien copié");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copie impossible");
    }
  };

  const btn =
    "inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none";

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 font-mono text-[11px] text-muted-foreground">Partager</span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
        target="_blank"
        rel="noreferrer"
        className={btn}
        aria-label="Partager sur WhatsApp"
      >
        <WhatsAppIcon className="size-4" aria-hidden />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className={cn(btn, "font-display text-sm font-bold")}
        aria-label="Partager sur LinkedIn"
      >
        in
      </a>
      <button type="button" onClick={copy} className={btn} aria-label="Copier le lien">
        {copied ? <Check className="size-4 text-primary" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
      </button>
    </div>
  );
}

/* ---------------- Page ---------------- */

function ArticlePage() {
  const { slug } = Route.useParams();
  const post = getPost(slug);
  const ids = useMemo(() => post?.sections.map((s) => s.id) ?? [], [post]);
  const active = useActiveSection(ids);
  if (!post) return null;

  const related = post.relatedProductIds
    .map(getProductById)
    .filter((p): p is Product => Boolean(p));
  const cover = related[0];
  const coverHasImage = Boolean(cover?.images?.[0]);
  const universe = getCategory(post.universe);
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const calloutAfter = Math.min(1, post.sections.length - 1);

  return (
    <>
      <ReadingProgress />

      <header className="relative overflow-hidden border-b border-border bg-card">
        <div
          className="dot-grid-light pointer-events-none absolute inset-0"
          aria-hidden
          style={{ maskImage: "radial-gradient(60% 100% at 90% 0%, black, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 md:pb-16 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Accueil", to: "/" },
              { label: "Blog", to: "/blog" },
              { label: post.title },
            ]}
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="eyebrow text-primary">
                <span className="h-px w-6 bg-current opacity-60" aria-hidden />
                {post.category}
              </p>
              <h1 className="display-lg mt-4 text-balance">{post.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-ink-foreground">
                    P
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Équipe Polytel</p>
                    <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden>·</span>
                      <Clock className="size-3" aria-hidden />
                      {post.readingMinutes} min de lecture
                    </p>
                  </div>
                </div>
                <Share title={post.title} slug={post.slug} />
              </div>
              <span className="mt-6 inline-flex rounded bg-cta-soft px-2 py-0.5 font-mono text-[10px] text-warm-foreground">
                CONTENU EXEMPLE À REMPLACER
              </span>
            </div>
            <div className="lg:col-span-5">
              <div className="card-hairline product-surface group relative aspect-[4/3] overflow-hidden">
                {cover && coverHasImage ? (
                  <ProductVisual product={cover} priority width={560} height={420} className="size-full" imgClassName="p-10" />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <span className="inline-flex size-20 items-center justify-center rounded-3xl bg-blue-tint text-primary">
                      {universe ? <universe.icon className="size-9" aria-hidden /> : <BookOpen className="size-9" aria-hidden />}
                    </span>
                  </div>
                )}
                <div className="scan-head" aria-hidden />
                {cover && (
                  <span className="absolute bottom-4 left-4 rounded-full border border-border bg-card/90 px-2.5 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur">
                    {cover.reference}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-12 lg:px-8">
        {/* Sommaire */}
        <aside className="lg:col-span-3">
          {/* Mobile : repliable */}
          <details className="group rounded-xl border border-border bg-card lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-2">
                <List className="size-4 text-primary" aria-hidden />
                Sommaire
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">{post.sections.length} parties</span>
            </summary>
            <ol className="border-t border-border px-4 py-3">
              {post.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block py-1.5 text-sm text-muted-foreground hover:text-primary">
                    <span className="mr-2 font-mono text-[11px]">0{i + 1}</span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <nav aria-label="Sommaire" className="hidden lg:sticky lg:top-36 lg:block">
            <p className="eyebrow text-muted-foreground">Sommaire</p>
            <ol className="mt-4 space-y-1 border-l border-border">
              {post.sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={cn(
                      "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                      active === s.id
                        ? "border-primary font-medium text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="mr-2 font-mono text-[11px]">0{i + 1}</span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-8 border-t border-border pt-6">
              <Share title={post.title} slug={post.slug} />
            </div>
          </nav>
        </aside>

        {/* Article */}
        <article className="max-w-none lg:col-span-6">
          {post.sections.map((s, idx) => (
            <div key={s.id}>
              <section id={s.id} className="scroll-mt-36 pb-10">
                <p className="font-mono text-[11px] text-primary">Partie 0{idx + 1}</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-balance">{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={cn(
                      "mt-4 leading-relaxed text-foreground/85",
                      idx === 0 && i === 0 ? "text-lg font-medium text-foreground" : "text-[17px]",
                    )}
                  >
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mt-5 space-y-2.5 rounded-xl border border-border bg-card p-5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-[16px] text-foreground/85">
                        <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-tint text-primary">
                          <Check className="size-3" aria-hidden />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Encart produit */}
              {idx === calloutAfter && cover && (
                <Reveal className="mb-10">
                  <aside className="rounded-2xl border border-primary/25 bg-blue-tint/40 p-4">
                    <p className="mb-2 px-1 font-mono text-[10px] tracking-wider text-primary uppercase">
                      Équipement cité dans cet article
                    </p>
                    <div className="rounded-xl bg-card">
                      <ProductMini product={cover} />
                    </div>
                  </aside>
                </Reveal>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/blog" className="link-underline inline-flex items-center gap-2 text-sm font-medium text-primary">
              <ArrowLeft className="size-4" aria-hidden />
              Tous les articles
            </Link>
            <Share title={post.title} slug={post.slug} />
          </div>
        </article>

        {/* Conseil */}
        <aside className="lg:col-span-3">
          <div className="space-y-4 lg:sticky lg:top-36">
            <div className="crop-marks relative overflow-hidden rounded-2xl bg-ink p-6 text-ink-foreground">
              <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
              <div className="relative">
                <p className="font-mono text-[11px] tracking-wider text-ink-muted uppercase">Besoin d'un conseil ?</p>
                <p className="mt-3 font-display font-semibold">
                  Nos conseillers vous orientent vers l'équipement adapté.
                </p>
                <Button variant="cta" className="mt-5 w-full" asChild>
                  <Link to="/devis">Demander un devis</Link>
                </Button>
                <Button variant="ghost-dark" className="mt-2 w-full" asChild>
                  <a
                    href={buildWhatsAppLink(`Bonjour Polytel, j'ai lu « ${post.title} » et j'aimerais un conseil.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WhatsAppIcon aria-hidden />
                    WhatsApp
                  </a>
                </Button>
                <a href={site.phoneHref} className="mt-4 flex items-center justify-center gap-1.5 font-mono text-xs text-ink-muted hover:text-ink-foreground">
                  <Phone className="size-3.5" aria-hidden />
                  {site.phone}
                </a>
              </div>
            </div>
            {universe && (
              <Link
                to="/produits/$univers"
                params={{ univers: universe.slug }}
                className="card-hairline card-lift group flex items-center gap-3 p-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-tint text-primary">
                  <universe.icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-muted-foreground">Voir l'univers</span>
                  <span className="block truncate text-sm font-semibold">{universe.name}</span>
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden />
              </Link>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Produits associés" title="Les équipements cités" />
            <RevealGroup className="mt-10 grid gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <RevealItem key={p.id} className="h-full">
                  <ProductCard product={p} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="À lire aussi" title="Autres articles" />
            <Link to="/blog" className="link-underline hidden items-center gap-1.5 text-sm font-semibold text-primary sm:inline-flex">
              Tout le blog
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <RevealGroup as="ul" className="mt-8 grid gap-4 md:grid-cols-3">
            {others.map((p) => (
              <RevealItem as="li" key={p.slug} className="h-full">
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="card-hairline card-lift group flex h-full flex-col p-6 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <p className="eyebrow text-primary">{p.category}</p>
                  <p className="mt-3 font-display font-semibold text-balance group-hover:text-primary">{p.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                  <p className="mt-auto flex items-center justify-between pt-5 font-mono text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3" aria-hidden />
                      {p.readingMinutes} min
                    </span>
                    <ArrowUpRight className="size-4 transition-colors group-hover:text-primary" aria-hidden />
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      <CtaBand />
    </>
  );
}