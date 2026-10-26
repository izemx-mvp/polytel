import { createFileRoute } from "@tanstack/react-router";
import { allUniverses } from "@/data/categories";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import { posts } from "@/data/posts";
import { absoluteUrl } from "@/config/site";

const staticPaths = [
  "/",
  "/produits",
  "/promotions",
  "/destockage",
  "/marques",
  "/espace-couture",
  "/services",
  "/a-propos",
  "/catalogues",
  "/blog",
  "/contact",
  "/cgv",
  "/mentions-legales",
];

function buildSitemap(): string {
  const paths = [
    ...staticPaths,
    ...allUniverses
      .filter((u) => u.slug !== "espace-couture")
      .flatMap((u) => [
        `/produits/${u.slug}`,
        ...u.subcategories.map((s) => `/produits/${u.slug}/${s.slug}`),
      ]),
    ...allUniverses
      .filter((u) => u.slug === "espace-couture")
      .flatMap((u) => u.subcategories.map((s) => `/produits/${u.slug}/${s.slug}`)),
    ...brands.map((b) => `/marques/${b.slug}`),
    // Les fiches exemples (placeholder) sont exclues de l'indexation.
    ...products.filter((p) => !p.placeholder).map((p) => `/produit/${p.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];
  const urls = paths.map((p) => `  <url><loc>${absoluteUrl(p)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemap(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
