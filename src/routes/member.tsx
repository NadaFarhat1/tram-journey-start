import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { joinProject } from "@/lib/tram.functions";

export const Route = createFileRoute("/member")({
  head: () => ({
    meta: [
      { title: "Join a project — TRAM" },
      { name: "description", content: "Enter your project ID and join your team on TRAM." },
      { property: "og:title", content: "Join a project — TRAM" },
      {
        property: "og:description",
        content: "Enter your project ID and join your team on TRAM.",
      },
    ],
  }),
  component: MemberPage,
});

function MemberPage() {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;

    const value = projectId.trim();
    if (!value) {
      setError("Project ID not found.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await joinProject({ data: { projectId: value } });
      if (!result.ok) {
        setError("Project ID not found.");
        setLoading(false);
        return;
      }
      await navigate({ to: "/home" });
    } catch {
      setError("Project ID not found.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h1 className="text-center font-display text-3xl text-charcoal sm:text-4xl">
          Ready to join
        </h1>
        <p className="mt-2 text-center text-sm text-warm-gray">
          Enter your project ID and join your team.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
          <div>
            <input
              id="projectId"
              name="projectId"
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Enter project ID"
              aria-label="Project ID"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "project-id-error" : undefined}
              className="tram-field h-12 px-3.5"
            />
            {error ? (
              <p
                id="project-id-error"
                role="alert"
                className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {error}
              </p>
            ) : null}
          </div>

          <button type="submit" disabled={loading} className="tram-btn w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Joining project...
              </>
            ) : (
              "Join to Project"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
