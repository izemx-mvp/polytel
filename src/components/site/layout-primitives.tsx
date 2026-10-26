import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Minus, Phone, Plus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/motion-primitives";
import { buildWhatsAppLink, site } from "@/config/site";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site/icons";

/* ---------------- Titre de section ---------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  action,
  as: Tag = "h2",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  action?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className={cn("eyebrow", dark && "text-cta")}>
          <span className={cn("h-px w-6 bg-current opacity-60")} aria-hidden />
          {eyebrow}
        </p>
        <Tag className={cn("display-md mt-3 text-balance", dark && "text-ink-foreground")}>
          {title}
        </Tag>
        {description && (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed md:text-lg",
              dark ? "text-ink-muted" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

/* ---------------- Fil d'Ariane ---------------- */

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function Breadcrumbs({
  items,
  dark = false,
  className,
}: {
  items: Crumb[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label="Fil d'Ariane" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1 text-[13px]",
          dark ? "text-ink-muted" : "text-muted-foreground",
        )}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.to && !last ? (
                <Link
                  to={item.to}
                  params={item.params as never}
                  className={cn(
                    "link-underline transition-colors",
                    dark ? "hover:text-ink-foreground" : "hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "font-medium",
                    dark ? "text-ink-foreground" : "text-foreground",
                    last && "max-w-[60vw] truncate",
                  )}
                >
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------------- En-tête de page ---------------- */

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  dark = true,
  children,
  aside,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  dark?: boolean;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        dark ? "crop-marks bg-ink text-ink-foreground" : "border-b border-border bg-card",
        className,
      )}
    >
      <div
        className={cn("pointer-events-none absolute inset-0", dark ? "dot-grid" : "dot-grid-light")}
        aria-hidden
        style={{ maskImage: "radial-gradient(70% 90% at 80% 0%, black, transparent 75%)" }}
      />
      {dark && (
        <div
          className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-primary/35 blur-[120px]"
          aria-hidden
        />
      )}
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-12 lg:items-end lg:px-8">
        <div className={cn(aside ? "lg:col-span-7" : "lg:col-span-9")}>
          {crumbs && <Breadcrumbs items={crumbs} dark={dark} className="mb-8" />}
          <Reveal>
            <p className={cn("eyebrow", dark && "text-cta")}>
              <span className="h-px w-6 bg-current opacity-60" aria-hidden />
              {eyebrow}
            </p>
            <h1 className="display-lg mt-4 text-balance">{title}</h1>
            {description && (
              <p
                className={cn(
                  "mt-5 max-w-2xl text-base leading-relaxed md:text-lg",
                  dark ? "text-ink-muted" : "text-muted-foreground",
                )}
              >
                {description}
              </p>
            )}
          </Reveal>
          {children && <Reveal delay={0.08}>{children}</Reveal>}
        </div>
        {aside && (
          <Reveal delay={0.12} className="lg:col-span-5">
            {aside}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------------- État vide ---------------- */

export function EmptyState({
  title,
  description,
  onReset,
  className,
}: {
  title: string;
  description: string;
  onReset?: (() => void) | undefined;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card-hairline flex flex-col items-center gap-3 px-6 py-16 text-center",
        className,
      )}
    >
      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-blue-tint text-primary">
        <SearchX className="size-6" aria-hidden />
      </span>
      <p className="mt-2 font-display text-lg font-semibold">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {onReset && (
          <Button variant="outline" onClick={onReset}>
            Réinitialiser les filtres
          </Button>
        )}
        <Button variant="cta" asChild>
          <Link to="/devis">Demander ce produit sur devis</Link>
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.dispatchEvent(new CustomEvent("polytel:assistant-open"))}
        >
          Demander à l'assistant
        </Button>
      </div>
    </div>
  );
}

/* ---------------- Sélecteur de quantité ---------------- */

export function QuantityStepper({
  value,
  onChange,
  label,
  size = "md",
  min = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  size?: "sm" | "md";
  min?: number;
}) {
  const box = size === "sm" ? "size-7" : "size-10";
  return (
    <div
      className="inline-flex items-center rounded-lg border border-input bg-card"
      role="group"
      aria-label={`Quantité — ${label}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          box,
          "flex items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40",
        )}
        aria-label={`Diminuer la quantité de ${label}`}
        disabled={value <= min}
      >
        <Minus className="size-3.5" aria-hidden />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={value}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(9999, n)));
        }}
        className={cn(
          "w-10 [appearance:textfield] bg-transparent text-center font-mono text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none",
          size === "md" && "w-12",
        )}
        aria-label={`Quantité de ${label}`}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(9999, value + 1))}
        className={cn(
          box,
          "flex items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        )}
        aria-label={`Augmenter la quantité de ${label}`}
      >
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}

/* ---------------- Bandeau CTA final ---------------- */

export function CtaBand({
  title = "Un projet d'équipement ? Recevez votre devis rapidement.",
  description = "Prix réservés aux professionnels : décrivez votre besoin, un conseiller Polytel vous répond avec une offre adaptée.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <Reveal>
        <div className="crop-marks relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-ink-foreground sm:px-12 md:py-20">
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div
            className="pointer-events-none absolute -bottom-40 -left-20 size-[460px] rounded-full bg-primary/40 blur-[110px]"
            aria-hidden
          />
          <div className="scan-beam" aria-hidden />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="eyebrow text-cta">
              <span className="h-px w-6 bg-current opacity-60" aria-hidden />
              Devis professionnel
            </p>
            <h2 className="display-md mt-4 text-balance">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-muted">{description}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button variant="cta" size="xl" asChild>
                <Link to="/devis">Demander un devis</Link>
              </Button>
              <Button variant="ghost-dark" size="xl" asChild>
                <a href={site.phoneHref}>
                  <Phone aria-hidden />
                  {site.phone}
                </a>
              </Button>
              <Button variant="ghost-dark" size="xl" asChild>
                <a href={buildWhatsAppLink()} target="_blank" rel="noreferrer">
                  <WhatsAppIcon aria-hidden />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Conteneur de page ---------------- */

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}
