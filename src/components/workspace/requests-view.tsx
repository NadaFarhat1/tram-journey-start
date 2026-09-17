import { useState } from "react";
import { ChevronRight, PauseCircle, PlayCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "./workspace-context";
import {
  requestsForProject,
  requestsForTask,
  type GlobalRequest,
  type RequestStatus,
  type RequestType,
} from "./types";

const TYPE_ICON: Record<RequestType, typeof PauseCircle> = {
  Hold: PauseCircle,
  Unhold: PlayCircle,
  Reopen: RotateCcw,
};

const STATUS_STYLE: Record<RequestStatus, { color: string; background: string }> = {
  Pending: { color: "#9b7f4c", background: "rgba(197, 164, 109, 0.18)" },
  Approved: { color: "#4b7a5f", background: "rgba(95, 146, 116, 0.16)" },
  Rejected: { color: "#a25b58", background: "rgba(184, 107, 104, 0.14)" },
  "Resolved via direct action": {
    color: "#777b78",
    background: "rgba(119, 123, 120, 0.14)",
  },
};

type StatusFilter = RequestStatus | "All";

const STATUS_TABS: StatusFilter[] = ["Pending", "Approved", "Rejected", "All"];

function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const style = STATUS_STYLE[status];
  return (
    <span
      className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color: style.color, backgroundColor: style.background }}
    >
      {status}
    </span>
  );
}

function formatSubmitted(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Crumb({ parts }: { parts: string[] }) {
  return (
    <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-warm-gray">
      {parts.map((part, index) => (
        <span key={`${part}-${index}`} className="flex items-center gap-1">
          {index > 0 ? (
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
          ) : null}
          {part}
        </span>
      ))}
    </p>
  );
}

/** One request card — identical everywhere requests are shown. */
export function RequestCard({
  request,
  crumbs,
}: {
  request: GlobalRequest;
  crumbs: string[];
}) {
  const { toggleRequestExpanded, setRequestStatus } = useWorkspace();
  const Icon = TYPE_ICON[request.type];

  return (
    <li className="rounded-md border border-border bg-background">
      <button
        type="button"
        onClick={() => toggleRequestExpanded(request.id)}
        aria-expanded={request.expanded}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="flex min-w-0 items-start gap-2.5">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-warm-gray" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-sm text-charcoal">
              {request.type} request from {request.requester}
            </span>
            <Crumb parts={crumbs} />
          </span>
        </span>
        <RequestStatusBadge status={request.status} />
      </button>

      {request.expanded ? (
        <div className="border-t border-border px-5 py-4">
          <p className="text-xs text-warm-gray">
            Submitted {formatSubmitted(request.submittedAt)}
          </p>
          <p className="mt-2 text-sm text-charcoal">{request.reason}</p>
          {request.status === "Pending" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRequestStatus(request.id, "Rejected")}
              >
                Reject
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setRequestStatus(request.id, "Approved")}
              >
                Approve
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

function StatusTabs({
  active,
  onChange,
}: {
  active: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Request status">
      {STATUS_TABS.map((tab) => (
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

/**
 * Shared requests view. Reads the single global requests collection; the only
 * difference between the sidebar page and the in-project tab is the scope.
 */
export function RequestsPanel({
  scopeProjectId,
  title = "Requests",
  showTitle = true,
}: {
  scopeProjectId?: string;
  title?: string;
  showTitle?: boolean;
}) {
  const { projects, requests } = useWorkspace();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Pending");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  const scoped = scopeProjectId
    ? requestsForProject(requests, scopeProjectId)
    : projectFilter === "all"
      ? requests
      : requestsForProject(requests, projectFilter);

  const pendingCount = scoped.filter((request) => request.status === "Pending").length;
  const visible =
    statusFilter === "All"
      ? scoped
      : scoped.filter((request) => request.status === statusFilter);

  const projectName = (id: string) =>
    projects.find((project) => project.id === id)?.name ?? "Unknown project";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {showTitle ? (
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl text-charcoal sm:text-3xl">{title}</h1>
            <span className="text-sm text-warm-gray">{pendingCount} pending</span>
          </div>
        ) : (
          <p className="text-sm text-warm-gray">{pendingCount} pending</p>
        )}
        {scopeProjectId ? null : (
          <label className="shrink-0">
            <span className="sr-only">Filter by project</span>
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm text-charcoal focus:border-teal focus:outline-none"
            >
              <option value="all">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-6">
        <StatusTabs active={statusFilter} onChange={setStatusFilter} />
      </div>

      {visible.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-charcoal">No requests here</p>
          <p className="mt-1 text-sm text-warm-gray">
            Try a different status or project filter.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              crumbs={
                scopeProjectId
                  ? [request.categoryName, request.taskTitle]
                  : [projectName(request.projectId), request.categoryName, request.taskTitle]
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/** Requests linked to a single task, shown inside task details. */
export function TaskRequests({ taskId }: { taskId: string }) {
  const { requests } = useWorkspace();
  const linked = requestsForTask(requests, taskId);

  if (linked.length === 0) {
    return <p className="text-sm text-warm-gray">No requests</p>;
  }
  return (
    <ul className="space-y-3">
      {linked.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          crumbs={[request.categoryName, request.taskTitle]}
        />
      ))}
    </ul>
  );
}

/** Sidebar "Requests" page — all projects. */
export function GlobalRequestsPage() {
  return (
    <section className="px-6 py-10 sm:px-10">
      <RequestsPanel />
    </section>
  );
}
