import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Armchair,
  BadgeCheck,
  Handshake,
  Monitor,
  Network,
  PackageCheck,
  Printer,
  Quote,
  Tv,
  UserRound,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgencyCard } from "@/components/site/agency-card";
import { BrandMarquee } from "@/components/site/brand-marquee";
import { CtaBand, PageHero, SectionHeading } from "@/components/site/layout-primitives";
import { CountUp, Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { site, TO_CONFIRM } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/a-propos")({
  head: () =>
    pageHead({
      title: "Qui sommes-nous — Polytel, importateur grossiste fondé en 1990",
      description:
        "Créée en 1990, Polytel est importateur, grossiste et distributeur de Brother au Maroc et de grandes marques informatiques : copieurs, imprimantes, multifonctions, PC, fournitures et solutions point de vente.",
      path: "/a-propos",
    }),
  component: AboutPage,
});

const timeline = [
  { year: "1990", title: "Création de Polytel", text: "Fondation à Casablanca : importation et distribution de matériel bureautique.", confirmed: true },
  { year: TO_CONFIRM, title: "Diversification du catalogue", text: "Informatique, solutions point de vente, mobilier et fournitures de bureau.", confirmed: false },
  { year: TO_CONFIRM, title: "Ouverture de l'agence d'Agadir", text: "Un second point de présence pour le sud du Royaume.", confirmed: false },
  { year: TO_CONFIRM, title: "Certification DAMS Brother", text: "Distributeur Agréé Maintenance & Services Brother.", confirmed: false },
  { year: "Aujourd'hui", title: "Plus de 35 marques partenaires", text: "Un réseau de distribution national, deux agences, un service technique multi-marques.", confirmed: true },
];

const activities = [
  { icon: Monitor, title: "Matériel informatique", text: "Ordinateurs, terminaux, périphériques, consommables et accessoires." },
  { icon: Printer, title: "Matériel bureautique", text: "Copieurs, imprimantes, multifonctions, télécopieurs, étiqueteuses, destructeurs." },
  { icon: Tv, title: "Audiovisuel", text: "Vidéoprojection, affichage dynamique, sonorisation." },
  { icon: Armchair, title: "Mobilier de bureau", text: "Bureaux, comptoirs, tables de réunion, fauteuils, armoires." },
  { icon: Network, title: "Télécommunication & réseau", text: "Standards téléphoniques, installation réseau et périphériques." },
];

const pillars = [
  { icon: PackageCheck, title: "Produits d'origine", text: "Tous nos produits sont exclusivement d'origine, issus du circuit officiel des marques." },
  { icon: Handshake, title: "One Stop Shopping", text: "Un interlocuteur unique pour plus de 35 marques leaders, du matériel aux consommables." },
  { icon: Wrench, title: "Service avant & après-vente", text: "Installation, entretien, maintenance et réparation par nos équipes techniques." },
];

/* ---------------- Frise ---------------- */

