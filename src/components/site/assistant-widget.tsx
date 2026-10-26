import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUp, BookOpen, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/site/product-visual";
import { useQuote } from "@/lib/quote";
import { WELCOME, sendMessage, type AssistantMessage, type AssistantReply } from "@/lib/assistant";
import { submitLead } from "@/lib/leads";
import type { Product } from "@/data/products";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

let idSeq = 0;
const nextId = () => `m${Date.now()}-${idSeq++}`;

/* ---------------- Rendu markdown léger ---------------- */

function Inline({ text, onLink }: { text: string; onLink: (href: string) => void }) {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) parts.push(<strong key={k++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("[")) {
      const label = tok.slice(1, tok.indexOf("]"));
      const href = tok.slice(tok.indexOf("(") + 1, -1);
      parts.push(
        <a
          key={k++}
          href={href}
          onClick={(e) => {
            if (href.startsWith("/")) {
              e.preventDefault();
              onLink(href);
            }
          }}
          className="font-medium text-primary underline underline-offset-2"
        >
          {label}
        </a>,
      );
    } else parts.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Markdown({ text, onLink }: { text: string; onLink: (href: string) => void }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-0.5 pl-4">
              {lines.map((l, j) => (
                <li key={j}>
                  <Inline text={l.slice(2)} onLink={onLink} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <Inline text={l} onLink={onLink} />
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/* ---------------- Carte produit compacte ---------------- */

function ChatProduct({ product, onNavigate }: { product: Product; onNavigate: () => void }) {
  const { add } = useQuote();
  const btn = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-card p-2.5">
      <ProductVisual
        product={product}
        compact
        width={64}
        height={64}
        className="product-surface size-16 shrink-0 rounded-lg border border-border"
        imgClassName="p-1.5"
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-[13px] font-semibold">{product.name}</p>
        <p className="font-mono text-[11px] text-muted-foreground">Réf. {product.reference}</p>
        <div className="mt-1.5 flex gap-1.5">
          <button
            ref={btn}
            type="button"
            onClick={() => add(product.id, 1, btn.current)}
            className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-3" aria-hidden />
            Ajouter au devis
          </button>
          <Link
            to="/produit/$slug"
            params={{ slug: product.slug }}
            onClick={onNavigate}
            className="inline-flex h-7 items-center rounded-md border border-border px-2 text-[11px] font-medium hover:border-primary hover:text-primary"
          >
            Voir
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Mini-formulaire de rappel ---------------- */

const leadSchema = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom."),
  societe: z.string().trim().optional(),
  telephone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s.-]{7,}$/, "Numéro de téléphone invalide."),
  besoin: z.string().trim().min(5, "Décrivez votre besoin en quelques mots."),
});
type LeadValues = z.infer<typeof leadSchema>;

function LeadCapture({ onDone }: { onDone: (reference: string) => void }) {
  const form = useForm<LeadValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { nom: "", societe: "", telephone: "", besoin: "" },
  });
  const { errors, isSubmitting } = form.formState;
  const field = (name: keyof LeadValues, label: string, type = "text") => (
    <div>
      <label className="sr-only" htmlFor={`lead-${name}`}>
        {label}
      </label>
      <input
        id={`lead-${name}`}
        type={type}
        placeholder={label}
        aria-invalid={Boolean(errors[name])}
        {...form.register(name)}
        className="h-9 w-full rounded-lg border border-input bg-card px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
      />
      {errors[name] && (
        <p className="mt-0.5 text-[11px] text-destructive">{errors[name]?.message}</p>
      )}
    </div>
  );
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(async (v) => {
        const res = await submitLead({
          kind: "assistant",
          fields: [
            { label: "Nom", value: v.nom },
            { label: "Société", value: v.societe },
            { label: "Téléphone", value: v.telephone },
            { label: "Besoin", value: v.besoin },
          ],
        });
        onDone(res.reference);
      })}
      className="space-y-2 rounded-xl border border-border bg-card p-3"
    >
      <p className="text-xs font-semibold">Être rappelé par un conseiller</p>
      {field("nom", "Nom *")}
      {field("societe", "Société")}
      {field("telephone", "Téléphone *", "tel")}
      {field("besoin", "Votre besoin *")}
      <Button type="submit" variant="cta" size="sm" className="w-full" disabled={isSubmitting}>
        Envoyer ma demande
      </Button>
    </form>
  );
}

