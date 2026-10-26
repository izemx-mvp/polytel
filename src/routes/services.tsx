import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Camera,
  Check,
  ClipboardList,
  Cpu,
  Fingerprint,
  Hash,
  Mail,
  MessageSquareText,
  PackageCheck,
  Phone,
  Printer,
  Search,
  Send,
  ShieldCheck,
  Stethoscope,
  Store,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LeadSuccess, SelectField, TextareaField, TextField } from "@/components/site/form-fields";
import { fr, phoneRegex } from "@/lib/validation";
import { PageHero, SectionHeading } from "@/components/site/layout-primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { BrandLogo } from "@/components/site/brand-logo";
import { WhatsAppIcon } from "@/components/site/icons";
import { brands } from "@/data/brands";
import { buildWhatsAppLink, site } from "@/config/site";
import { submitLead, type LeadResult } from "@/lib/leads";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () =>
    pageHead({
      title: "Services & SAV — installation, maintenance, réparation multi-marques | Polytel",
      description:
        "Installation, contrat de maintenance (4 visites préventives par an), réparation multi-marques, garantie Brother en tant que Distributeur Agréé Maintenance & Services (DAMS), consommables et pièces d'origine.",
      path: "/services",
    }),
  component: ServicesPage,
});

/* ---------------- Données ---------------- */

const REQUEST_TYPES = [
  "Dépannage / réparation",
  "Contrat de maintenance",
  "Installation & mise en service",
  "Garantie Brother",
  "Consommables & pièces",
] as const;

const facts = [
  { k: "Assistance", v: "5j/7", sub: "Par téléphone" },
  { k: "E-mail", v: "24h/24", sub: "7j/7" },
  { k: "Maintenance", v: "4 visites", sub: "Préventives / an" },
  { k: "Brother", v: "DAMS", sub: "Distributeur agréé" },
];

const serviceCards = [
  {
    icon: ShieldCheck,
    title: "Dépannage & réparation multi-marques",
    text: "Copieurs, fax, imprimantes, multifonctions, PC et solutions point de vente : diagnostic et réparation par nos techniciens.",
    type: "Dépannage / réparation",
  },
  {
    icon: Wrench,
    title: "Installation & mise en service",
    text: "Livraison, installation, paramétrage et prise en main de vos équipements sur site.",
    type: "Installation & mise en service",
  },
  {
    icon: PackageCheck,
    title: "Consommables & pièces détachées",
    text: "Toners, cartouches, rubans et pièces d'origine constructeur.",
    type: "Consommables & pièces",
  },
] as const;

const equipment = [
  { icon: Printer, label: "Imprimantes & multifonctions" },
  { icon: Printer, label: "Copieurs" },
  { icon: Phone, label: "Télécopieurs" },
  { icon: Cpu, label: "PC & informatique" },
  { icon: Store, label: "Solutions point de vente" },
  { icon: Fingerprint, label: "Identification & étiquetage" },
];

const steps = [
  { icon: ClipboardList, title: "Demande", text: "Formulaire, téléphone, WhatsApp ou e-mail : décrivez l'équipement et la panne." },
  { icon: Stethoscope, title: "Diagnostic", text: "Nos techniciens qualifient l'intervention et vous informent." },
  { icon: Wrench, title: "Intervention", text: "Réparation sur site ou en atelier, avec des pièces d'origine." },
  { icon: Search, title: "Suivi", text: "Compte rendu et suivi de votre équipement dans la durée." },
];

const prepare = [
  { icon: Hash, text: "La référence ou le modèle (ex. DCP-T310)" },
  { icon: Fingerprint, text: "Le numéro de série, si possible" },
  { icon: MessageSquareText, text: "Les symptômes et messages d'erreur" },
  { icon: Camera, text: "Une photo de l'erreur, à envoyer sur WhatsApp" },
];

const brandOptions = [
  ...brands.map((b) => ({ value: b.name, label: b.name })),
  { value: "Autre marque", label: "Autre marque" },
];

const typeOptions = REQUEST_TYPES.map((t) => ({ value: t, label: t }));

const schema = z.object({
  type: z.string().min(1, fr.choose),
  societe: z.string().trim().min(2, "Indiquez le nom de votre société."),
  nom: z.string().trim().min(2, fr.name),
  telephone: z.string().trim().regex(phoneRegex, fr.phone),
  email: z.string().trim().email(fr.email),
  marque: z.string().min(1, fr.choose),
  modele: z.string().trim().min(2, "Indiquez la référence ou le modèle."),
  serie: z.string().trim().optional(),
  panne: z.string().trim().min(10, "Décrivez votre besoin en quelques mots (10 caractères minimum)."),
  ville: z.string().trim().min(2, fr.required),
});
type Values = z.infer<typeof schema>;

