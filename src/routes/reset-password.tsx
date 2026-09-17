import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, AuthHeading } from "@/components/tram/auth-shell";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — TRAM" },
      { name: "description", content: "Choose a new password for your TRAM account." },
      { property: "og:title", content: "Set a new password — TRAM" },
      { property: "og:description", content: "Choose a new password for your TRAM account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must be at least 8 characters and contain letters and numbers.");
      return;
    }

    setError(null);
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await supabase.auth.signOut();
    toast.success("Password updated");
    await navigate({ to: "/" });
  }

  return (
    <AuthShell>
      <AuthHeading title="Set a new password" subtitle="Choose a password you'll remember." />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="newPassword" className="mb-1.5 block text-xs font-medium text-charcoal">
            New password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              aria-invalid={error ? true : undefined}
              className="tram-field h-12 px-3.5 pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-warm-gray transition-colors hover:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            >
              {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
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
                Saving...
              </>
            ) : (
              "Save password"
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