/* ---------------- Widget ---------------- */

export function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { id: "welcome", role: "assistant", ...WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const reduced = useReducedMotion();

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const closeOnMobile = () => {
    if (window.matchMedia("(max-width: 639px)").matches) onClose();
  };

  const navigateTo = (href: string) => {
    router.history.push(href);
    closeOnMobile();
  };

  const push = (m: AssistantReply & { role: AssistantMessage["role"] }) =>
    setMessages((prev) => [...prev, { ...m, id: nextId() }]);

  const ask = async (text: string) => {
    const value = text.trim();
    if (!value || typing) return;
    const history = messages;
    push({ role: "user", text: value });
    setInput("");
    setTyping(true);
    try {
      const reply = await sendMessage(value, history);
      push({ role: "assistant", ...reply });
    } finally {
      setTyping(false);
    }
  };

  const lastId = messages[messages.length - 1]?.id;

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="dialog"
          aria-modal="false"
          aria-label="Assistant Polytel"
          initial={{ opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ transformOrigin: "bottom right" }}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-background sm:inset-auto sm:right-5 sm:bottom-5 sm:h-[min(640px,calc(100vh-40px))] sm:w-[400px] sm:rounded-2xl sm:border sm:border-border sm:shadow-lift"
        >
          <header className="glass relative z-10 flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="relative inline-flex size-10 items-center justify-center overflow-hidden rounded-xl bg-card shadow-soft">
              <img
                src="/images/polytel-mark.png"
                alt=""
                width={96}
                height={94}
                className="size-8 object-contain"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold">Assistant Polytel</p>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-success" aria-hidden />
                En ligne
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-muted"
              aria-label="Fermer l'assistant"
            >
              <X className="size-4" aria-hidden />
            </button>
          </header>

          <div
            ref={scroller}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-2",
                  m.role === "user" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md border border-border bg-card",
                  )}
                >
                  {m.role === "assistant" ? <Markdown text={m.text} onLink={navigateTo} /> : m.text}
                </div>
                {m.products && m.products.length > 0 && (
                  <div className="w-full space-y-2">
                    {m.products.map((p) => (
                      <ChatProduct key={p.id} product={p} onNavigate={closeOnMobile} />
                    ))}
                  </div>
                )}
                {m.posts && m.posts.length > 0 && (
                  <div className="w-full space-y-2">
                    {m.posts.map((p) => (
                      <Link
                        key={p.slug}
                        to="/blog/$slug"
                        params={{ slug: p.slug }}
                        onClick={closeOnMobile}
                        className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-[13px] font-medium hover:border-primary"
                      >
                        <BookOpen className="size-4 shrink-0 text-primary" aria-hidden />
                        {p.title}
                      </Link>
                    ))}
                  </div>
                )}
                {m.leadForm && m.id === lastId && (
                  <div className="w-full">
                    <LeadCapture
                      onDone={(ref) =>
                        push({
                          role: "assistant",
                          text: `Merci ! Votre demande **${ref}** a été préparée et s'ouvre dans WhatsApp. Si rien ne s'est ouvert, écrivez-nous à **${site.email}** en rappelant ce numéro.`,
                        })
                      }
                    />
                  </div>
                )}
                {m.chips && m.id === lastId && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.chips.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => void ask(c)}
                        className="rounded-full border border-primary/25 bg-blue-tint px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div
                className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3"
                aria-label="L'assistant écrit…"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-muted-foreground"
                    animate={reduced ? {} : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void ask(input);
            }}
            className="border-t border-border bg-card p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center gap-2 rounded-xl border border-input bg-background pr-1.5 pl-3 focus-within:ring-2 focus-within:ring-ring">
              <label htmlFor="assistant-input" className="sr-only">
                Votre message
              </label>
              <input
                ref={inputRef}
                id="assistant-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Référence, produit, besoin…"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
                aria-label="Envoyer"
              >
                <ArrowUp className="size-4" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-center text-[10.5px] text-muted-foreground">
              Assistant automatisé — aucun prix ni délai n'est communiqué ici.
            </p>
          </form>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
