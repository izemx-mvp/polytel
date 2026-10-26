import { Clock, ExternalLink, MapPin, Phone } from "lucide-react";
import { mapEmbedUrl, mapLinkUrl, type Agency } from "@/config/site";

/** Carte agence + plan Google Maps (iframe chargée en différé). */
export function AgencyCard({ agency, primary = false }: { agency: Agency; primary?: boolean }) {
  return (
    <article className="card-hairline flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-muted">
        <iframe
          title={`Plan d'accès — agence Polytel ${agency.city}`}
          src={mapEmbedUrl(agency.mapQuery)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">{primary ? "Siège" : "Agence"}</p>
        <h3 className="mt-2 font-display text-xl font-semibold">{agency.city}</h3>
        <ul className="mt-4 space-y-2.5 text-sm">
          <li className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span>
              {agency.address}
              <br />
              <span className="text-muted-foreground">{agency.postalCity}</span>
            </span>
          </li>
          <li>
            <a href={agency.phoneHref} className="flex items-center gap-2.5 hover:text-primary">
              <Phone className="size-4 shrink-0 text-primary" aria-hidden />
              {agency.phone}
            </a>
          </li>
          <li className="flex items-center gap-2.5 text-muted-foreground">
            <Clock className="size-4 shrink-0 text-primary" aria-hidden />
            Horaires : {agency.hours}
          </li>
        </ul>
        <a
          href={mapLinkUrl(agency.mapQuery)}
          target="_blank"
          rel="noreferrer"
          className="link-underline mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-medium text-primary"
        >
          Itinéraire Google Maps
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </div>
    </article>
  );
}
