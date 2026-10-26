import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  CalendarClock,
  Check,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/logo";
import { WhatsAppIcon, XIcon, YouTubeIcon } from "@/components/site/icons";
import { categories } from "@/data/categories";
import { buildWhatsAppLink, site } from "@/config/site";

const infoLinks = [
  { label: "Qui sommes-nous", to: "/a-propos" },
  { label: "Nos marques", to: "/marques" },
  { label: "SAV", to: "/services", hash: "sav" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
] as const;

const shortcuts = [
  { label: "Demande de devis", to: "/devis" },
  { label: "Promotions", to: "/promotions" },
  { label: "Destockage", to: "/destockage" },
  { label: "E-catalogues", to: "/catalogues" },
  { label: "Espace client", to: "/connexion" },
] as const;

const socials = [
  { label: "Facebook", href: site.socials.facebook, icon: Facebook },
  { label: "Instagram", href: site.socials.instagram, icon: Instagram },
  { label: "LinkedIn", href: site.socials.linkedin, icon: Linkedin },
  { label: "X (Twitter)", href: site.socials.twitter, icon: XIcon },
  { label: "YouTube", href: site.socials.youtube, icon: YouTubeIcon },
];

const proofs = [
  { icon: CalendarClock, title: `Fondée en ${site.foundedYear}`, text: "Plus de 35 ans d'expérience" },
  { icon: BadgeCheck, title: "Importateur officiel Brother", text: "Au Maroc" },
  { icon: PackageCheck, title: "35+ marques", text: "Produits 100 % d'origine" },
  { icon: ShieldCheck, title: "SAV certifié DAMS", text: "Installation & maintenance" },
];

const linkCls = "link-underline text-ink-foreground/80 hover:text-ink-foreground";

/* ---------------- Newsletter ---------------- */

function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-ink-border bg-white/5 p-4">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-cta text-cta-foreground">
          <Check className="size-4" aria-hidden />
        </span>
        <div className="text-sm">
          <p className="font-semibold">Inscription enregistrée</p>
          <button type="button" onClick={() => setDone(false)} className="mt-1 text-xs text-ink-muted underline-offset-2 hover:underline">
            Inscrire une autre adresse
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          setError("Veuillez saisir une adresse e-mail valide.");
          return;
        }
        setError(null);
        setEmail("");
        setDone(true);
        toast.success("Inscription enregistrée", {
          description: "Vous recevrez nos nouveautés et offres professionnelles.",
        });
      }}
      className="mt-4"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Adresse e-mail professionnelle
      </label>
      <div className="relative">
        <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@entreprise.ma"
          aria-invalid={Boolean(error)}
          {...(error ? { "aria-describedby": "newsletter-error" } : {})}
          className="h-11 w-full rounded-xl border border-ink-border bg-white/5 pr-12 pl-9 text-sm text-ink-foreground outline-none placeholder:text-ink-muted focus-visible:ring-2 focus-visible:ring-cta"
        />
        <button
          type="submit"
          className="absolute top-1/2 right-1.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-cta text-cta-foreground transition-colors hover:bg-cta-hover focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          aria-label="S'inscrire à la newsletter"
        >
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
      {error && (
        <p id="newsletter-error" className="mt-2 text-xs text-cta">
          {error}
        </p>
      )}
      <p className="mt-2 text-[11px] text-ink-muted">Une fois par mois · désinscription en un clic.</p>
    </form>
  );
}

/* ---------------- Footer ---------------- */

export function Footer() {
  return (
    <footer className="crop-marks relative overflow-hidden bg-ink text-ink-foreground">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      {/* Bandeau preuves */}
      <div className="relative border-b border-ink-border">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-ink-border lg:grid-cols-4">
          {proofs.map((p) => (
            <li key={p.title} className="flex items-center gap-3 bg-ink px-4 py-6 sm:px-6 lg:px-8">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-ink-border bg-white/5">
                <p.icon className="size-5 text-cta" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">{p.title}</p>
                <p className="truncate text-xs text-ink-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-28 sm:px-6 md:pt-16 md:pb-10 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Marque + contact rapide */}
          <div className="lg:col-span-4">
            <Link to="/" aria-label="POLYTEL — Accueil" className="inline-block">
              <Logo onDark />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">{site.pitch}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-border px-3 py-1 text-xs font-medium">
              <BadgeCheck className="size-3.5 text-cta" aria-hidden />
              Distributeur Agréé Maintenance & Services Brother
            </p>
            <div className="mt-6 grid max-w-sm grid-cols-2 gap-2">
              <a
                href={site.phoneHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cta text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover"
              >
                <Phone className="size-4" aria-hidden />
                Appeler
              </a>
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-ink-border bg-white/5 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                <WhatsAppIcon className="size-4 text-whatsapp" aria-hidden />
                WhatsApp
              </a>
            </div>
            <ul className="mt-6 flex gap-2" aria-label="Réseaux sociaux">
              {socials
                .filter((s) => Boolean(s.href))
                .map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Polytel sur ${s.label}`}
                      className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-border bg-white/5 transition-colors hover:border-white/30 hover:bg-white/10"
                    >
                      <s.icon className="size-4" aria-hidden />
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            <nav aria-label="Univers produits" className="col-span-2 sm:col-span-1">
              <h2 className="eyebrow text-ink-muted">Univers produits</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-1">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link to="/produits/$univers" params={{ univers: cat.slug }} className={linkCls}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/espace-couture" className={linkCls}>
                    Espace couture
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Informations">
              <h2 className="eyebrow text-ink-muted">Informations</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {infoLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      {...("hash" in l ? { hash: l.hash } : {})}
                      className={linkCls}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="eyebrow mt-8 text-ink-muted">Raccourcis</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {shortcuts.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={linkCls}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="eyebrow text-ink-muted">Agences</h2>
              <ul className="mt-4 space-y-5 text-sm">
                {site.agencies.map((a) => (
                  <li key={a.city}>
                    <p className="font-semibold">{a.city}</p>
                    <p className="mt-1 flex items-start gap-2 text-ink-muted">
                      <MapPin className="mt-1 size-3.5 shrink-0" aria-hidden />
                      {a.address}
                    </p>
                    <a href={a.phoneHref} className="mt-1 flex items-center gap-2 font-mono text-xs text-ink-muted hover:text-ink-foreground">
                      <Phone className="size-3.5 shrink-0" aria-hidden />
                      {a.phone}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={site.emailHref} className="flex items-center gap-2 break-all text-ink-muted hover:text-ink-foreground">
                    <Mail className="size-3.5 shrink-0" aria-hidden />
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className="eyebrow text-ink-muted">Newsletter</h2>
              <p className="mt-4 text-sm text-ink-muted">Nouveautés, promotions et e-catalogues.</p>
              <Newsletter />
            </div>
          </div>
        </div>

        {/* Signature */}
        <p
          className="pointer-events-none mt-16 font-display text-[18vw] leading-[0.8] font-bold tracking-tighter text-white/[0.04] select-none lg:text-[11rem]"
          aria-hidden
        >
          POLYTEL
        </p>

        <div className="scan-divider bg-ink-border" aria-hidden />
        <div className="flex flex-col gap-4 pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} POLYTEL — Tous droits réservés.</p>
          <div className="flex items-center gap-5">
            <Link to="/mentions-legales" className="hover:text-ink-foreground">
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:text-ink-foreground">
              CGV
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-border px-2.5 py-1.5 transition-colors hover:border-white/30 hover:text-ink-foreground"
            >
              <ArrowUp className="size-3.5" aria-hidden />
              Haut de page
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}