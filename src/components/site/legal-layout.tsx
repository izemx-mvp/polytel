import { Breadcrumbs } from "@/components/site/layout-primitives";

export interface LegalSection {
  id: string;
  title: string;
  body: string[];
}

/** Mise en page des pages juridiques : sommaire collant + articles numérotés. */
export function LegalLayout({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Accueil", to: "/" }, { label: title }]} />
          <p className="eyebrow mt-10">Informations légales</p>
          <h1 className="display-lg mt-3">{title}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{intro}</p>
          <p className="mt-4 inline-flex rounded-md bg-cta-soft px-2.5 py-1 font-mono text-[11px] text-warm-foreground">
            Dernière mise à jour : {updated} — TEXTE PROVISOIRE À FAIRE VALIDER
          </p>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-12 lg:px-8">
        <nav aria-label="Sommaire" className="lg:col-span-3">
          <ol className="space-y-1 text-sm lg:sticky lg:top-36">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <span className="mr-2 font-mono text-[11px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="space-y-10 lg:col-span-7">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-36">
              <h2 className="font-display text-xl font-semibold">
                <span className="mr-3 font-mono text-sm text-primary">
                  Article {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="mt-3 leading-relaxed text-foreground/80">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
