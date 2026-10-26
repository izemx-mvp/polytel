import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Scroll reveal : fondu + montée de 16px, déclenché une fois à ~20 % dans la vue. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "article";
}) {
  const Comp = motion[as];
  // Valeurs initiales identiques serveur/client ; MotionConfig(reducedMotion="user")
  // supprime les déplacements quand prefers-reduced-motion est actif.
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Conteneur dont les enfants <RevealItem> apparaissent en cascade (60 ms). */
export function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={staggerChild}>
      {children}
    </Comp>
  );
}

/** Compteur animé au scroll (statistiques). Désactivé si prefers-reduced-motion. */
export function CountUp({
  to,
  from = 0,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
}: {
  to: number;
  from?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  const started = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    setValue(from);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / (duration * 1000), 1);
            setValue(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, from, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
