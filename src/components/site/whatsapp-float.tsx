import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, site } from "@/config/site";

export function WhatsAppFloat() {
  return (
    <a
      href={buildWhatsAppLink(
        "Bonjour POLYTEL, je souhaite obtenir des informations sur vos produits.",
      )}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed right-4 bottom-20 z-50 inline-flex size-12 items-center justify-center rounded-full bg-cta text-cta-foreground shadow-lg transition-transform hover:scale-105 md:bottom-6"
    >
      <MessageCircle className="size-6" aria-hidden />
      <span className="sr-only">Contacter POLYTEL sur WhatsApp ({site.whatsappNote})</span>
    </a>
  );
}
