import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, AuthHeading } from "@/components/tram/auth-shell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — TRAM" },
      { name: "description", content: "Reset the password for your TRAM account." },
      { property: "og:title", content: "Forgot password — TRAM" },
      { property: "og:description", content: "Reset the password for your TRAM account." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError(null);

    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(value, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell>
      <AuthHeading
        title="Forgot your password?"
        subtitle="We'll email you a link to reset it."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-charcoal">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-invalid={error ? true : undefined}
            className="tram-field h-12 px-3.5"
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="flex items-center gap-2 rounded-md border border-destructive/35 bg-destructive/8 px-3 py-2.5 text-sm font-medium text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : null}

        {sent ? (
          <p
            role="status"
            className="flex items-center gap-2 rounded-md border border-success/35 bg-success/10 px-3 py-2.5 text-sm font-medium text-success"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            Reset link sent. Check your email.
          </p>
        ) : null}

        <div className="flex justify-center pt-1">
          <button type="submit" disabled={loading} className="tram-btn w-1/2 lg:w-[38%]">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-warm-gray">
        <Link
          to="/"
          className="font-medium text-teal underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
