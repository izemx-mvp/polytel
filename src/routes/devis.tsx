import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  BadgeCheck,
  Check,
  ClipboardList,
  FileText,
  Lock,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  UserRound,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ChoiceField, LeadSuccess, SelectField, TextareaField, TextField } from "@/components/site/form-fields";
import { fr, phoneRegex } from "@/lib/validation";
import { PageHero, QuantityStepper } from "@/components/site/layout-primitives";
import { Reveal } from "@/components/site/motion-primitives";
import { ProductVisual } from "@/components/site/product-visual";
import { categories } from "@/data/categories";
import { site } from "@/config/site";
import { quoteLines, useQuote } from "@/lib/quote";
import { submitLead, type LeadResult } from "@/lib/leads";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/devis")({
  head: () =>
    pageHead({
      title: "Demande de devis professionnel | Polytel",
      description:
        "Demandez votre devis Polytel : sélectionnez vos produits, indiquez vos coordonnées, un conseiller vous répond avec une offre adaptée.",
      path: "/devis",
    }),
  component: DevisPage,
});

const clientTypes = [
  { value: "Entreprise", label: "Entreprise" },
  { value: "Revendeur", label: "Revendeur" },
  { value: "Administration", label: "Administration" },
  { value: "Particulier", label: "Particulier" },
] as const;

const delais = [
  { value: "Urgent (sous 48 h)", label: "Urgent (sous 48 h)" },
  { value: "Sous une semaine", label: "Sous une semaine" },
  { value: "Sous un mois", label: "Sous un mois" },
  { value: "Projet à planifier", label: "Projet à planifier" },
] as const;

const schema = z.object({
  typeClient: z.enum(["Entreprise", "Revendeur", "Administration", "Particulier"], {
    errorMap: () => ({ message: fr.choose }),
  }),
  societe: z.string().trim().optional(),
  ice: z.string().trim().regex(/^(\d{15})?$/, "L'ICE comporte 15 chiffres.").optional(),
  nom: z.string().trim().min(2, fr.name),
  telephone: z.string().trim().regex(phoneRegex, fr.phone),
  email: z.string().trim().email(fr.email),
  ville: z.string().trim().min(2, fr.required),
  message: z.string().trim().optional(),
  delai: z.string().min(1, fr.choose),
});

type Values = z.infer<typeof schema>;

const popular = categories.slice(0, 6);