/** Sélectionne un type de demande et fait défiler jusqu'au formulaire. */
function goToForm(setType: (t: string) => void, type: string) {
  setType(type);
  requestAnimationFrame(() =>
    document.getElementById("sav")?.scrollIntoView({ behavior: "smooth", block: "start" }),
  );
}

/* ---------------- Formulaire ---------------- */

function SavForm({ defaultType }: { defaultType: string }) {
  const [result, setResult] = useState<LeadResult | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultType,
      societe: "",
      nom: "",
      telephone: "",
      email: "",
      marque: "",
      modele: "",
      serie: "",
      panne: "",
      ville: "",
    },
  });

  if (result) {
    return (
      <LeadSuccess
        result={result}
        title="Demande d'intervention enregistrée"
        description="Votre demande a été préparée et ouverte dans WhatsApp. Notre service technique revient vers vous pour planifier la suite."
        onReset={() => setResult(null)}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(async (v) => {
          const res = await submitLead({
            kind: "sav",
            fields: [
              { label: "Type de demande", value: v.type },
              { label: "Société", value: v.societe },
              { label: "Nom", value: v.nom },
              { label: "Téléphone", value: v.telephone },
              { label: "E-mail", value: v.email },
              { label: "Marque", value: v.marque },
              { label: "Référence / modèle", value: v.modele },
              { label: "Numéro de série", value: v.serie },
              { label: "Ville", value: v.ville },
              { label: "Description", value: v.panne },
            ],
          });
          setResult(res);
          form.reset();
          toast.success("Demande SAV préparée", { description: `N° ${res.reference}` });
        })}
        className="card-hairline overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border bg-background/60 px-6 py-4 sm:px-8">
          <p className="font-display font-semibold">Demande d'intervention</p>
          <span className="font-mono text-[11px] text-muted-foreground">* champs obligatoires</span>
        </div>
        <div className="space-y-6 p-6 sm:p-8">
          <fieldset className="space-y-5">
            <legend className="eyebrow mb-4 text-muted-foreground">1 · Votre demande</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField control={form.control} name="type" label="Type de demande" options={typeOptions} required />
              <SelectField control={form.control} name="marque" label="Marque" options={brandOptions} required />
              <TextField control={form.control} name="modele" label="Référence / modèle" placeholder="ex. DCP-T310" required />
              <TextField control={form.control} name="serie" label="Numéro de série" />
            </div>
            <TextareaField
              control={form.control}
              name="panne"
              label="Description"
              placeholder="Symptômes, messages d'erreur, fréquence, nombre d'équipements…"
              required
            />
          </fieldset>
          <fieldset className="space-y-5 border-t border-border pt-6">
            <legend className="eyebrow mb-4 text-muted-foreground">2 · Vos coordonnées</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={form.control} name="societe" label="Société" autoComplete="organization" required />
              <TextField control={form.control} name="nom" label="Nom et prénom" autoComplete="name" required />
              <TextField control={form.control} name="telephone" label="Téléphone" type="tel" autoComplete="tel" required />
              <TextField control={form.control} name="email" label="E-mail" type="email" autoComplete="email" required />
              <TextField control={form.control} name="ville" label="Ville" autoComplete="address-level2" required />
            </div>
          </fieldset>
        </div>
        <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-border bg-background/60 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
          <p className="text-xs text-muted-foreground">
            La demande s'ouvre dans WhatsApp, prête à être envoyée.
          </p>
          <Button type="submit" variant="cta" size="xl" disabled={form.formState.isSubmitting}>
            <Send aria-hidden />
            Envoyer la demande
          </Button>
        </div>
      </form>
    </Form>
  );
}

/* ---------------- Contrat de maintenance : année en 4 visites ---------------- */

