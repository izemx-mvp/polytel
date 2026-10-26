import { useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Headphones,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  Receipt,
  Search,
  Tag,
  Truck,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/site/layout-primitives";
import { ProductVisual } from "@/components/site/product-visual";
import { BrandLogo } from "@/components/site/brand-logo";
import { WhatsAppIcon } from "@/components/site/icons";
import { products, type Product } from "@/data/products";
import { buildWhatsAppLink, site, TO_CONFIRM } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

/* =========================================================
   ESPACE CLIENT — MAQUETTE DE DÉMONSTRATION
   Toutes les données ci-dessous sont fictives. À brancher plus tard
   sur l'authentification et l'API (devis, documents, SAV, prix).
   ========================================================= */

type View = "tableau-de-bord" | "devis" | "prix" | "documents" | "sav" | "compte";
const VIEWS: View[] = ["tableau-de-bord", "devis", "prix", "documents", "sav", "compte"];

export const Route = createFileRoute("/espace-client")({
  validateSearch: (s: Record<string, unknown>): { vue?: View } =>
    typeof s["vue"] === "string" && VIEWS.includes(s["vue"] as View) && s["vue"] !== "tableau-de-bord"
      ? { vue: s["vue"] as View }
      : {},
  head: () =>
    pageHead({
      title: "Espace client — Polytel",
      description: "Espace client professionnel Polytel : devis, prix professionnels, documents et SAV.",
      path: "/espace-client",
      noindex: true,
    }),
  component: EspaceClientPage,
});

/* ---------------- Données fictives ---------------- */

const real = products.filter((p) => !p.placeholder);
const pick = (i: number): Product | undefined => real[i % Math.max(real.length, 1)];

const account = {
  firstName: "Karim",
  lastName: "Exemple",
  email: "karim.exemple@email.ma",
  phone: "06 00 00 00 00",
  address: "12, Rue Exemple, Quartier Exemple",
  city: "Casablanca",
  company: "Société Exemple SARL",
  since: "2026",
};
const fullName = `${account.firstName} ${account.lastName}`;
const initials = `${account.firstName[0] ?? ""}${account.lastName[0] ?? ""}`;

type QuoteStatus = "En étude" | "Offre envoyée" | "Acceptée" | "Expirée";

const quotes: { ref: string; date: string; status: QuoteStatus; lines: { p: Product | undefined; qty: number }[] }[] = [
  { ref: "DV-2026-0142", date: "2026-10-22", status: "En étude", lines: [{ p: pick(0), qty: 3 }, { p: pick(1), qty: 10 }] },
  { ref: "DV-2026-0131", date: "2026-10-09", status: "Offre envoyée", lines: [{ p: pick(2), qty: 2 }] },
  { ref: "DV-2026-0117", date: "2026-09-18", status: "Acceptée", lines: [{ p: pick(3), qty: 5 }, { p: pick(4), qty: 1 }, { p: pick(5), qty: 20 }] },
  { ref: "DV-2026-0098", date: "2026-08-27", status: "Expirée", lines: [{ p: pick(6), qty: 1 }] },
];

const documents = [
  { name: "Offre DV-2026-0131", kind: "Devis", date: "2026-10-10", icon: FileText },
  { name: "Facture FA-2026-0877", kind: "Facture", date: "2026-09-30", icon: Receipt },
  { name: "Bon de livraison BL-2026-0412", kind: "Livraison", date: "2026-09-26", icon: Truck },
  { name: "Offre DV-2026-0117", kind: "Devis", date: "2026-09-19", icon: FileText },
  { name: "Contrat de maintenance 2026", kind: "Contrat", date: "2026-01-15", icon: BadgeCheck },
];

type SavStatus = "Planifiée" | "En cours" | "Clôturée";
const tickets: { ref: string; device: string; subject: string; date: string; status: SavStatus }[] = [
  { ref: "SAV-0388", device: pick(0)?.reference ?? "—", subject: "Visite préventive (contrat)", date: "2026-11-04", status: "Planifiée" },
  { ref: "SAV-0371", device: pick(2)?.reference ?? "—", subject: "Bourrage papier récurrent", date: "2026-10-15", status: "En cours" },
  { ref: "SAV-0342", device: pick(3)?.reference ?? "—", subject: "Installation et mise en service", date: "2026-09-27", status: "Clôturée" },
];

const quoteStatusCls: Record<QuoteStatus, string> = {
  "En étude": "bg-blue-tint text-primary",
  "Offre envoyée": "bg-cta/20 text-foreground",
  Acceptée: "bg-success/15 text-success",
  Expirée: "bg-muted text-muted-foreground",
};

const savStatusCls: Record<SavStatus, string> = {
  Planifiée: "bg-blue-tint text-primary",
  "En cours": "bg-cta/20 text-foreground",
  Clôturée: "bg-muted text-muted-foreground",
};

const nav: { id: View; label: string; short: string; icon: LucideIcon }[] = [
  { id: "tableau-de-bord", label: "Tableau de bord", short: "Accueil", icon: LayoutDashboard },
  { id: "devis", label: "Mes devis", short: "Devis", icon: FileText },
  { id: "prix", label: "Mes prix pro", short: "Prix pro", icon: Tag },
  { id: "documents", label: "Documents", short: "Documents", icon: FolderOpen },
  { id: "sav", label: "SAV", short: "SAV", icon: Wrench },
  { id: "compte", label: "Mon compte", short: "Compte", icon: UserRound },
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

const demoToast = () =>
  toast.info("Mode démonstration", { description: "Cette action sera disponible à l'ouverture de l'espace client." });

/* ---------------- Éléments communs ---------------- */

function Badge({ className, children }: { className: string; children: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap", className)}>
      {children}
    </span>
  );
}

function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card-hairline min-w-0 overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border px-4 py-3.5 sm:px-5 sm:py-4">
        <h2 className="min-w-0 font-display font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

const infoRows = (): { icon: LucideIcon; label: string; value: string }[] => [
  { icon: UserRound, label: "Nom", value: fullName },
  { icon: Mail, label: "E-mail", value: account.email },
  { icon: Phone, label: "Téléphone", value: account.phone },
  { icon: MapPin, label: "Adresse", value: `${account.address}, ${account.city}` },
  { icon: Building2, label: "Société", value: account.company },
];

function InfoCard({ go }: { go: (v: View) => void }) {
  return (
    <Panel
      title="Mes informations"
      action={
        <button type="button" onClick={() => go("compte")} className="text-sm font-medium text-primary hover:underline">
          Modifier
        </button>
      }
    >
      <div className="flex items-center gap-4 border-b border-border px-5 py-4">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{fullName}</p>
          <p className="text-xs text-muted-foreground">Client depuis {account.since}</p>
        </div>
      </div>
      <dl className="divide-y divide-border">
        {infoRows()
          .slice(1)
          .map((r) => (
            <div key={r.label} className="flex items-start gap-3 px-5 py-3">
              <r.icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <dt className="text-[11px] text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium break-words">{r.value}</dd>
              </div>
            </div>
          ))}
      </dl>
    </Panel>
  );
}

function AdvisorCard() {
  return (
    <section className="crop-marks relative overflow-hidden rounded-2xl bg-ink p-5 text-ink-foreground">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="relative">
        <p className="font-mono text-[10px] tracking-wider text-ink-muted uppercase">Votre conseiller dédié</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-full border border-dashed border-ink-border bg-ink-card text-ink-muted">
            <Headphones className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold">Nom du conseiller</p>
            <p className="text-xs text-ink-muted">{TO_CONFIRM}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-2">
          <Button variant="cta" size="sm" asChild>
            <a href={site.phoneHref}>
              <Phone aria-hidden />
              {site.phone}
            </a>
          </Button>
          <Button variant="ghost-dark" size="sm" asChild>
            <a href={buildWhatsAppLink(`Bonjour, ${fullName} — j'ai une question concernant mon compte client.`)} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="text-whatsapp" aria-hidden />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Vues ---------------- */

function Dashboard({ go }: { go: (v: View) => void }) {
  const kpis = [
    { label: "Devis en cours", value: quotes.filter((q) => q.status === "En étude" || q.status === "Offre envoyée").length, icon: FileText, view: "devis" as View },
    { label: "Devis acceptés", value: quotes.filter((q) => q.status === "Acceptée").length, icon: BadgeCheck, view: "devis" as View },
    { label: "Interventions SAV", value: tickets.filter((t) => t.status !== "Clôturée").length, icon: Wrench, view: "sav" as View },
    { label: "Documents", value: documents.length, icon: FolderOpen, view: "documents" as View },
  ];
  return (
    <div className="space-y-6">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <li key={k.label} className="min-w-0">
            <button
              type="button"
              onClick={() => go(k.view)}
              className="card-hairline card-lift group flex h-full w-full flex-col p-4 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:p-5"
            >
              <div className="flex items-center justify-between">
                <k.icon className="size-5 text-primary" aria-hidden />
                <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              </div>
              <p className="mt-3 font-display text-2xl font-bold sm:mt-4 sm:text-3xl">{k.value}</p>
              <p className="text-xs leading-snug text-muted-foreground">{k.label}</p>
            </button>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          title="Derniers devis"
          className="xl:col-span-2"
          action={
            <button type="button" onClick={() => go("devis")} className="text-sm font-medium text-primary hover:underline">
              Tout voir
            </button>
          }
        >
          <ul className="divide-y divide-border">
            {quotes.slice(0, 3).map((q) => (
              <li key={q.ref} className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5">
                <div className="hidden -space-x-2 min-[420px]:flex" aria-hidden>
                  {q.lines.slice(0, 2).map((l, i) =>
                    l.p ? (
                      <div key={i} className="product-surface size-10 overflow-hidden rounded-lg border-2 border-card">
                        <ProductVisual product={l.p} width={40} height={40} className="size-full" imgClassName="p-1" />
                      </div>
                    ) : null,
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm font-medium">{q.ref}</p>
                  <p className="text-xs text-muted-foreground">
                    {fmtDate(q.date)} · {q.lines.length} réf.
                  </p>
                </div>
                <Badge className={quoteStatusCls[q.status]}>{q.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
        <div className="grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-1">
          <InfoCard go={go} />
          <AdvisorCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Nouvelle demande de devis", icon: Plus, to: "/devis" as const },
          { label: "Demander une intervention", icon: Wrench, to: "/services" as const },
          { label: "Parcourir le catalogue", icon: Search, to: "/produits" as const },
        ].map((a) => (
          <Link
            key={a.label}
            to={a.to}
            {...(a.to === "/services" ? { hash: "sav" } : {})}
            className="card-hairline card-lift group flex items-center gap-3 p-4 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-blue-tint text-primary">
              <a.icon className="size-4" aria-hidden />
            </span>
            <span className="flex-1">{a.label}</span>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        ))}
      </div>
    </div>
  );
}

function QuotesView() {
  const [open, setOpen] = useState<string | null>(quotes[0]?.ref ?? null);
  return (
    <Panel
      title="Mes devis"
      action={
        <Button variant="cta" size="sm" asChild>
          <Link to="/devis">
            <Plus aria-hidden />
            Nouveau devis
          </Link>
        </Button>
      }
    >
      <ul className="divide-y divide-border">
        {quotes.map((q) => {
          const isOpen = open === q.ref;
          return (
            <li key={q.ref}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : q.ref)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-background sm:gap-4 sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm font-semibold">{q.ref}</p>
                  <p className="text-xs text-muted-foreground">
                    Demandé le {fmtDate(q.date)} · {q.lines.reduce((s, l) => s + l.qty, 0)} unités
                  </p>
                </div>
                <Badge className={quoteStatusCls[q.status]}>{q.status}</Badge>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} aria-hidden />
              </button>
              {isOpen && (
                <div className="border-t border-border bg-background/60 px-4 py-4 sm:px-5">
                  <ul className="space-y-2">
                    {q.lines.map((l, i) =>
                      l.p ? (
                        <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5">
                          <div className="product-surface size-12 shrink-0 overflow-hidden rounded-lg">
                            <ProductVisual product={l.p} width={48} height={48} className="size-full" imgClassName="p-1" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link to="/produit/$slug" params={{ slug: l.p.slug }} className="line-clamp-1 text-sm font-medium hover:text-primary">
                              {l.p.name}
                            </Link>
                            <p className="font-mono text-[11px] text-muted-foreground">{l.p.reference}</p>
                          </div>
                          <span className="shrink-0 font-mono text-sm">× {l.qty}</span>
                        </li>
                      ) : null,
                    )}
                  </ul>
                  <div className="mt-4 grid gap-2 min-[420px]:flex min-[420px]:flex-wrap">
                    {q.status === "Offre envoyée" && (
                      <Button size="sm" variant="cta" onClick={demoToast}>
                        <BadgeCheck aria-hidden />
                        Accepter l'offre
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={demoToast}>
                      <Download aria-hidden />
                      Télécharger le PDF
                    </Button>
                    <Button size="sm" variant="ghost" onClick={demoToast}>
                      Dupliquer la demande
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function PricesView() {
  const [q, setQ] = useState("");
  const n = q.trim().toLowerCase();
  const list = real.filter((p) => !n || `${p.name} ${p.reference} ${p.brand}`.toLowerCase().includes(n)).slice(0, 12);
  return (
    <Panel
      title="Mes prix professionnels"
      action={
        <div className="relative w-full sm:w-auto">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nom, référence, marque…"
            aria-label="Rechercher une référence"
            className="h-10 w-full rounded-lg border border-input bg-card pr-3 pl-9 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-9 sm:w-56 sm:text-sm"
          />
        </div>
      }
    >
      <p className="flex items-start gap-2 border-b border-border bg-blue-tint/50 px-4 py-3 text-xs text-primary sm:items-center sm:px-5">
        <Lock className="mt-0.5 size-3.5 shrink-0 sm:mt-0" aria-hidden />
        Vos prix négociés s'afficheront ici à l'ouverture de votre espace. Aucun prix n'est affiché dans cette démonstration.
      </p>
      {list.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">Aucune référence ne correspond à « {q} ».</p>
      )}
      <ul className="divide-y divide-border">
        {list.map((p) => (
          <li key={p.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
            <div className="product-surface size-11 shrink-0 overflow-hidden rounded-lg border border-border sm:size-12">
              <ProductVisual product={p} width={48} height={48} className="size-full" imgClassName="p-1" />
            </div>
            <div className="min-w-0 flex-1">
              <Link to="/produit/$slug" params={{ slug: p.slug }} className="line-clamp-2 text-sm font-medium hover:text-primary sm:line-clamp-1">
                {p.name}
              </Link>
              <div className="mt-0.5 flex min-w-0 items-center gap-2">
                <BrandLogo slug={p.brand} size="sm" className="hidden h-3 min-[420px]:block" />
                <span className="truncate font-mono text-[11px] text-muted-foreground">{p.reference}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-sm font-semibold tracking-widest text-muted-foreground select-none" aria-label="Prix masqué">
                ••••,••
                <span className="block text-[10px] tracking-normal sm:ml-1 sm:inline">MAD HT</span>
              </p>
              <p className="text-[10px] text-muted-foreground">Prix négocié</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function DocumentsView() {
  return (
    <Panel title="Mes documents">
      <ul className="divide-y divide-border">
        {documents.map((d) => (
          <li key={d.name} className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-tint text-primary">
              <d.icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{d.name}</p>
              <p className="text-xs text-muted-foreground">
                {d.kind} · {fmtDate(d.date)} · PDF
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="icon" variant="ghost" className="hidden min-[420px]:inline-flex" onClick={demoToast} aria-label={`Aperçu ${d.name}`}>
                <Eye aria-hidden />
              </Button>
              <Button size="icon" variant="outline" onClick={demoToast} aria-label={`Télécharger ${d.name}`}>
                <Download aria-hidden />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function SavView() {
  return (
    <div className="space-y-6">
      <Panel
        title="Mes interventions SAV"
        action={
          <Button variant="cta" size="sm" asChild>
            <Link to="/services" hash="sav">
              <Plus aria-hidden />
              Nouvelle demande
            </Link>
          </Button>
        }
      >
        <ul className="divide-y divide-border">
          {tickets.map((t) => (
            <li key={t.ref} className="flex flex-col items-start gap-2 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{t.subject}</p>
                <p className="text-xs break-words text-muted-foreground">
                  <span className="font-mono">{t.ref}</span> · Équipement <span className="font-mono">{t.device}</span> ·{" "}
                  {fmtDate(t.date)}
                </p>
              </div>
              <Badge className={savStatusCls[t.status]}>{t.status}</Badge>
            </li>
          ))}
        </ul>
      </Panel>
      <section className="card-hairline flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-tint text-primary">
          <BadgeCheck className="size-5" aria-hidden />
        </span>
        <div className="flex-1">
          <p className="font-semibold">Contrat de maintenance actif</p>
          <p className="text-sm text-muted-foreground">4 visites préventives par an · prochaine visite planifiée le {fmtDate(tickets[0]?.date ?? "2026-11-04")}.</p>
        </div>
      </section>
    </div>
  );
}

function AccountView({ onLogout }: { onLogout: () => void }) {
  const rows = infoRows();
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <Panel
        title="Mes informations"
        className="xl:col-span-2"
        action={
          <Button size="sm" variant="outline" onClick={demoToast}>
            Modifier
          </Button>
        }
      >
        <div className="flex items-center gap-4 border-b border-border px-4 py-5 sm:px-5">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold">{fullName}</p>
            <p className="text-sm text-muted-foreground">Client depuis {account.since}</p>
          </div>
        </div>
        <dl className="divide-y divide-border">
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-1 items-start gap-1 px-4 py-3.5 text-sm sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4 sm:px-5">
              <dt className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <r.icon className="size-4 text-primary" aria-hidden />
                {r.label}
              </dt>
              <dd className="pl-6 font-medium break-words sm:pl-0">{r.value}</dd>
            </div>
          ))}
        </dl>
      </Panel>
      <div className="min-w-0 space-y-4">
        <AdvisorCard />
        <Button variant="outline" className="w-full" onClick={onLogout}>
          <LogOut aria-hidden />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

function EspaceClientPage() {
  const { vue } = Route.useSearch();
  const navigate = useNavigate({ from: "/espace-client" });
  const view: View = vue ?? "tableau-de-bord";
  const go = (v: View) =>
    void navigate({ search: v === "tableau-de-bord" ? {} : { vue: v }, replace: true, resetScroll: false });
  const logout = () => {
    toast.success("Vous êtes déconnecté");
    void navigate({ to: "/connexion", search: { onglet: "connexion" } });
  };
  const current = nav.find((n) => n.id === view);

  return (
    <>
      {/* Bandeau démo */}
      <div className="border-b border-border bg-warm">
        <p className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-2.5 text-xs text-warm-foreground sm:items-center sm:px-6 lg:px-8">
          <Eye className="mt-0.5 size-3.5 shrink-0 sm:mt-0" aria-hidden />
          <span>
            Aperçu de démonstration — données fictives.
            <span className="hidden sm:inline"> L'espace client sera relié à votre compte à son ouverture.</span>
          </span>
        </p>
      </div>

      {/* En-tête */}
      <section className="crop-marks relative overflow-hidden bg-ink text-ink-foreground">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pt-5 pb-8 sm:px-6 sm:pt-6 sm:pb-10 lg:px-8">
          <div className="[&_a]:text-ink-muted [&_a:hover]:text-ink-foreground [&_*]:text-ink-muted">
            <Breadcrumbs items={[{ label: "Accueil", to: "/" }, { label: "Espace client" }]} />
          </div>
          <div className="mt-6 flex flex-col gap-5 sm:mt-8 md:flex-row md:items-end md:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-cta font-display text-lg font-bold text-cta-foreground sm:size-14 sm:text-xl">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-wider text-ink-muted uppercase">Espace client</p>
                <h1 className="truncate font-display text-2xl font-semibold sm:text-3xl">Bonjour, {account.firstName}</h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2 py-0.5 font-semibold text-ink-foreground">
                    <BadgeCheck className="size-3" aria-hidden />
                    Compte validé
                  </span>
                  <span className="hidden min-w-0 items-center gap-1 sm:inline-flex">
                    <Mail className="size-3 shrink-0" aria-hidden />
                    <span className="truncate">{account.email}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" aria-hidden />
                    {account.city}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2 sm:flex">
              <Button variant="cta" asChild>
                <Link to="/devis">
                  <Plus aria-hidden />
                  Nouveau devis
                </Link>
              </Button>
              <Button variant="ghost-dark" asChild>
                <a href={`mailto:${site.email}`} aria-label="Écrire à Polytel">
                  <Mail aria-hidden />
                  <span className="hidden sm:inline">Écrire</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 md:py-12 lg:grid-cols-12 lg:gap-8 lg:px-8">
        {/* Navigation : grille de tuiles sur mobile, liste verticale à partir de lg */}
        <aside className="min-w-0 lg:col-span-3">
          <nav aria-label="Espace client" className="lg:sticky lg:top-36">
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:flex lg:flex-col lg:gap-1">
              {nav.map((n) => {
                const active = n.id === view;
                return (
                  <li key={n.id} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => go(n.id)}
                      {...(active ? { "aria-current": "page" as const } : {})}
                      className={cn(
                        "flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border px-1 py-3 text-[11px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                        "lg:h-10 lg:flex-row lg:justify-start lg:gap-3 lg:rounded-lg lg:border-0 lg:px-3 lg:py-0 lg:text-sm lg:font-medium",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground/80 hover:bg-muted lg:bg-transparent",
                      )}
                    >
                      <n.icon className="size-4 shrink-0" aria-hidden />
                      <span className="max-w-full truncate lg:hidden">{n.short}</span>
                      <span className="hidden truncate lg:inline">{n.label}</span>
                    </button>
                  </li>
                );
              })}
              <li className="hidden border-t border-border pt-2 lg:mt-2 lg:block">
                <button
                  type="button"
                  onClick={logout}
                  className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="size-4" aria-hidden />
                  Se déconnecter
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Contenu */}
        <div className="min-w-0 lg:col-span-9">
          <h2 className="sr-only">{current?.label}</h2>
          {view === "tableau-de-bord" && <Dashboard go={go} />}
          {view === "devis" && <QuotesView />}
          {view === "prix" && <PricesView />}
          {view === "documents" && <DocumentsView />}
          {view === "sav" && <SavView />}
          {view === "compte" && <AccountView onLogout={logout} />}
        </div>
      </div>
    </>
  );
}