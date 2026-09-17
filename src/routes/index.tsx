import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resolveLoginEmail } from "@/lib/tram.functions";
import { AuthShell, AuthHeading } from "@/components/tram/auth-shell";
import { AuthTransitionLink } from "@/components/tram/auth-transition-link";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — TRAM" },
      { name: "description", content: "Sign in to TRAM and continue your journey." },
      { property: "og:title", content: "Sign in — TRAM" },
      { property: "og:description", content: "Sign in to TRAM and continue your journey." },
    ],
  }),
  component: LoginPage,
});

const INVALID = "Invalid email/phone or password";

function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError(null);

    const trimmed = identifier.trim();
    if (!trimmed || !password) {
      setError(INVALID);
      return;
    }

    setLoading(true);

    try {
      const { email } = await resolveLoginEmail({ data: { identifier: trimmed } });
      if (!email) {
        setError(INVALID);
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError || !data.user) {
        setError(INVALID);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, setup_complete")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile && !profile.setup_complete) {
        await navigate({ to: profile.role === "leader" ? "/leader" : "/member" });
        return;
      }
      await navigate({ to: "/home" });
    } catch {
      setError(INVALID);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <AuthHeading title="Welcome Back" subtitle="Your journey with TRAM continues here." />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="identifier" className="mb-1.5 block text-xs font-medium text-charcoal">
            Email or phone
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email or phone"
            aria-invalid={error ? true : undefined}
            className="tram-field h-12 px-3.5"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-charcoal">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              aria-invalid={error ? true : undefined}
              className="tram-field h-12 px-3.5 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-warm-gray transition-colors hover:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
          <div className="mt-2 text-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-teal underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            >
              Forgot your password?
            </Link>
          </div>
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

        <div className="flex justify-center pt-1">
          <button type="submit" disabled={loading} className="tram-btn w-1/2 lg:w-[38%]">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-warm-gray">
        Don&apos;t have an account?{" "}
        <AuthTransitionLink
          to="/signup"
          direction="forward"
          className="font-medium text-teal underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          Sign Up
        </AuthTransitionLink>
      </p>
    </AuthShell>
  );
}
