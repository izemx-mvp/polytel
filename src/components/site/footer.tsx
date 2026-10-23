import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { categories } from "@/data/categories";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground md:mb-0">
      <div className="mx-auto max-w-7xl px-4 py-14 pb-24 md:pb-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo + pitch */}
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-foreground/70">
              {site.pitch}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Polytel"
                className="inline-flex size-9 items-center justify-center rounded-md border border-ink-border bg-white/5 transition-colors hover:bg-white/15"
              >
                <Facebook className="size-4" aria-hidden />
              </a>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Polytel"
                className="inline-flex size-9 items-center justify-center rounded-md border border-ink-border bg-white/5 transition-colors hover:bg-white/15"
              >
                <Instagram className="size-4" aria-hidden />
              </a>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Polytel"
                className="inline-flex size-9 items-center justify-center rounded-md border border-ink-border bg-white/5 transition-colors hover:bg-white/15"
              >
                <Linkedin className="size-4" aria-hidden />
              </a>
              <a
                href={site.socials.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter) Polytel"
                className="inline-flex size-9 items-center justify-center rounded-md border border-ink-border bg-white/5 transition-colors hover:bg-white/15"
              >
                <Twitter className="size-4" aria-hidden />
              </a>
            </div>
          </div>

          {/* Univers */}
          <nav aria-label="Univers produits">
            <h3 className="text-sm font-semibold tracking-widest text-ink-foreground/60 uppercase">
              Univers
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to="/produits/$univers"
                    params={{ univers: cat.slug }}
                    className="text-ink-foreground/80 transition-colors hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/produits" className="font-medium text-ink-foreground hover:text-white">
                  Tous les produits →
                </Link>
              </li>
            </ul>
          </nav>

          {/* Infos */}
          <nav aria-label="Informations">
            <h3 className="text-sm font-semibold tracking-widest text-ink-foreground/60 uppercase">
              Informations
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm">
              <li>
                <Link to="/marques" className="text-ink-foreground/80 hover:text-white">
                  Nos marques
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="text-ink-foreground/80 hover:text-white">
                  Promotions
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-ink-foreground/80 hover:text-white">
                  Services & SAV
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-ink-foreground/80 hover:text-white">
                  À propos de Polytel
                </Link>
              </li>
              <li>
                <Link to="/devis" className="text-ink-foreground/80 hover:text-white">
                  Demander un devis
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ink-foreground/80 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Agences */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-ink-foreground/60 uppercase">
              Nos agences
            </h3>
            <ul className="mt-4 space-y-5 text-sm">
              {site.agencies.map((a) => (
                <li key={a.city}>
                  <p className="font-semibold text-ink-foreground">{a.city}</p>
                  <p className="mt-1 flex items-start gap-2 text-ink-foreground/70">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    {a.address}
                  </p>
                  <a
                    href={a.phoneHref}
                    className="mt-1 flex items-center gap-2 text-ink-foreground/70 hover:text-white"
                  >
                    <Phone className="size-3.5 shrink-0" aria-hidden />
                    {a.phone}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.emailHref}
                  className="flex items-center gap-2 text-ink-foreground/70 hover:text-white"
                >
                  <Mail className="size-3.5 shrink-0" aria-hidden />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ink-border pt-6 text-xs text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} POLYTEL — Négociant Import-Export. Tous droits réservés.</p>
          <p>Importateur officiel Brother au Maroc · Distributeur certifié DAMS Brother</p>
        </div>
      </div>
    </footer>
  );
}