function Timeline() {
  const reduced = useReducedMotion();
  return (
    <div className="relative mt-14">
      {/* Ligne (desktop) */}
      <div className="absolute top-[22px] right-0 left-0 hidden h-px bg-border md:block" aria-hidden>
        <motion.div
          className="h-full origin-left bg-primary"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </div>
      <RevealGroup as="ul" className="relative grid gap-8 md:grid-cols-5 md:gap-4">
        {timeline.map((t, i) => (
          <RevealItem as="li" key={`${t.title}-${i}`} className="relative flex gap-5 md:block">
            {i < timeline.length - 1 && (
              <span className="absolute top-11 bottom-[-2rem] left-[21px] w-px bg-border md:hidden" aria-hidden />
            )}
            <span
              className={cn(
                "relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full border-4 border-card shadow-soft",
                t.confirmed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              <span className="size-2.5 rounded-full bg-current" />
            </span>
            <div className="md:mt-6">
              <p
                className={
                  t.confirmed
                    ? "font-display text-2xl font-bold text-primary"
                    : "inline-flex rounded-md bg-cta-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-warm-foreground"
                }
              >
                {t.year}
              </p>
              <p className="mt-3 font-display font-semibold">{t.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

/* ---------------- Page ---------------- */

function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Qui sommes-nous" }]}
        eyebrow="Fondée en 1990"
        title="Plus de 35 ans d'expertise au service de l'équipement professionnel"
        description="Importateur, grossiste et distributeur de Brother au Maroc et de grandes marques informatiques, Polytel accompagne entreprises, administrations et revendeurs."
        aside={
          <div className="grid grid-cols-2 gap-3">
            {[
              { v: String(site.foundedYear), l: "Année de création" },
              { v: <CountUp to={35} suffix="+" />, l: "Marques partenaires" },
              { v: <CountUp to={site.agencies.length} />, l: "Agences" },
              { v: "100 %", l: "Produits d'origine" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-ink-border bg-ink-card p-5">
                <p className="font-display text-4xl font-bold tracking-tight">{s.v}</p>
                <p className="mt-1 text-xs text-ink-muted">{s.l}</p>
              </div>
            ))}
          </div>
        }
      />

      {/* Histoire */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Notre histoire" title="Un spécialiste de l'équipement de bureau" />
          <Reveal delay={0.06} className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-tint text-primary">
              <BadgeCheck className="size-5" aria-hidden />
            </span>
            <span className="text-sm">
              <span className="block font-semibold">Importateur officiel Brother</span>
              <span className="block text-muted-foreground">Distributeur Agréé Maintenance & Services</span>
            </span>
          </Reveal>
        </div>
        <Reveal className="space-y-5 text-lg leading-relaxed text-muted-foreground lg:col-span-7">
          <p className="text-xl leading-relaxed text-foreground">
            Créée en <strong>1990</strong>, Polytel est importateur, grossiste et distributeur de{" "}
            <strong>Brother</strong> au Maroc ainsi que de grandes marques informatiques.
          </p>
          <p>
            Spécialiste des copieurs, télécopieurs, imprimantes, multifonctions, PC, fournitures de
            bureau et solutions point de vente, Polytel couvre l'ensemble du cycle de vie de vos
            équipements : matériel, consommables, pièces détachées et maintenance.
          </p>
          <p>
            Avec plus de 35 marques partenaires et un réseau de distribution couvrant tout le
            Royaume, nous accompagnons nos clients de la sélection du matériel jusqu'à son entretien.
          </p>
        </Reveal>
      </section>

      {/* Piliers */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <RevealGroup className="grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <RevealItem key={p.title} className="card-hairline card-lift h-full p-7">
              <div className="flex items-center justify-between">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-tint text-primary">
                  <p.icon className="size-6" aria-hidden />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Frise */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading eyebrow="Repères" title="De 1990 à aujourd'hui" description="Les dates intermédiaires sont à confirmer avec Polytel." />
          <Timeline />
        </div>
      </section>

      {/* Activités */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading eyebrow="Nos activités" title="Cinq domaines d'expertise" />
        <RevealGroup className="mt-12 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-5">
          {activities.map((a, i) => (
            <RevealItem key={a.title} className="card-hairline card-lift group h-full p-6">
              <div className="flex items-start justify-between">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-tint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <a.icon className="size-5" aria-hidden />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-display font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-10 flex justify-center">
          <Button variant="outline" size="xl" asChild>
            <Link to="/produits">
              Explorer le catalogue
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* Marques */}
      <section className="border-t border-border bg-card py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Partenaires" title="Plus de 35 marques d'origine" align="center" />
        </div>
        <Reveal className="mt-10">
          <BrandMarquee />
        </Reveal>
      </section>

      {/* Mot du président */}
      <section className="crop-marks relative overflow-hidden bg-ink py-20 text-ink-foreground md:py-28">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <p
          className="pointer-events-none absolute -right-6 -bottom-16 font-display text-[18rem] leading-none font-bold text-white/[0.03] select-none"
          aria-hidden
        >
          “
        </p>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow text-cta">Mot du président</p>
            <Quote className="mt-8 size-10 text-cta" aria-hidden />
            <blockquote className="mt-4 font-display text-2xl leading-snug font-medium text-balance md:text-3xl">
              « Depuis plus de trente ans, Polytel bâtit des partenariats durables — plus de 35
              marques aujourd'hui — et un réseau de distribution couvrant tout le Royaume. Notre
              engagement reste le même : la qualité du service, avant comme après la vente. »
            </blockquote>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="inline-flex size-14 items-center justify-center rounded-full border border-dashed border-ink-border bg-ink-card text-ink-muted" aria-hidden>
                <UserRound className="size-6" />
              </span>
              <div>
                <p className="font-semibold">Nom du président — {TO_CONFIRM}</p>
                <p className="text-sm text-ink-muted">Président de Polytel · photo {TO_CONFIRM}</p>
              </div>
              <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                Message adapté du site actuel — à valider
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Agences */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading eyebrow="Nos agences" title="Casablanca & Agadir" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {site.agencies.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.06}>
              <AgencyCard agency={a} primary={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}