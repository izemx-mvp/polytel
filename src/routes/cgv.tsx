import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, type LegalSection } from "@/components/site/legal-layout";
import { site, TO_CONFIRM } from "@/config/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/cgv")({
  head: () =>
    pageHead({
      title: "Conditions générales de vente | Polytel",
      description:
        "Conditions générales de vente de Polytel : devis, commandes, prix professionnels, livraison, paiement, garantie et service après-vente.",
      path: "/cgv",
    }),
  component: CgvPage,
});

const sections: LegalSection[] = [
  {
    id: "objet",
    title: "Objet et champ d'application",
    body: [
      `Les présentes conditions générales de vente régissent les ventes de matériel, de consommables et les prestations de services réalisées par ${site.name} auprès de ses clients (entreprises, revendeurs, administrations et particuliers).`,
      "Toute commande implique l'acceptation des présentes conditions, sauf conditions particulières convenues par écrit.",
      `Texte provisoire — à faire valider par Polytel (${TO_CONFIRM}).`,
    ],
  },
  {
    id: "devis-commandes",
    title: "Devis et commandes",
    body: [
      "Toute commande fait l'objet d'un devis préalable établi par nos services commerciaux, sur la base des produits, quantités et prestations demandés.",
      "La commande devient ferme après acceptation écrite du devis par le client.",
      `Durée de validité des devis : ${TO_CONFIRM}.`,
    ],
  },
  {
    id: "prix",
    title: "Prix",
    body: [
      "Les prix sont réservés aux professionnels et communiqués sur devis, en dirhams marocains hors taxes (MAD HT). La TVA applicable est ajoutée au taux en vigueur.",
      "Les prestations annexes (livraison, installation, mise en service, formation) sont précisées sur le devis.",
    ],
  },
  {
    id: "disponibilite",
    title: "Disponibilité des produits",
    body: [
      "Les produits sont proposés dans la limite des stocks disponibles. Les articles en destockage ou en promotion sont disponibles en quantités limitées.",
      "La disponibilité et le délai sont confirmés sur le devis.",
    ],
  },
  {
    id: "livraison",
    title: "Livraison et installation",
    body: [
      `Zones, modalités et délais de livraison : ${TO_CONFIRM}.`,
      `Modalités d'installation et de mise en service : ${TO_CONFIRM}.`,
      `Transfert des risques et réserve de propriété : ${TO_CONFIRM}.`,
    ],
  },
  {
    id: "paiement",
    title: "Conditions de paiement",
    body: [
      `Moyens de paiement acceptés, acompte éventuel et échéances : ${TO_CONFIRM}.`,
      `Pénalités en cas de retard de paiement : ${TO_CONFIRM}.`,
    ],
  },
  {
    id: "garantie",
    title: "Garantie",
    body: [
      "Les produits sont 100 % d'origine et bénéficient de la garantie constructeur. Les conditions détaillées sont précisées pour chaque produit sur le devis.",
      "En tant que Distributeur Agréé Maintenance & Services (DAMS) Brother, Polytel assure la garantie, la réparation et la maintenance des produits Brother.",
      `Durées de garantie par marque et produit, exclusions (usure, mauvaise utilisation, consommables non d'origine…) : ${TO_CONFIRM}.`,
    ],
  },
  {
    id: "sav",
    title: "Service après-vente et maintenance",
    body: [
      "Les demandes d'intervention peuvent être transmises par téléphone (assistance 5j/7), par e-mail ou via le formulaire SAV du site.",
      "Des contrats de maintenance incluant 4 visites préventives par an peuvent être souscrits ; leurs conditions sont définies au contrat.",
    ],
  },
  {
    id: "retours",
    title: "Retours et réclamations",
    body: [`Délai et conditions de réclamation, modalités de retour : ${TO_CONFIRM}.`],
  },
  {
    id: "force-majeure",
    title: "Force majeure",
    body: [
      "Polytel ne saurait être tenue responsable de l'inexécution de ses obligations en cas de force majeure ou d'événement indépendant de sa volonté.",
    ],
  },
  {
    id: "litiges",
    title: "Droit applicable et litiges",
    body: [
      "En cas de différend, les parties rechercheront en priorité une solution amiable.",
      `Droit applicable et juridiction compétente : ${TO_CONFIRM}.`,
    ],
  },
];

function CgvPage() {
  return (
    <LegalLayout
      title="Conditions générales de vente"
      intro="Conditions applicables aux ventes de matériel, de consommables et aux prestations de services réalisées par Polytel. Texte provisoire, à faire valider par Polytel."
      updated={TO_CONFIRM}
      sections={sections}
    />
  );
}