import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
}

const FOCUSABLE =
  'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/**
 * Shared modal shell for every TRAM modal: translucent overlay (no blur),
 * X / Escape / outside-click close, auto-focus on the first field, simple focus
 * trap, responsive width, scrollable body with a pinned footer, and background
 * scroll lock while open.
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement as HTMLElement | null;

      if (!active || !panelRef.current?.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const focusTarget =
      panelRef.current?.querySelector<HTMLElement>("input, textarea, select") ??
      panelRef.current?.querySelector<HTMLElement>("button");
    focusTarget?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-charcoal/40 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "flex max-h-[90vh] w-full max-w-md flex-col rounded-lg border border-border bg-background shadow-[0_18px_44px_rgb(41_45_45_/_0.14)]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-display text-lg text-charcoal">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-xs text-warm-gray">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-md p-1.5 text-warm-gray transition-colors hover:bg-ivory hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-4">
          {footer}
        </div>
      </div>
    </div>
  );
}
