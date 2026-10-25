/**
 * Canaux d'envoi des formulaires (devis, contact, SAV) — frontend only.
 * Le message est construit en français lisible puis envoyé via WhatsApp,
 * avec un repli e-mail (mailto) proposé sur l'écran de confirmation.
 */
import { site } from "@/config/site";

export function whatsappHref(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mailtoHref(subject: string, body: string): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openWhatsApp(message: string): void {
  window.open(whatsappHref(message), "_blank", "noopener");
}
