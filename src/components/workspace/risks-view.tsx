import { useState } from "react";
import { ChevronRight, TriangleAlert } from "lucide-react";
import { useWorkspace } from "./workspace-context";
import type { Project, Risk } from "./types";

type SeverityFilter = Risk["severity"] | "All";

const SEVERITY_TABS: SeverityFilter[] = ["High", "Medium", "Low", "All"];

const SEVERITY_STYLE: Record<string, { color: string; background: string }> = {
  High: { color: "#a25b58", background: "rgba(184, 107, 104, 0.14)" },
  Medium: { color: "#9b7f4c", background: "rgba(197, 164, 109, 0.18)" },
  Low: { color: "#777b78", background: "rgba(119, 123, 120, 0.14)" },
};

function SeverityBadge({ severity }: { severity: string }) {
  const style = SEVERITY_STYLE[severity] ?? SEVERITY_STYLE["Low"]!;
  return (
    <span
      className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color: style.color, backgroundColor: style.background }}
    >
      {severity}
    </span>
  );
}

function SeverityTabs({
  active,
  onChange,
}: {
  active: SeverityFilter;
  onChange: (value: SeverityFilter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Risk severity">
      {SEVERITY_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
            active === tab
              ? "bg-teal-pale font-medium text-charcoal"
              : "text-warm-gray hover:text-charcoal"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/** Standalone risks view for one project — reached from the Risks summary card. */
export function RisksPanel({
  project,
  showTitle = true,
  onOpenTask,
}: {
  project: Project;
  showTitle?: boolean;
  onOpenTask?: (taskId: string) => void;
}) {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const highCount = project.risks.filter((risk) => risk.severity === "High").length;
  const visible =
    severityFilter === "All"
      ? project.risks
      : project.risks.filter((risk) => risk.severity === severityFilter);

  const location = (taskId: string | null | undefined) => {
    if (!taskId) return null;
    for (const category of project.categories) {
      const task = category.tasks.find((item) => item.id === taskId);
      if (task) return { categoryName: category.name, taskTitle: task.title };
    }
    return null;
  };

  return (
    <div>
      {showTitle ? (
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl text-charcoal sm:text-3xl">Risks</h1>
          <span className="text-sm text-warm-gray">{highCount} high</span>
        </div>
      ) : (
        <p className="text-sm text-warm-gray">{highCount} high</p>
      )}

      <div className="mt-6">
        <SeverityTabs active={severityFilter} onChange={setSeverityFilter} />
      </div>

      {visible.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-charcoal">No risks here</p>
          <p className="mt-1 text-sm text-warm-gray">Try a different severity filter.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((risk) => {
            const linked = location(risk.taskId);
            const clickable = Boolean(linked && risk.taskId && onOpenTask);
            const body = (
              <>
                <span className="flex min-w-0 items-start gap-2.5">
                  <TriangleAlert
                    className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm text-charcoal">{risk.title}</span>
                    {linked ? (
                      <span className="mt-1 flex flex-wrap items-center gap-1 text-xs text-warm-gray">
                        <span>{linked.categoryName}</span>
                        <ChevronRight className="h-3 w-3" aria-hidden="true" />
                        <span>{linked.taskTitle}</span>
                      </span>
                    ) : (
                      <span className="mt-1 block text-xs text-warm-gray">
                        Not linked to a task
                      </span>
                    )}
                  </span>
                </span>
                <SeverityBadge severity={risk.severity} />
              </>
            );

            return (
              <li key={risk.id} className="rounded-md border border-border bg-background">
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => onOpenTask?.(risk.taskId!)}
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                  >
                    {body}
                  </button>
                ) : (
                  <div className="flex items-start justify-between gap-4 px-5 py-4">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Risks scoped to one project, used by the sidebar-free in-project route. */
export function useProjectRiskCount(projectId: string): number {
  const { projects } = useWorkspace();
  return projects.find((project) => project.id === projectId)?.risks.length ?? 0;
}
