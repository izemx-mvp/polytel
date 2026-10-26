import type { HTMLInputAutoCompleteAttribute } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Mail } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhatsAppIcon } from "@/components/site/icons";
import type { LeadResult } from "@/lib/leads";
import { cn } from "@/lib/utils";

interface FieldBase<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

function FieldLabel({ label, required }: { label: string; required?: boolean | undefined }) {
  return (
    <FormLabel className="text-[13px] font-medium">
      {label}
      {required ? (
        <span className="text-destructive" aria-hidden>
          {" "}
          *
        </span>
      ) : (
        <span className="font-normal text-muted-foreground"> (optionnel)</span>
      )}
    </FormLabel>
  );
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  className,
  type = "text",
  autoComplete,
}: FieldBase<T> & { type?: string; autoComplete?: HTMLInputAutoCompleteAttribute }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FieldLabel label={label} required={required} />
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-required={required}
              className="h-11 bg-card"
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  className,
  rows = 5,
}: FieldBase<T> & { rows?: number }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FieldLabel label={label} required={required} />
          <FormControl>
            <Textarea
              rows={rows}
              placeholder={placeholder}
              aria-required={required}
              className="bg-card"
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Sélectionner…",
  required,
  className,
}: FieldBase<T> & { options: readonly { value: string; label: string }[] }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FieldLabel label={label} required={required} />
          <Select onValueChange={field.onChange} value={field.value ?? ""}>
            <FormControl>
              <SelectTrigger className="h-11 w-full bg-card" aria-required={required}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Choix en cartes (radio) — ex. type de client. */
export function ChoiceField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  required,
  className,
}: FieldBase<T> & { options: readonly { value: string; label: string }[] }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FieldLabel label={label} required={required} />
          <div
            role="radiogroup"
            aria-label={label}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {options.map((o) => {
              const checked = field.value === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => field.onChange(o.value)}
                  className={cn(
                    "h-11 rounded-lg border px-3 text-sm font-medium transition-colors",
                    checked
                      ? "border-primary bg-blue-tint text-primary"
                      : "border-input bg-card hover:border-primary/40",
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Écran de confirmation commun à toutes les demandes. */
export function LeadSuccess({
  result,
  title,
  description,
  onReset,
  resetLabel = "Nouvelle demande",
}: {
  result: LeadResult;
  title: string;
  description: string;
  onReset?: () => void;
  resetLabel?: string;
}) {
  return (
    <div className="card-hairline p-8 text-center sm:p-12" role="status">
      <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-success/12 text-success">
        <CheckCircle2 className="size-7" aria-hidden />
      </span>
      <h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">{description}</p>
      <p className="mx-auto mt-6 inline-flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/50 px-6 py-3">
        <span className="text-xs text-muted-foreground">Numéro de demande</span>
        <span className="font-mono text-lg font-semibold tracking-wide">{result.reference}</span>
      </p>
      <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
        WhatsApp ne s'est pas ouvert ? Envoyez votre demande par l'un de ces canaux :
      </p>
      <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="outline" size="xl" asChild>
          <a href={result.whatsappUrl} target="_blank" rel="noreferrer">
            <WhatsAppIcon className="text-whatsapp" aria-hidden />
            Ouvrir WhatsApp
          </a>
        </Button>
        <Button variant="outline" size="xl" asChild>
          <a href={result.mailtoUrl}>
            <Mail aria-hidden />
            Envoyer par email
          </a>
        </Button>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="link-underline font-medium text-primary"
          >
            {resetLabel}
          </button>
        )}
        <Link to="/produits" className="link-underline font-medium text-primary">
          Retour au catalogue
        </Link>
      </div>
    </div>
  );
}
