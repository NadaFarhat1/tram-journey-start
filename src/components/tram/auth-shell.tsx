import type { ReactNode } from "react";
import { VisualPanel } from "./visual-panel";

/**
 * Split layout: ~60% form / ~40% abstract visual on desktop.
 * On mobile the visual sits above the form.
 * Pass visualLeft to mirror the layout (visual on the left, form on the right).
 */
export function AuthShell({
  children,
  visualLeft = false,
}: {
  children: ReactNode;
  visualLeft?: boolean;
}) {
  return (
    <div
      className={`flex min-h-screen flex-col bg-background lg:flex-row ${
        visualLeft ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="auth-form-panel order-2 flex w-full flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:order-1 lg:w-[60%] lg:flex-none lg:px-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      <div className="auth-visual-panel order-1 lg:order-2 lg:h-auto lg:w-[40%]">
        <VisualPanel />
      </div>
    </div>
  );
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-8">
      <span className="mb-6 block font-display text-lg tracking-[0.35em] text-teal">TRAM</span>
      <h1 className="font-display text-3xl text-charcoal sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-warm-gray">{subtitle}</p>
    </header>
  );
}
