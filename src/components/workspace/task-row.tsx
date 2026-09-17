import { ClipboardList, TriangleAlert } from "lucide-react";
import { TASK_STATUSES, TASK_STATUS_STYLE, type Task, type TaskStatus } from "./types";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const style = TASK_STATUS_STYLE[status];
  return (
    <span
      className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color: style.color, backgroundColor: style.background }}
    >
      {status}
    </span>
  );
}

export function TaskRow({
  task,
  onStatusChange,
  onOpen,
  hasRisk,
  hasRequest,
}: {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
  /** Opens the task detail page. */
  onOpen: () => void;
  hasRisk: boolean;
  hasRequest: boolean;
}) {
  return (
    <div className="border-t border-border transition-colors hover:bg-ivory/60">
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open ${task.title}`}
          className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left"
        >
          <span className="truncate text-sm text-charcoal transition-colors hover:text-teal">
            {task.title}
          </span>
          {hasRisk ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              <TriangleAlert className="h-3 w-3" aria-hidden="true" />
              Risk
            </span>
          ) : null}
          {hasRequest ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-warm-gray">
              <ClipboardList className="h-3 w-3" aria-hidden="true" />
              Request
            </span>
          ) : null}
        </button>
        <label className="relative shrink-0">
          <span className="sr-only">Change status for {task.title}</span>
          <select
            value={task.status}
            onChange={(event) => onStatusChange(event.target.value as TaskStatus)}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
            aria-label={`Change status for ${task.title}`}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <TaskStatusBadge status={task.status} />
        </label>
      </div>
    </div>
  );
}
