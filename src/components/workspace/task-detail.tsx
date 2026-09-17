import {
  CalendarDays,
  ChevronRight,
  CircleDot,
  Clock,
  Inbox,
  Info,
  PauseCircle,
  Pencil,
  PlayCircle,
  Plus,
  RotateCcw,
  Timer,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatusBadge } from "./task-row";
import { useWorkspace } from "./workspace-context";
import { requestsForTask, type Category, type Project, type Task } from "./types";
import { RequestCard } from "./requests-view";

function Breadcrumb({
  projectName,
  taskTitle,
  onProjects,
  onProject,
}: {
  projectName: string;
  taskTitle: string;
  onProjects: () => void;
  onProject: () => void;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <button
            type="button"
            onClick={onProjects}
            className="text-warm-gray transition-colors hover:text-teal"
          >
            Projects
          </button>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5 text-warm-gray" />
        </li>
        <li>
          <button
            type="button"
            onClick={onProject}
            className="text-warm-gray transition-colors hover:text-teal"
          >
            {projectName}
          </button>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5 text-warm-gray" />
        </li>
        <li aria-current="page" className="font-medium text-charcoal">
          {taskTitle}
        </li>
      </ol>
    </nav>
  );
}

function MiniCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-background px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-warm-gray">{label}</p>
        <span className="text-warm-gray" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-2 font-display text-lg text-charcoal">{value}</p>
    </div>
  );
}

function formatActivityTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TaskDetail({
  project,
  category,
  task,
  onProjects,
  onProject,
}: {
  project: Project;
  category: Category;
  task: Task;
  onProjects: () => void;
  onProject: () => void;
}) {
  const { requests, applyDirectTaskAction, deleteTask } = useWorkspace();
  const linked = requestsForTask(requests, task.id);

  const canHold =
    task.status === "Not Started" ||
    task.status === "Active" ||
    task.status === "Paused" ||
    task.status === "Under Review";
  const canDelete = task.status === "Not Started" || task.status === "Held";

  const runAction = (nextStatus: Task["status"], actionLabel: string) =>
    applyDirectTaskAction({
      projectId: project.id,
      categoryId: category.id,
      taskId: task.id,
      nextStatus,
      actionLabel,
    });

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"? This can't be undone.`)) {
      deleteTask(project.id, category.id, task.id);
      onProject();
    }
  };

  const activity = [...(task.activity ?? [])].reverse();

  return (
    <section className="px-6 py-10 sm:px-10">
      <Breadcrumb
        projectName={project.name}
        taskTitle={task.title}
        onProjects={onProjects}
        onProject={onProject}
      />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl text-charcoal sm:text-3xl">
              {task.title}
            </h1>
            <TaskStatusBadge status={task.status} />
          </div>
          <p className="mt-1.5 text-sm text-warm-gray">
            {category.name} · {project.name}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button type="button" variant="outline">
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit task
          </Button>
          {canHold ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => runAction("Held", "Task held")}
            >
              <PauseCircle className="h-4 w-4" aria-hidden="true" />
              Hold task
            </Button>
          ) : null}
          {task.status === "Held" ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => runAction("Paused", "Task unheld")}
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Unhold task
            </Button>
          ) : null}
          {task.status === "Completed" ? (
            <Button type="button" onClick={() => runAction("Paused", "Task reopened")}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reopen task
            </Button>
          ) : null}
          {canDelete ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete task
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniCard
          label="Owner"
          value={task.owner || "Unassigned"}
          icon={<User className="h-4 w-4" />}
        />
        <MiniCard
          label="Deadline"
          value={task.deadline || "Not set"}
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <MiniCard
          label="Est. time"
          value={task.estTime || "Not set"}
          icon={<Timer className="h-4 w-4" />}
        />
        <MiniCard
          label="Status"
          value={task.status}
          icon={<CircleDot className="h-4 w-4" />}
        />
      </div>

      {task.status === "Active" ? (
        <p className="mt-3 flex items-center gap-2 text-xs text-warm-gray">
          <Info className="h-3.5 w-3.5" aria-hidden="true" />
          Owner can&apos;t be changed while the task is Active
        </p>
      ) : null}

      <div className="mt-10">
        <h2 className="font-display text-lg text-charcoal">Description</h2>
        <p className="mt-2 text-sm text-charcoal">
          {task.description || "No description yet."}
        </p>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg text-charcoal">Requests</h2>
        {linked.length === 0 ? (
          <div className="mt-3 flex items-center gap-2.5 rounded-md border border-border bg-ivory px-5 py-4">
            <Inbox className="h-4 w-4 text-warm-gray" aria-hidden="true" />
            <span className="text-sm text-warm-gray">No requests</span>
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            {linked.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                crumbs={[request.categoryName, request.taskTitle]}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg text-charcoal">Activity</h2>
        {activity.length === 0 ? (
          <p className="mt-3 text-sm text-warm-gray">No activity yet</p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {activity.map((entry, index) => (
              <li
                key={`${entry.timestamp}-${index}`}
                className="flex items-start gap-2.5 text-sm text-charcoal"
              >
                <span className="mt-0.5 text-warm-gray" aria-hidden="true">
                  {entry.icon === "created" ? (
                    <Plus className="h-3.5 w-3.5" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" />
                  )}
                </span>
                <span>
                  {entry.text}
                  <span className="ml-2 text-xs text-warm-gray">
                    {formatActivityTime(entry.timestamp)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
