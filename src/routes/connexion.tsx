import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FileCheck2,
  FileText,
  Info,
  KeyRound,
  Lock,
  Phone,
  ShieldCheck,
  Tag,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadSuccess, SelectField, TextField } from "@/components/site/form-fields";
import { fr, phoneRegex } from "@/lib/validation";
import { Breadcrumbs } from "@/components/site/layout-primitives";
import { Reveal } from "@/components/site/motion-primitives";
import { Logo } from "@/components/site/logo";
import { site } from "@/config/site";
import { submitLead, type LeadResult } from "@/lib/leads";
import { pageHead } from "@/lib/seo";

type Tab = "compte" | "connexion";

export const Route = createFileRoute("/connexion")({
  validateSearch: (s: Record<string, unknown>): { onglet?: Tab } =>
    s["onglet"] === "connexion" ? { onglet: "connexion" } : {},
  head: () =>
    pageHead({
      title: "Espace client — connexion et ouverture de compte | Polytel",
      description:
        "Accédez à vos tarifs professionnels Polytel ou demandez l'ouverture d'un compte professionnel (entreprises, revendeurs, administrations).",
      path: "/connexion",
      noindex: true,
    }),
  component: ConnexionPage,
});

const sectors = [
  "Commerce & retail",
  "Entreprise & bureaux",
  "Logistique & industrie",
  "Santé & hôtellerie",
  "Administration",
  "Revendeur",
  "Autre",
].map((s) => ({ value: s, label: s }));

const benefits = [
  { icon: Tag, title: "Prix professionnels", text: "Vos conditions tarifaires affichées sur le catalogue." },
  { icon: FileText, title: "Suivi des devis", text: "Retrouvez vos demandes et leurs réponses." },
  { icon: Lock, title: "Documents réservés", text: "Tarifs, fiches et documents commerciaux." },
];

const validationSteps = [
  { icon: UserPlus, title: "Demande", text: "Vous complétez le formulaire." },
  { icon: Building2, title: "Vérification", text: "Contrôle de votre société et ICE." },
  { icon: UserCheck, title: "Activation", text: "Un conseiller vous contacte." },
];

const loginSchema = z.object({
  email: z.string().trim().email(fr.email),
  password: z.string().min(1, fr.required),
});

const accountSchema = z.object({
  societe: z.string().trim().min(2, "Indiquez le nom de votre société."),
  ice: z.string().trim().regex(/^\d{15}$/, "L'ICE comporte 15 chiffres."),
  secteur: z.string().min(1, fr.choose),
  nom: z.string().trim().min(2, fr.name),
  fonction: z.string().trim().optional(),
  telephone: z.string().trim().regex(phoneRegex, fr.phone),
  email: z.string().trim().email(fr.email),
  ville: z.string().trim().min(2, fr.required),
});

/* ---------------- Formulaires ---------------- */

function LoginForm({ onCreate }: { onCreate: () => void }) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(() => {
          // Démo : pas d'authentification réelle — ouvre l'aperçu de l'espace client.
          toast.info("Accès démo à l'espace client", {
            description: "La connexion réelle sera activée à l'ouverture de l'espace client.",
          });
          void navigate({ to: "/espace-client" });
        })}
        className="space-y-5"
      >
        <TextField control={form.control} name="email" label="E-mail professionnel" type="email" autoComplete="email" required />
        <TextField control={form.control} name="password" label="Mot de passe" type="password" autoComplete="current-password" required />
        <Button type="submit" variant="brand" size="xl" className="w-full">
          <KeyRound aria-hidden />
          Se connecter
        </Button>
        <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Accès réservé aux comptes professionnels validés par notre équipe commerciale. Mot de passe
          oublié ? Contactez votre conseiller au{" "}
          <a href={site.phoneHref} className="link-underline font-medium text-foreground">
            {site.phone}
          </a>
          .
        </p>
        <div className="border-t border-border pt-5 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <button type="button" onClick={onCreate} className="link-underline font-semibold text-primary">
            Créer un compte professionnel
          </button>
        </div>
      </form>
    </Form>
  );
}

