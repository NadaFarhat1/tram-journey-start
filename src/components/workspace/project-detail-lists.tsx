import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "./workspace-context";

const SEVERITY_CLASS: Record<string, string> = {
  High: "text-destructive",
  Medium: "text-charcoal",
  Low: "text-warm-gray",
};

export function RiskAlertsPage() {
  const { projects, removeRisk } = useWorkspace();

  return (
    <section className="px-6 py-10 sm:px-10">
      <h1 className="font-display text-2xl text-charcoal sm:text-3xl">Risk alerts</h1>
      <div className="mt-8 space-y-6">
        {projects.map((project) => (
          <section key={project.id}>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="font-display text-lg text-charcoal">{project.name}</h2>
              <span className="text-sm text-warm-gray">{project.risks.length}</span>
            </div>
            {project.risks.length === 0 ? (
              <p className="py-4 text-sm text-warm-gray">No risks raised</p>
            ) : (
              <ul className="divide-y divide-border">
                {project.risks.map((risk) => (
                  <li key={risk.id} className="flex items-center gap-4 py-3 text-sm">
                    <span className="min-w-0 flex-1 text-charcoal">{risk.title}</span>
                    <span className={SEVERITY_CLASS[risk.severity] ?? "text-warm-gray"}>
                      {risk.severity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRisk(project.id, risk.id)}
                      aria-label={`Delete ${risk.title}`}
                      className="text-warm-gray hover:text-destructive"
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
