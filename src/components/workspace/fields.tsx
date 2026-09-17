import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-warm-gray">
      {children}
    </label>
  );
}

export function FieldError({ children }: { children?: string | undefined }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{children}</p>;
}

/** Label + optional hint + control + error, so every form row looks identical. */
export function FormField({
  htmlFor,
  label,
  hint,
  error,
  children,
  className,
}: {
  htmlFor: string;
  label: string;
  hint?: ReactNode;
  error?: string | undefined;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {hint ? <p className="mb-1.5 text-xs text-warm-gray">{hint}</p> : null}
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("tram-field h-11 px-3.5", className)} />;
}

export function DateInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <TextInput type="date" {...props} className={className} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("tram-field min-h-[84px] px-3.5 py-2.5", className)} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("tram-field h-11 px-3.5", className)} />;
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  return (
    <button
      type={type}
      {...props}
      className={cn(
        variant === "primary"
          ? "tram-btn"
          : "inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-[0.9375rem] font-medium text-charcoal transition-colors hover:bg-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Kept for existing call sites; same styling as <Button variant="ghost">. */
export function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button variant="ghost" {...props} />;
}
