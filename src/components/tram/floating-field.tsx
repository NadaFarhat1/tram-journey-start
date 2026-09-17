import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
  trailing?: ReactNode;
  labelExtra?: ReactNode;
}

export const FloatingField = forwardRef<HTMLInputElement, FloatingFieldProps>(
  ({ label, error, trailing, labelExtra, id, className, ...props }, ref) => {
    const fieldId = id ?? props.name;
    const errorId = error ? `${fieldId}-error` : undefined;

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            placeholder=" "
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            className={cn(
              "tram-field peer h-14 px-3.5 pt-6 pb-2",
              trailing && "pr-11",
              className,
            )}
            {...props}
          />
          <label
            htmlFor={fieldId}
            className="pointer-events-none absolute left-3.5 top-1.5 text-[0.7rem] font-medium text-warm-gray transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[0.9375rem] peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-focus:text-teal"
          >
            {label}
          </label>
          {labelExtra ? (
            <span className="absolute right-10 top-1/2 -translate-y-1/2">{labelExtra}</span>
          ) : null}
          {trailing ? (
            <span className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</span>
          ) : null}
        </div>
        {error ? (
          <p id={errorId} className="mt-1.5 text-xs font-medium text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

FloatingField.displayName = "FloatingField";
