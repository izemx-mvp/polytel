import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, type LegalSection } from "@/components/site/legal-layout";
import { site, TO_CONFIRM } from "@/config/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/mentions-legales")({
  head: () =>
    pageHead({
      title: "Mentions légales | Polytel",
      description: "Mentions légales du site polytel.ma : éditeur, hébergement, propriété intellectuelle et données personnelles.",
      path: "/mentions-legales",
    }),
  component: MentionsPage,
});

const agencies = site.agencies;
const casablanca = agencies[0];

const sections: LegalSection[] = [
  {
    id: "editeur",
    title: "Éditeur du site",
    body: [
      casablanca
        ? `${site.name} — siège : ${casablanca.address}, ${casablanca.postalCity}.`
        : `${site.name} — adresse du siège : ${TO_CONFIRM}.`,
      `Téléphone : ${site.phone} · E-mail : ${site.email}.`,
      `Forme juridique, capital social, RC, ICE, IF, patente : ${TO_CONFIRM}.`,
    ],
  },
  {
    id: "agences",
    title: "Agences",
    body: agencies.map((a) => `${a.city} : ${a.address}, ${a.postalCity} — ${a.phone}.`),
  },
  {
    id: "publication",
    title: "Directeur de la publication",
    body: [`Nom et fonction : ${TO_CONFIRM}.`],
  },
  {
    id: "hebergement",
    title: "Hébergement",
    body: [`Hébergeur du site (raison sociale, adresse, contact) : ${TO_CONFIRM}.`],
  },
  {
    id: "realisation",
    title: "Conception et réalisation",
    body: [`Agence : ${TO_CONFIRM}.`],
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle",
    body: [
      `Les contenus du site (textes, mises en page, éléments graphiques) sont la propriété de ${site.name}, sauf mention contraire. Toute reproduction sans autorisation préalable est interdite.`,
      "Les marques, logos et visuels des fabricants présentés sur ce site sont la propriété de leurs titulaires respectifs et sont utilisés dans le cadre de la distribution de leurs produits.",
    ],
  },
  {
    id: "informations",
    title: "Informations produits et prix",
    body: [
      "Les caractéristiques des produits sont fournies à titre indicatif et peuvent évoluer selon les fabricants. Seules les informations figurant sur le devis font foi.",
      "Aucun prix n'est affiché publiquement : les tarifs professionnels sont communiqués sur devis.",
    ],
  },
  {
    id: "donnees",
    title: "Données personnelles",
    body: [
      "Les informations saisies dans les formulaires (devis, contact, SAV, compte professionnel) servent uniquement à traiter votre demande et à vous recontacter. Elles ne sont ni vendues ni cédées à des tiers.",
      "Les formulaires préparent un message que vous envoyez vous-même via WhatsApp ou par e-mail : ces échanges sont alors soumis aux conditions de ces services.",
      "Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition, à exercer par e-mail à " +
        `${site.email}.`,
      `Numéro de déclaration ou d'autorisation CNDP : ${TO_CONFIRM}.`,
    ],
  },
  {
    id: "cookies",
    title: "Cookies et stockage local",
    body: [
      "Le site utilise le stockage local de votre navigateur pour conserver votre sélection de devis entre deux visites. Aucune donnée n'est transmise à cette occasion.",
      `Outils de mesure d'audience éventuels : ${TO_CONFIRM}.`,
    ],
  },
  {
    id: "liens",
    title: "Liens externes",
    body: [
      "Le site peut contenir des liens vers des sites tiers (fiches techniques des fabricants, réseaux sociaux). Polytel n'est pas responsable de leur contenu.",
    ],
  },
];

function MentionsPage() {
  return (
    <LegalLayout
      title="Mentions légales"
      intro="Informations relatives à l'éditeur, à l'hébergement et à l'utilisation du site polytel.ma. Texte provisoire, à faire valider par Polytel."
      updated={TO_CONFIRM}
      sections={sections}
    />
  );
}