import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it.each([
    "/",
    "/produits",
    "/produits/impression",
    "/produits/impression/multifonctions",
    "/produit/brother-dcp-t310",
    "/promotions",
    "/destockage",
    "/devis",
    "/services",
    "/marques",
    "/marques/brother",
    "/espace-couture",
    "/a-propos",
    "/catalogues",
    "/blog",
    "/blog/bien-choisir-sa-caisse-enregistreuse-en-2026",
    "/connexion",
    "/contact",
    "/cgv",
    "/mentions-legales",
    "/sitemap.xml",
  ])("matches a page for %s instead of falling back to not found", (path) => {
    const matches = router.matchRoutes(path);
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