function AccountForm() {
  const [result, setResult] = useState<LeadResult | null>(null);
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: { societe: "", ice: "", secteur: "", nom: "", fonction: "", telephone: "", email: "", ville: "" },
  });

  if (result) {
    return (
      <LeadSuccess
        result={result}
        title="Demande de compte envoyée"
        description="Votre compte sera validé par notre équipe commerciale. Vous serez contacté pour finaliser l'ouverture."
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
            kind: "compte-pro",
            fields: [
              { label: "Société", value: v.societe },
              { label: "ICE", value: v.ice },
              { label: "Secteur", value: v.secteur },
              { label: "Contact", value: v.nom },
              { label: "Fonction", value: v.fonction },
              { label: "Téléphone", value: v.telephone },
              { label: "E-mail", value: v.email },
              { label: "Ville", value: v.ville },
            ],
          });
          setResult(res);
          form.reset();
          toast.success("Demande de compte préparée", { description: `N° ${res.reference}` });
        })}
        className="space-y-6"
      >
        <fieldset className="space-y-5">
          <legend className="eyebrow mb-4 text-muted-foreground">1 · Votre société</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={form.control} name="societe" label="Société" autoComplete="organization" required />
            <TextField control={form.control} name="ice" label="ICE" placeholder="15 chiffres" required />
            <SelectField control={form.control} name="secteur" label="Secteur d'activité" options={sectors} required className="sm:col-span-2" />
          </div>
        </fieldset>
        <fieldset className="space-y-5 border-t border-border pt-6">
          <legend className="eyebrow mb-4 text-muted-foreground">2 · Votre contact</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={form.control} name="nom" label="Nom du contact" autoComplete="name" required />
            <TextField control={form.control} name="fonction" label="Fonction" autoComplete="organization-title" />
            <TextField control={form.control} name="telephone" label="Téléphone" type="tel" autoComplete="tel" required />
            <TextField control={form.control} name="email" label="E-mail" type="email" autoComplete="email" required />
            <TextField control={form.control} name="ville" label="Ville" autoComplete="address-level2" required className="sm:col-span-2" />
          </div>
        </fieldset>
        <Button type="submit" variant="cta" size="xl" className="w-full" disabled={form.formState.isSubmitting}>
          <UserPlus aria-hidden />
          Demander l'ouverture du compte
        </Button>
        <p className="flex items-start gap-2 rounded-lg bg-blue-tint p-3 text-xs text-accent-foreground">
          <BadgeCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Votre compte sera validé par notre équipe commerciale. La demande s'ouvre dans WhatsApp,
          prête à être envoyée.
        </p>
      </form>
    </Form>
  );
}

/* ---------------- Page ---------------- */