function MaintenanceYear() {
  const reduced = useReducedMotion();
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const visits = [1, 4, 7, 10]; // index de mois (repère visuel, planning réel défini au contrat)

  return (
    <div className="card-hairline p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          Une année de maintenance
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-tint px-2.5 py-1 text-xs font-semibold text-primary">
          <CalendarCheck className="size-3.5" aria-hidden />4 visites / an
        </span>
      </div>
      <div className="relative mt-10">
        <div className="h-1.5 rounded-full bg-muted" aria-hidden />
        <motion.div
          className="absolute top-0 left-0 h-1.5 rounded-full bg-primary"
          initial={reduced ? false : { width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          aria-hidden
        />
        {visits.map((m, i) => (
          <motion.div
            key={m}
            className="absolute -top-[18px] -translate-x-1/2"
            style={{ left: `${((m + 0.5) / 12) * 100}%` }}
            initial={reduced ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.35 + i * 0.4, type: "spring", stiffness: 260, damping: 18 }}
          >
            <span className="flex size-10 items-center justify-center rounded-full border-4 border-card bg-cta text-cta-foreground shadow-soft">
              <Wrench className="size-4" aria-hidden />
            </span>
          </motion.div>
        ))}
        <div className="mt-6 grid grid-cols-12 text-center font-mono text-[10px] text-muted-foreground" aria-hidden>
          {months.map((m, i) => (
            <span key={i} className={cn(visits.includes(i) && "font-semibold text-foreground")}>
              {m}
            </span>
          ))}
        </div>
      </div>
      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {[
          "Entretien préventif",
          "Contrôle et nettoyage",
          "Anticipation des pannes",
          "Planning défini au contrat",
        ].map((t) => (
          <li key={t} className="flex items-center gap-2 text-sm">
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-tint text-primary">
              <Check className="size-3" aria-hidden />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Page ---------------- */

function ServicesPage() {
  const [type, setType] = useState<string>(REQUEST_TYPES[0]);
  const reduced = useReducedMotion();

  return (
    <>
      <PageHero
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Services & SAV" }]}
        eyebrow="Services & SAV"
        title="Polytel est à vos côtés, avant et après l'achat."
        description="Installation, maintenance, réparation et consommables d'origine : une équipe technique au service de votre parc, partout au Maroc."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="cta" size="xl" onClick={() => goToForm(setType, REQUEST_TYPES[0])}>
            Demander une intervention
            <ArrowRight aria-hidden />
          </Button>
          <Button variant="ghost-dark" size="xl" asChild>
            <a href={site.phoneHref}>
              <Phone aria-hidden />
              {site.phone}
            </a>
          </Button>
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-border bg-ink-border lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.k} className="bg-ink-card px-5 py-4">
              <dt className="font-mono text-[10px] tracking-wider text-ink-muted uppercase">{f.k}</dt>
              <dd className="mt-1 font-display text-2xl font-bold">{f.v}</dd>
              <dd className="text-xs text-ink-muted">{f.sub}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Services — bento */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading
          eyebrow="Nos services"
          title="Une prise en charge complète de votre parc"
          description="Un seul interlocuteur pour installer, entretenir et réparer vos équipements, toutes marques confondues."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {/* DAMS Brother — carte vedette */}
          <Reveal className="lg:col-span-5 lg:row-span-2">
            <article className="crop-marks relative flex h-full flex-col overflow-hidden rounded-2xl bg-ink p-7 text-ink-foreground sm:p-8">
              <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
              <div className="relative flex items-center justify-between gap-4">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white/10 text-cta">
                  <BadgeCheck className="size-6" aria-hidden />
                </span>
                <span className="inline-flex h-10 items-center rounded-lg bg-white px-3">
                  <BrandLogo slug="brother" size="sm" className="max-h-5" />
                </span>
              </div>
              <h3 className="relative mt-8 font-display text-2xl font-semibold text-balance">
                Garantie Brother — Distributeur Agréé Maintenance & Services
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-ink-muted">
                Certifié DAMS, Polytel répond aux exigences de Brother en matière de maintenance et
                de services, avec un personnel formé : garantie, réparation, maintenance,
                installation et mise en service des produits Brother.
              </p>
              <ul className="relative mt-6 space-y-2.5">
                {["Garantie constructeur Brother", "Réparation & maintenance", "Installation & mise en service"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-sm">
                    <Check className="size-4 text-cta" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="relative mt-auto pt-8">
                <Button variant="cta" size="lg" onClick={() => goToForm(setType, "Garantie Brother")}>
                  Demande sous garantie Brother
                  <ArrowRight aria-hidden />
                </Button>
              </div>
            </article>
          </Reveal>

          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:row-span-2 lg:grid-cols-2">
            {serviceCards.map((s, i) => (
              <RevealItem key={s.title} className={cn("h-full", i === 0 && "sm:col-span-2")}>
                <button
                  type="button"
                  onClick={() => goToForm(setType, s.type)}
                  className="card-hairline card-lift group flex h-full w-full flex-col p-7 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-tint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <s.icon className="size-6" aria-hidden />
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-primary">
                    Faire une demande
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </button>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Contrat de maintenance */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Contrat de maintenance"
              title="Un parc fiable toute l'année"
              description="Dans le cadre d'un contrat préétabli, nos techniciens réalisent 4 visites préventives par an pour entretenir vos équipements et anticiper les pannes."
            />
            <Reveal delay={0.08} className="mt-8">
              <Button variant="cta" size="xl" onClick={() => goToForm(setType, "Contrat de maintenance")}>
                Demander un contrat
                <ArrowRight aria-hidden />
              </Button>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-7">
            <MaintenanceYear />
          </Reveal>
        </div>
      </section>

      {/* Équipements & marques couverts */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading
          eyebrow="Multi-marques"
          title="Les équipements que nous prenons en charge"
          align="center"
        />
        <RevealGroup as="ul" className="mt-10 flex flex-wrap justify-center gap-2.5">
          {equipment.map((e) => (
            <RevealItem as="li" key={e.label}>
              <span className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium">
                <e.icon className="size-4 text-primary" aria-hidden />
                {e.label}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-12">
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {brands.slice(0, 12).map((b) => (
              <li key={b.slug} className="card-hairline flex h-16 items-center justify-center px-4">
                <BrandLogo slug={b.slug} size="sm" reveal className="max-h-6" />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Canaux d'assistance */}
      <section className="crop-marks relative overflow-hidden bg-ink py-20 text-ink-foreground md:py-28">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="Assistance" title="Joignez notre service technique" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Reveal className="flex flex-col rounded-2xl border border-ink-border bg-ink-card p-7">
              <Phone className="size-6 text-cta" aria-hidden />
              <h3 className="mt-5 font-display text-xl font-semibold">Assistance téléphonique</h3>
              <p className="mt-1 text-sm text-ink-muted">5j/7 — horaires À CONFIRMER</p>
              <div className="mt-auto flex flex-col gap-2 pt-6">
                {site.agencies.map((a) => (
                  <Button key={a.city} variant="ghost-dark" className="justify-between" asChild>
                    <a href={a.phoneHref}>
                      <span>{a.city}</span>
                      <span className="font-mono text-xs">{a.phone}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.06} className="flex flex-col rounded-2xl border border-ink-border bg-ink-card p-7">
              <WhatsAppIcon className="size-6 text-whatsapp" aria-hidden />
              <h3 className="mt-5 font-display text-xl font-semibold">WhatsApp</h3>
              <p className="mt-1 text-sm text-ink-muted">Envoyez une photo du message d'erreur.</p>
              <div className="mt-auto pt-6">
                <Button variant="ghost-dark" className="w-full" asChild>
                  <a
                    href={buildWhatsAppLink("Bonjour Polytel, j'ai besoin d'une intervention SAV pour : …")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Écrire sur WhatsApp
                  </a>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.12} className="flex flex-col rounded-2xl border border-ink-border bg-ink-card p-7">
              <Mail className="size-6 text-cta" aria-hidden />
              <h3 className="mt-5 font-display text-xl font-semibold">Assistance par e-mail</h3>
              <p className="mt-1 text-sm text-ink-muted">24h/24, 7j/7</p>
              <div className="mt-auto pt-6">
                <Button variant="cta" className="w-full" asChild>
                  <a href={`${site.emailHref}?subject=${encodeURIComponent("Demande SAV")}`}>
                    Écrire à {site.email}
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading eyebrow="Processus" title="Comment se déroule une intervention ?" />
        <div className="relative mt-14">
          <div className="absolute top-6 right-[12%] left-[12%] hidden h-px bg-border md:block" aria-hidden>
            <motion.div
              className="h-full origin-left bg-primary"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          </div>
          <RevealGroup as="ul" className="relative grid gap-8 md:grid-cols-4 md:gap-6">
            {steps.map((s, i) => (
              <RevealItem as="li" key={s.title} className="relative flex gap-5 md:block">
                {i < steps.length - 1 && (
                  <span className="absolute top-12 bottom-[-2rem] left-6 w-px bg-border md:hidden" aria-hidden />
                )}
                <span className="relative z-10 inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary shadow-soft">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-mono text-[11px] text-muted-foreground md:mt-5">Étape 0{i + 1}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Formulaire SAV */}
      <section id="sav" className="scroll-mt-36 border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                eyebrow="Formulaire SAV"
                title="Demande d'intervention"
                description="Plus votre description est précise, plus le diagnostic est rapide."
              />
              <Reveal delay={0.06} className="mt-8 rounded-2xl border border-border bg-background p-5">
                <p className="font-display text-sm font-semibold">À préparer avant d'envoyer</p>
                <ul className="mt-4 space-y-3">
                  {prepare.map((p) => (
                    <li key={p.text} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <p.icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      {p.text}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1} className="mt-4 flex flex-wrap gap-2">
                {site.agencies.map((a) => (
                  <a
                    key={a.city}
                    href={a.phoneHref}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    <Phone className="size-3.5" aria-hidden />
                    {a.city} · {a.phone}
                  </a>
                ))}
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-8">
            <SavForm key={type} defaultType={type} />
          </div>
        </div>
      </section>
    </>
  );
}