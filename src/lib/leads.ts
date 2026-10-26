/**
 * Service d'envoi des demandes (devis, SAV, contact, compte pro, assistant).
 *
 * Frontend only pour l'instant : la demande est mise en forme en français,
 * ouverte dans WhatsApp (wa.me) avec un repli e-mail (mailto).
 * Pour brancher un backend plus tard, remplacer le corps de `submitLead`
 * par un appel API — les formulaires n'ont pas à changer.
 */
import { buildWhatsAppLink, site } from "@/config/site";

export type LeadKind = "devis" | "sav" | "contact" | "compte-pro" | "assistant" | "newsletter";

export interface LeadField {
  label: string;
  value: string | number | undefined | null;
}

export interface LeadItem {
  name: string;
  reference: string;
  qty: number;
}

export interface Lead {
  kind: LeadKind;
  fields: LeadField[];
  items?: LeadItem[];
}

export interface LeadResult {
  reference: string;
  subject: string;
  message: string;
  whatsappUrl: string;
  mailtoUrl: string;
}

const titles: Record<LeadKind, string> = {
  devis: "Demande de devis",
  sav: "Demande d'intervention SAV",
  contact: "Message de contact",
  "compte-pro": "Demande d'ouverture de compte professionnel",
  assistant: "Demande via l'assistant Polytel",
  newsletter: "Inscription newsletter",
};

const prefixes: Record<LeadKind, string> = {
  devis: "DEV",
  sav: "SAV",
  contact: "CTC",
  "compte-pro": "PRO",
  assistant: "AST",
  newsletter: "NEW",
};

/** Numéro de demande lisible : PLT-DEV-261026-4821 */
export function createLeadReference(kind: LeadKind, now = new Date()): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PLT-${prefixes[kind]}-${yy}${mm}${dd}-${rand}`;
}

export function formatLeadMessage(lead: Lead, reference: string): string {
  const lines: string[] = [`Bonjour Polytel,`, ``, `${titles[lead.kind]} — N° ${reference}`];

  if (lead.items && lead.items.length > 0) {
    lines.push(``, `Produits :`);
    for (const item of lead.items) {
      lines.push(`• ${item.name} — Réf. ${item.reference} — Qté : ${item.qty}`);
    }
  }

  const filled = lead.fields.filter(
    (f) => f.value !== undefined && f.value !== null && String(f.value).trim() !== "",
  );
  if (filled.length > 0) {
    lines.push(``, `Coordonnées & informations :`);
    for (const f of filled) lines.push(`${f.label} : ${String(f.value).trim()}`);
  }

  lines.push(``, `Merci.`);
  return lines.join("\n");
}

export function buildLead(lead: Lead): LeadResult {
  const reference = createLeadReference(lead.kind);
  const subject = `${titles[lead.kind]} — ${reference}`;
  const message = formatLeadMessage(lead, reference);
  return {
    reference,
    subject,
    message,
    whatsappUrl: buildWhatsAppLink(message),
    mailtoUrl: `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
  };
}

/**
 * Envoie la demande. Aujourd'hui : ouvre WhatsApp dans un nouvel onglet.
 * Retourne le résultat (référence + liens de repli) pour l'écran de confirmation.
 */
export async function submitLead(
  lead: Lead,
  options: { openWhatsApp?: boolean } = {},
): Promise<LeadResult> {
  const result = buildLead(lead);
  if (options.openWhatsApp !== false && typeof window !== "undefined") {
    try {
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch {
      // Fenêtre bloquée : l'écran de confirmation propose les liens WhatsApp et e-mail.
    }
  }
  return result;
}