function ConnexionPage() {
  const { onglet } = Route.useSearch();
  const navigate = useNavigate({ from: "/connexion" });
  const tab: Tab = onglet ?? "compte";
  const setTab = (v: string) =>
    void navigate({
      search: v === "connexion" ? { onglet: "connexion" } : {},
      replace: true,
      resetScroll: false,
    });

  return (
    <section className="relative overflow-hidden">
      <div
        className="dot-grid-light pointer-events-none absolute inset-0"
        aria-hidden
        style={{ maskImage: "radial-gradient(50% 60% at 80% 10%, black, transparent 70%)" }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:py-16 lg:grid-cols-12 lg:px-8">
        {/* Panneau marque */}
        <div className="lg:col-span-5">
          <Breadcrumbs items={[{ label: "Accueil", to: "/" }, { label: "Espace client" }]} />
          <Reveal className="mt-8">
            <div className="crop-marks relative overflow-hidden rounded-3xl bg-ink p-8 text-ink-foreground sm:p-10">
              <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
              <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/40 blur-[90px]" aria-hidden />
              <div className="relative">
                <Logo onDark />
                <p className="eyebrow mt-10 text-cta">Espace client</p>
                <h1 className="display-md mt-3 text-balance">Vos conditions professionnelles, en un clic</h1>
                <p className="mt-4 text-sm text-ink-muted">
                  Entreprises, revendeurs et administrations : un espace dédié pour accéder à vos
                  prix et suivre vos demandes.
                </p>
                <ul className="mt-8 space-y-3">
                  {benefits.map((b) => (
                    <li key={b.title} className="flex items-start gap-3 rounded-xl border border-ink-border bg-white/5 p-3.5">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <b.icon className="size-4 text-cta" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{b.title}</span>
                        <span className="block text-xs text-ink-muted">{b.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-8 font-mono text-[10px] tracking-wider text-ink-muted uppercase">
                  Ouverture de compte
                </p>
                <ol className="mt-3 grid grid-cols-3 gap-2">
                  {validationSteps.map((s, i) => (
                    <li key={s.title} className="rounded-xl border border-ink-border bg-ink-card p-3">
                      <div className="flex items-center justify-between">
                        <s.icon className="size-4 text-cta" aria-hidden />
                        <span className="font-mono text-[10px] text-ink-muted">0{i + 1}</span>
                      </div>
                      <p className="mt-2 text-xs font-semibold">{s.title}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-ink-muted">{s.text}</p>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 flex flex-col gap-2 border-t border-ink-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Pas encore client ?{" "}
                    <Link to="/devis" className="link-underline text-ink-foreground">
                      Demandez d'abord un devis
                    </Link>
                  </span>
                  <a href={site.phoneHref} className="inline-flex items-center gap-1.5 font-mono hover:text-ink-foreground">
                    <Phone className="size-3.5" aria-hidden />
                    {site.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Formulaires */}
        <div className="lg:col-span-7 lg:pt-16">
          <Reveal delay={0.06}>
            <Tabs value={tab} onValueChange={setTab} className="card-hairline overflow-hidden">
              <div className="border-b border-border bg-background/60 p-4 sm:p-5">
                <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-muted p-1">
                  <TabsTrigger value="compte" className="gap-2 rounded-lg py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-soft">
                    <UserPlus className="size-4" aria-hidden />
                    <span className="hidden sm:inline">Créer un compte pro</span>
                    <span className="sm:hidden">Créer</span>
                  </TabsTrigger>
                  <TabsTrigger value="connexion" className="gap-2 rounded-lg py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-soft">
                    <KeyRound className="size-4" aria-hidden />
                    Se connecter
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="compte" className="mt-0 p-6 sm:p-8">
                <div className="mb-6 flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-tint text-primary">
                    <FileCheck2 className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold">Ouvrir un compte professionnel</h2>
                    <p className="text-sm text-muted-foreground">Gratuit, sans engagement. Munissez-vous de votre ICE.</p>
                  </div>
                </div>
                <AccountForm />
              </TabsContent>
              <TabsContent value="connexion" className="mt-0 p-6 sm:p-8">
                <div className="mb-6 flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-tint text-primary">
                    <ShieldCheck className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold">Connexion à l'espace client</h2>
                    <p className="text-sm text-muted-foreground">Pour les comptes déjà validés.</p>
                  </div>
                </div>
                <LoginForm onCreate={() => setTab("compte")} />
              </TabsContent>
            </Tabs>
          </Reveal>
          <Reveal delay={0.1} className="mt-4">
            <Link
              to="/devis"
              className="card-hairline card-lift group flex items-center gap-4 p-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-cta/15 text-foreground">
                <FileText className="size-5" aria-hidden />
              </span>
              <span className="flex-1 text-sm">
                <span className="block font-semibold">Besoin d'un prix rapidement ?</span>
                <span className="block text-muted-foreground">Envoyez une demande de devis sans créer de compte.</span>
              </span>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}