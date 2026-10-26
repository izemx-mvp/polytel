import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  FileText,
  Handshake,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Printer,
  Send,
  UserPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ChoiceField, LeadSuccess, TextareaField, TextField } from "@/components/site/form-fields";
import { fr, phoneRegex } from "@/lib/validation";
import { PageHero, SectionHeading } from "@/components/site/layout-primitives";
import { AgencyCard } from "@/components/site/agency-card";
import { WhatsAppIcon } from "@/components/site/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives";
import { buildWhatsAppLink, site } from "@/config/site";
import { submitLead, type LeadResult } from "@/lib/leads";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact — agences Polytel Casablanca & Agadir",
      description:
        "Contactez Polytel : agence de Casablanca (10-15, Rue Allal El Fassi) et d'Agadir, téléphone (+212) 5 22 27 47 55, e-mail polytel@menara.ma, WhatsApp.",
      path: "/contact",
    }),
  component: ContactPage,
});

/* ---------------- Données ---------------- */

const SUBJECTS = ["Devis", "SAV", "Partenariat", "Autre"] as const;
type Subject = (typeof SUBJECTS)[number];
const subjects = SUBJECTS.map((s) => ({ value: s, label: s }));

const schema = z.object({
  nom: z.string().trim().min(2, fr.name),
  societe: z.string().trim().optional(),
  telephone: z.string().trim().regex(phoneRegex, fr.phone),
  email: z.string().trim().email(fr.email),
  sujet: z.enum(SUBJECTS, { errorMap: () => ({ message: fr.choose }) }),
  message: z.string().trim().min(10, fr.message),
});
type Values = z.infer<typeof schema>;

type Intent =
  | { icon: LucideIcon; title: string; text: string; cta: string; to: "/devis" | "/services" | "/connexion" }
  | { icon: LucideIcon; title: string; text: string; cta: string; subject: Subject };

const intents: Intent[] = [
  {
    icon: FileText,
    title: "Obtenir un devis",
    text: "Composez votre sélection de produits et recevez une offre professionnelle.",
    cta: "Composer mon devis",
    to: "/devis",
  },
  {
    icon: Wrench,
    title: "Intervention SAV",
    text: "Panne, maintenance, garantie Brother : notre service technique prend le relais.",
    cta: "Demander une intervention",
    to: "/services",
  },
  {
    icon: UserPlus,
    title: "Compte professionnel",
    text: "Revendeurs et entreprises : accédez aux conditions professionnelles.",
    cta: "Créer mon compte pro",
    to: "/connexion",
  },
  {
    icon: Handshake,
    title: "Partenariat",
    text: "Marques, revendeurs, intégrateurs : parlons d'une collaboration.",
    cta: "Nous écrire",
    subject: "Partenariat",
  },
];

/* ---------------- Utilitaires ---------------- */

function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          toast.success(`${label} copié`);
          window.setTimeout(() => setDone(false), 1800);
        } catch {
          toast.error("Copie impossible");
        }
      }}
      className="relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      aria-label={`Copier ${label}`}
    >
      {done ? <Check className="size-3.5 text-primary" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
    </button>
  );
}

function scrollToForm() {
  requestAnimationFrame(() =>
    document.getElementById("formulaire")?.scrollIntoView({ behavior: "smooth", block: "start" }),
  );
}

/* ---------------- Formulaire ---------------- */

function ContactForm({ defaultSubject }: { defaultSubject?: Subject }) {
  const [result, setResult] = useState<LeadResult | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: "",
      societe: "",
      telephone: "",
      email: "",
      message: "",
      ...(defaultSubject ? { sujet: defaultSubject } : {}),
    },
  });

  if (result) {
    return (
      <LeadSuccess
        result={result}
        title="Message prêt à être envoyé"
        description="Votre message a été mis en forme et ouvert dans WhatsApp. Nos équipes vous répondent rapidement."
        onReset={() => setResult(null)}
        resetLabel="Nouveau message"
      />
    );
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(async (v) => {
          const res = await submitLead({
            kind: "contact",
            fields: [
              { label: "Sujet", value: v.sujet },
              { label: "Nom", value: v.nom },
              { label: "Société", value: v.societe },
              { label: "Téléphone", value: v.telephone },
              { label: "E-mail", value: v.email },
              { label: "Message", value: v.message },
            ],
          });
          setResult(res);
          form.reset();
          toast.success("Message préparé", { description: `N° ${res.reference}` });
        })}
        className="card-hairline overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border bg-background/60 px-6 py-4 sm:px-8">
          <p className="inline-flex items-center gap-2 font-display font-semibold">
            <MessageSquare className="size-4 text-primary" aria-hidden />
            Votre message
          </p>
          <span className="font-mono text-[11px] text-muted-foreground">* champs obligatoires</span>
        </div>
        <div className="space-y-5 p-6 sm:p-8">
          <ChoiceField control={form.control} name="sujet" label="Sujet" options={subjects} required />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={form.control} name="nom" label="Nom et prénom" autoComplete="name" required />
            <TextField control={form.control} name="societe" label="Société" autoComplete="organization" />
            <TextField control={form.control} name="telephone" label="Téléphone" type="tel" autoComplete="tel" required />
            <TextField control={form.control} name="email" label="E-mail" type="email" autoComplete="email" required />
          </div>
          <TextareaField
            control={form.control}
            name="message"
            label="Message"
            placeholder="Votre besoin, les références concernées, les quantités…"
            required
          />
        </div>
        <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-border bg-background/60 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
          <p className="text-xs text-muted-foreground">
            Le message s'ouvre dans WhatsApp, prêt à être envoyé.
          </p>
          <Button type="submit" variant="cta" size="xl" disabled={form.formState.isSubmitting}>
            <Send aria-hidden />
            Envoyer le message
          </Button>
        </div>
      </form>
    </Form>
  );
}

