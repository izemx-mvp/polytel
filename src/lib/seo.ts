/**
 * Helpers SEO pour l'API head de TanStack Start : meta, Open Graph, canonical, JSON-LD.
 */
import { absoluteUrl, site } from "@/config/site";
import type { Agency } from "@/config/site";
import type { Product } from "@/data/products";
import { getBrandName } from "@/data/brands";
import type { Post } from "@/data/posts";

export const TITLE_SUFFIX = "| Polytel Maroc";

export interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: string | undefined;
  type?: "website" | "article" | "product";
  noindex?: boolean;
}

export function pageHead({
  title,
  description,
  path,
  image,
  type = "website",
  noindex,
}: PageMetaInput) {
  const fullTitle = title.includes("Polytel") ? title : `${title} ${TITLE_SUFFIX}`;
  const url = absoluteUrl(path);
  const meta = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: type === "product" ? "product" : type },
    { property: "og:locale", content: "fr_MA" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  }
  if (noindex) meta.push({ name: "robots", content: "noindex, follow" });
  return { meta, links: [{ rel: "canonical", href: url }] };
}

export function jsonLdScript(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    foundingDate: String(site.foundedYear),
    description: site.description,
    email: site.email,
    telephone: site.phone,
    sameAs: [
      site.socials.facebook,
      site.socials.instagram,
      site.socials.linkedin,
      site.socials.twitter,
    ],
  };
}

export function localBusinessLd(agency: Agency) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#agence-${agency.slug}`,
    name: `${site.name} — Agence ${agency.city}`,
    parentOrganization: { "@id": `${site.url}/#organization` },
    url: site.url,
    telephone: agency.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: agency.address,
      addressLocality: agency.city,
      addressCountry: "MA",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.reference,
    mpn: p.reference,
    brand: { "@type": "Brand", name: getBrandName(p.brand) },
    description: p.shortDescription,
    image: p.images,
    url: absoluteUrl(`/produit/${p.slug}`),
  };
}

export function articleLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: "fr",
    author: { "@type": "Organization", name: site.name },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}
