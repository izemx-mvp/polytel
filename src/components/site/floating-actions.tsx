import { lazy, Suspense, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MessageSquareText } from "lucide-react";
import { WhatsAppIcon } from "@/components/site/icons";
import { buildWhatsAppLink, site } from "@/config/site";
import { cn } from "@/lib/utils";

const AssistantPanel = lazy(() =>
  import("@/components/site/assistant-widget").then((m) => ({ default: m.AssistantPanel })),
);

/** Actions flottantes (bas-droite) : WhatsApp + lanceur de l'assistant. */
export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onProductPage = pathname.startsWith("/produit/");

  useEffect(() => {
    const openAssistant = () => {
      setLoaded(true);
      setOpen(true);
    };
    window.addEventListener("polytel:assistant-open", openAssistant);
    return () => window.removeEventListener("polytel:assistant-open", openAssistant);
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed right-4 z-50 flex flex-col items-end gap-3 transition-opacity md:right-6 md:bottom-6",
          onProductPage ? "bottom-24" : "bottom-20",
          open && "pointer-events-none opacity-0",
        )}
      >
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noreferrer"
          aria-label={`Écrire à Polytel sur WhatsApp (${site.whatsappNote})`}
          className="inline-flex size-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-transform hover:scale-105"
        >
          <WhatsAppIcon className="size-6" aria-hidden />
        </a>
        <button
          type="button"
          onMouseEnter={() => setLoaded(true)}
          onFocus={() => setLoaded(true)}
          onClick={() => {
            setLoaded(true);
            setOpen(true);
          }}
          aria-label="Ouvrir l'assistant Polytel"
          aria-expanded={open}
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink pr-5 pl-4 text-sm font-semibold text-ink-foreground shadow-lift transition-transform hover:scale-[1.03]"
        >
          <span className="relative">
            <MessageSquareText className="size-5" aria-hidden />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-cta ring-2 ring-ink" />
          </span>
          <span className="hidden sm:inline">Assistant</span>
        </button>
      </div>
      {loaded && (
        <Suspense fallback={null}>
          <AssistantPanel open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