/* ---------------- Étapes ---------------- */

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Sélection", icon: ClipboardList },
    { n: 2, label: "Coordonnées", icon: UserRound },
    { n: 3, label: "Envoi", icon: Send },
  ] as const;
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Étapes de la demande">
      {steps.map((s, i) => {
        const done = s.n < step;
        const current = s.n === step;
        return (
          <li key={s.n} className="flex flex-1 items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                done && "border-primary bg-primary text-primary-foreground",
                current && "border-primary bg-card text-primary",
                !done && !current && "border-border bg-card text-muted-foreground",
              )}
              aria-current={current ? "step" : undefined}
            >
              {done ? <Check className="size-4" aria-hidden /> : <s.icon className="size-4" aria-hidden />}
            </span>
            <span className={cn("hidden text-sm font-medium sm:inline", current ? "text-foreground" : "text-muted-foreground")}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span className={cn("h-px flex-1", done ? "bg-primary" : "bg-border")} aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------- Page ---------------- */

function DevisPage() {
  const { items, setQty, remove, clear } = useQuote();
  const lines = quoteLines(items);
  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const [result, setResult] = useState<LeadResult | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(
      schema.refine((v) => v.typeClient === "Particulier" || (v.societe ?? "").length >= 2, {
        message: "Indiquez le nom de votre société.",
        path: ["societe"],
      }),
    ),
    defaultValues: { societe: "", ice: "", nom: "", telephone: "", email: "", ville: "", message: "", delai: "" },
  });

  const typeClient = form.watch("typeClient");
  const step: 1 | 2 | 3 = result ? 3 : lines.length > 0 ? 2 : 1;

  const onSubmit = async (v: Values) => {
    if (lines.length === 0 && !(v.message && v.message.length >= 10)) {
      form.setError("message", {
        message: "Votre demande est vide : ajoutez des produits ou décrivez votre besoin.",
      });
      return;
    }
    const res = await submitLead({
      kind: "devis",
      items: lines.map((l) => ({ name: l.product.name, reference: l.product.reference, qty: l.qty })),
      fields: [
        { label: "Type de client", value: v.typeClient },
        { label: "Société", value: v.societe },
        { label: "ICE", value: v.ice },
        { label: "Nom", value: v.nom },
        { label: "Téléphone", value: v.telephone },
        { label: "E-mail", value: v.email },
        { label: "Ville", value: v.ville },
        { label: "Délai souhaité", value: v.delai },
        { label: "Message", value: v.message },
      ],
    });
    setResult(res);
    clear();
    form.reset();
    toast.success("Demande de devis préparée", { description: `N° ${res.reference}` });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageHero
        dark={false}
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Demande de devis" }]}
        eyebrow="Devis professionnel"
        title="Votre demande de devis"
        description="Vérifiez votre sélection, complétez vos coordonnées : un conseiller Polytel vous répond avec une offre adaptée à votre activité."
      >
        <div className="mt-8 max-w-xl">
          <Stepper step={step} />
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {result ? (
          <div className="mx-auto max-w-2xl">
            <LeadSuccess
              result={result}
              title="Merci, votre demande est prête"
              description="Votre demande a été mise en forme et ouverte dans WhatsApp. Envoyez le message pour la transmettre à nos conseillers."
              onReset={() => setResult(null)}
            />
            <Reveal delay={0.1} className="mt-6 rounded-2xl border border-border bg-card p-6">
              <p className="font-display font-semibold">Et ensuite ?</p>
              <ol className="mt-4 space-y-3 text-sm">
                {[
                  "Envoyez le message WhatsApp préparé (ou l'e-mail de repli).",
                  "Un conseiller étudie votre sélection et vos quantités.",
                  "Vous recevez votre offre professionnelle personnalisée.",
                ].map((t, i) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-tint font-mono text-[11px] font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" asChild>
                  <Link to="/produits">Continuer à parcourir</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <a href={site.phoneHref}>
                    <Phone aria-hidden />
                    {site.phone}
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Récapitulatif */}
            <aside className="lg:col-span-5" aria-labelledby="recap-title">
              <div className="lg:sticky lg:top-36">
                <div className="card-hairline overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border bg-background/60 px-5 py-4">
                    <h2 id="recap-title" className="flex items-center gap-2 font-display font-semibold">
                      <FileText className="size-4 text-primary" aria-hidden />
                      Produits sélectionnés
                    </h2>
                    <span className="rounded-full bg-blue-tint px-2.5 py-0.5 font-mono text-xs text-primary">
                      {lines.length} réf. · {totalQty} u.
                    </span>
                  </div>

                  {lines.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-blue-tint text-primary">
                        <ClipboardList className="size-5" aria-hidden />
                      </span>
                      <p className="mt-4 font-medium">Aucun produit sélectionné</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Ajoutez des produits depuis le catalogue, ou décrivez directement votre
                        besoin dans le formulaire.
                      </p>
                      <ul className="mt-5 flex flex-wrap justify-center gap-2">
                        {popular.map((c) => (
                          <li key={c.slug}>
                            <Link
                              to="/produits/$univers"
                              params={{ univers: c.slug }}
                              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                            >
                              <c.icon className="size-3.5 text-primary" aria-hidden />
                              {c.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <ul className="max-h-[52vh] divide-y divide-border overflow-y-auto">
                      {lines.map(({ product, qty }) => (
                        <li key={product.id} className="flex gap-3 px-5 py-4">
                          <Link to="/produit/$slug" params={{ slug: product.slug }} className="shrink-0">
                            <ProductVisual
                              product={product}
                              compact
                              width={64}
                              height={64}
                              className="product-surface size-16 rounded-lg border border-border"
                              imgClassName="p-1.5"
                            />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link
                              to="/produit/$slug"
                              params={{ slug: product.slug }}
                              className="line-clamp-1 text-sm font-medium hover:text-primary"
                            >
                              {product.name}
                            </Link>
                            <p className="font-mono text-[11px] text-muted-foreground">Réf. {product.reference}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <QuantityStepper size="sm" value={qty} onChange={(q) => setQty(product.id, q)} label={product.name} />
                              <button
                                type="button"
                                onClick={() => remove(product.id)}
                                className="ml-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                aria-label={`Retirer ${product.name}`}
                              >
                                <Trash2 className="size-4" aria-hidden />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
                    <Link to="/produits" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                      <Plus className="size-4" aria-hidden />
                      Ajouter des produits
                    </Link>
                    {lines.length > 0 &&
                      (confirmClear ? (
                        <span className="inline-flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Tout retirer ?</span>
                          <button
                            type="button"
                            onClick={() => {
                              clear();
                              setConfirmClear(false);
                            }}
                            className="font-semibold text-destructive hover:underline"
                          >
                            Oui
                          </button>
                          <button type="button" onClick={() => setConfirmClear(false)} className="text-muted-foreground hover:underline">
                            Non
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmClear(true)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          Vider la sélection
                        </button>
                      ))}
                  </div>
                  <p className="flex items-center gap-2 border-t border-border bg-background/60 px-5 py-4 text-xs text-muted-foreground">
                    <Lock className="size-3.5 text-primary" aria-hidden />
                    Prix professionnels communiqués dans votre devis.
                  </p>
                </div>

                <ul className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {[
                    { icon: BadgeCheck, t: "Produits d'origine" },
                    { icon: ShieldCheck, t: "Garantie constructeur" },
                    { icon: Wrench, t: "Installation & SAV" },
                  ].map((x) => (
                    <li key={x.t} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-medium">
                      <x.icon className="size-4 shrink-0 text-success" aria-hidden />
                      {x.t}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Formulaire */}
            <div className="lg:col-span-7">
              <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="card-hairline overflow-hidden">
                  <div className="flex items-center justify-between gap-3 border-b border-border bg-background/60 px-6 py-4 sm:px-8">
                    <p className="font-display font-semibold">Vos informations</p>
                    <span className="font-mono text-[11px] text-muted-foreground">* champs obligatoires</span>
                  </div>
                  <div className="space-y-6 p-6 sm:p-8">
                    <fieldset className="space-y-5">
                      <legend className="eyebrow mb-4 text-muted-foreground">1 · Vous êtes</legend>
                      <ChoiceField control={form.control} name="typeClient" label="Type de client" options={clientTypes} required />
                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField
                          control={form.control}
                          name="societe"
                          label="Société"
                          autoComplete="organization"
                          required={typeClient !== "Particulier"}
                        />
                        <TextField control={form.control} name="ice" label="ICE" placeholder="15 chiffres (optionnel)" />
                      </div>
                    </fieldset>
                    <fieldset className="space-y-5 border-t border-border pt-6">
                      <legend className="eyebrow mb-4 text-muted-foreground">2 · Vos coordonnées</legend>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField control={form.control} name="nom" label="Nom et prénom" autoComplete="name" required />
                        <TextField control={form.control} name="telephone" label="Téléphone" type="tel" autoComplete="tel" required />
                        <TextField control={form.control} name="email" label="E-mail" type="email" autoComplete="email" required />
                        <TextField control={form.control} name="ville" label="Ville" autoComplete="address-level2" required />
                      </div>
                    </fieldset>
                    <fieldset className="space-y-5 border-t border-border pt-6">
                      <legend className="eyebrow mb-4 text-muted-foreground">3 · Votre besoin</legend>
                      <SelectField control={form.control} name="delai" label="Délai souhaité" options={delais} required />
                      <TextareaField
                        control={form.control}
                        name="message"
                        label={lines.length === 0 ? "Décrivez votre besoin" : "Message"}
                        placeholder="Volumes, configuration, installation, contrat de maintenance…"
                        required={lines.length === 0}
                      />
                    </fieldset>
                  </div>
                  <div className="flex flex-col-reverse gap-4 border-t border-border bg-background/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p className="text-xs text-muted-foreground">
                      Envoyée via WhatsApp (repli par e-mail proposé).
                    </p>
                    <Button type="submit" variant="cta" size="xl" disabled={form.formState.isSubmitting}>
                      <Send aria-hidden />
                      {lines.length > 0 ? `Envoyer ma demande (${lines.length} réf.)` : "Envoyer ma demande"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}