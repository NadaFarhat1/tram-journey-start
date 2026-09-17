import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Info, Loader2, AlertCircle } from "lucide-react";
import { createProject } from "@/lib/tram.functions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Route = createFileRoute("/leader")({
  head: () => ({
    meta: [
      { title: "Start a project — TRAM" },
      { name: "description", content: "Create your first TRAM project." },
      { property: "og:title", content: "Start a project — TRAM" },
      { property: "og:description", content: "Create your first TRAM project." },
    ],
  }),
  component: LeaderPage,
});

function LeaderPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;

    const value = name.trim();
    if (!value) {
      setError("Please enter a project name.");
      return;
    }
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value)) {
      setError("Project name must start with a letter.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await createProject({ data: { name: value } });
      await navigate({ to: "/home" });
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h1 className="text-center font-display text-3xl text-charcoal sm:text-4xl">
          Let&rsquo;s get started.
        </h1>
        <p className="mt-2 text-center text-sm text-warm-gray">
          Your next project starts here.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
          <div>
            <div className="relative">
              <input
                id="projectName"
                name="projectName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project Name"
                aria-label="Project Name"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "project-name-error" : undefined}
                className="tram-field h-12 px-3.5 pr-11"
              />
              <Popover>
                <PopoverTrigger
                  type="button"
                  aria-label="Project name rules"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-warm-gray transition-colors hover:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                >
                  <Info className="h-[18px] w-[18px]" />
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 text-xs text-charcoal">
                  <ul className="space-y-1">
                    <li>Project name must start with a letter.</li>
                    <li>You can use letters and numbers after that.</li>
                    <li>Example: Project123</li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
            {error ? (
              <p
                id="project-name-error"
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
                Creating project...
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