/* ---------------- Page ---------------- */

function ContactPage() {
  const [subject, setSubject] = useState<Subject | undefined>(undefined);

  const channels = [
    { icon: Phone, label: "Casablanca", value: site.phone, href: site.phoneHref, copy: "Numéro" },
    { icon: Phone, label: "Agadir", value: site.phoneAgadir, href: site.phoneAgadirHref, copy: "Numéro" },
    { icon: Printer, label: site.otherPhoneNote, value: site.otherPhone, href: site.otherPhoneHref, copy: "Numéro" },
    { icon: Mail, label: "E-mail", value: site.email, href: site.emailHref, copy: "E-mail" },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Contact" }]}
        eyebrow="Contact"
        title="Parlons de votre projet d'équipement"
        description="Une question, un devis, une intervention ? Nos équipes de Casablanca et d'Agadir vous répondent."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="cta" size="xl" asChild>
            <a href={site.phoneHref}>
              <Phone aria-hidden />
              {site.phone}
            </a>
          </Button>
          <Button variant="ghost-dark" size="xl" asChild>
            <a href={buildWhatsAppLink()} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="text-whatsapp" aria-hidden />
              WhatsApp
            </a>
          </Button>
          <Button
            variant="ghost-dark"
            size="xl"
            onClick={() => {
              setSubject(undefined);
              scrollToForm();
            }}
          >
            <Send aria-hidden />
            Écrire un message
          </Button>
        </div>
        <ul className="mt-10 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-ink-border bg-ink-border sm:grid-cols-3">
          {site.agencies.map((a) => (
            <li key={a.slug} className="bg-ink-card px-5 py-4">
              <p className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ink-muted uppercase">
                <MapPin className="size-3" aria-hidden />
                {a.city}
              </p>
              <a href={a.phoneHref} className="link-underline mt-1 inline-block font-mono text-sm">
                {a.phone}
              </a>
            </li>
          ))}
          <li className="bg-ink-card px-5 py-4">
            <p className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ink-muted uppercase">
              <Clock className="size-3" aria-hidden />
              Horaires
            </p>
            <p className="mt-1 text-sm">{site.hours}</p>
          </li>
        </ul>
      </PageHero>

      {/* Orientation */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 md:pt-24 lg:px-8">
        <SectionHeading
          eyebrow="Orientation"
          title="Comment pouvons-nous vous aider ?"
          description="Choisissez le bon canal : votre demande arrive directement au bon interlocuteur."
        />
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {intents.map((it, i) => {
            const inner = (
              <>
                <div className="flex items-start justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-tint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <it.icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.text}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-primary">
                  {it.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </>
            );
            const cls =
              "card-hairline card-lift group flex h-full w-full flex-col p-6 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none";
            return (
              <RevealItem key={it.title} className="h-full">
                {"to" in it ? (
                  <Link to={it.to} className={cls} {...(it.to === "/services" ? { hash: "sav" } : {})}>
                    {inner}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={cls}
                    onClick={() => {
                      setSubject(it.subject);
                      scrollToForm();
                    }}
                  >
                    {inner}
                  </button>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* Formulaire + coordonnées */}
      <section
        id="formulaire"
        className="mx-auto grid max-w-7xl scroll-mt-28 gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-12 lg:px-8"
      >
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="Formulaire"
              title="Écrivez-nous"
              description="Indiquez le sujet de votre demande : elle est transmise directement au bon interlocuteur."
            />
            <ul className="mt-8 space-y-2.5">
              {channels.map((c, i) => (
                <Reveal as="li" key={`${c.label}-${i}`} delay={i * 0.04}>
                  <div className="group relative flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary/40">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-tint text-primary">
                      <c.icon className="size-4" aria-hidden />
                    </span>
                    <a
                      href={c.href}
                      className="min-w-0 flex-1 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                    >
                      <span className="block text-xs text-muted-foreground">{c.label}</span>
                      <span className="block truncate font-mono text-sm font-medium group-hover:text-primary">
                        {c.value}
                      </span>
                    </a>
                    <CopyButton value={c.value} label={c.copy} />
                  </div>
                </Reveal>
              ))}
            </ul>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-ink p-4 text-ink-foreground transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <span className="inline-flex items-center gap-3">
                <WhatsAppIcon className="size-5 text-whatsapp" aria-hidden />
                <span>
                  <span className="block text-sm font-semibold">Réponse rapide sur WhatsApp</span>
                  <span className="block text-xs text-ink-muted">Photos et références bienvenues</span>
                </span>
              </span>
              <ArrowUpRight className="size-4 text-ink-muted" aria-hidden />
            </a>
          </div>
        </div>
        <div className="lg:col-span-8">
          <ContactForm
            key={subject ?? "none"}
            {...(subject !== undefined ? { defaultSubject: subject } : {})}
          />
        </div>
      </section>

      {/* Agences */}
      <section className="crop-marks relative overflow-hidden border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Agences" title="Venez nous rencontrer" />
            <p className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground")}>
              <Clock className="size-4 text-primary" aria-hidden />
              {site.hours}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {site.agencies.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.06}>
                <AgencyCard agency={a} primary={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}