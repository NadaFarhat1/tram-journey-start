import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Context,
  type ReactNode,
} from "react";
import type {
  ActivityEntry,
  Category,
  GlobalRequest,
  Project,
  RequestStatus,
  Task,
  TaskStatus,
} from "./types";
import type { WorkspaceProjectRow } from "@/lib/workspace.functions";

type WorkspaceValue = {
  projects: Project[];
  /** Single global source of truth for every request in the app. */
  requests: GlobalRequest[];
  addProject: (project: Project) => void;
  addCategory: (projectId: string, name: string) => void;
  addTask: (projectId: string, categoryId: string, task: Omit<Task, "id">) => void;
  updateTaskStatus: (
    projectId: string,
    categoryId: string,
    taskId: string,
    status: TaskStatus,
  ) => void;
  /** Direct status action from the task detail page (Hold / Unhold / Reopen). */
  applyDirectTaskAction: (args: {
    projectId: string;
    categoryId: string;
    taskId: string;
    nextStatus: TaskStatus;
    actionLabel: string;
  }) => void;
  deleteTask: (projectId: string, categoryId: string, taskId: string) => void;
  removeRisk: (projectId: string, riskId: string) => void;
  removeCategory: (projectId: string, categoryId: string) => void;
  renameCategory: (projectId: string, categoryId: string, name: string) => void;
  setProjects: (projects: Project[]) => void;
  /** Decide a request; also nudges the linked task status when approved. */
  setRequestStatus: (requestId: string, status: Exclude<RequestStatus, "Pending">) => void;
  toggleRequestExpanded: (requestId: string) => void;
  /** True while showing demo Project 1/2/3 instead of real Leader/Member projects. */
  demoMode: boolean;
};

// Keep a single context instance across hot reloads, otherwise a reloaded
// module creates a second context and consumers see an empty value.
const globalStore = globalThis as typeof globalThis & {
  __tramWorkspaceContext?: Context<WorkspaceValue | null>;
};

const WorkspaceContext =
  globalStore.__tramWorkspaceContext ??
  (globalStore.__tramWorkspaceContext = createContext<WorkspaceValue | null>(null));

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function projectFromRow(row: WorkspaceProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    projectId: row.projectId,
    startDate: row.startDate,
    deadline: row.deadline,
    categories: [],
    members: [],
    risks: [],
    meetings: [],
  };
}

/** Task status implied by approving a request of the given type. */
const APPROVED_TASK_STATUS: Record<GlobalRequest["type"], TaskStatus> = {
  Hold: "Held",
  Unhold: "Paused",
  Reopen: "Paused",
};

/** Applies `fn` to exactly one task, leaving everything else untouched. */
function mapTask(
  projects: Project[],
  projectId: string,
  categoryId: string,
  taskId: string,
  fn: (task: Task) => Task,
): Project[] {
  return projects.map((project) =>
    project.id === projectId
      ? {
          ...project,
          categories: project.categories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  tasks: category.tasks.map((task) =>
                    task.id === taskId ? fn(task) : task,
                  ),
                }
              : category,
          ),
        }
      : project,
  );
}

function withActivity(task: Task, entry: ActivityEntry): Task {
  return { ...task, activity: [...(task.activity ?? []), entry] };
}

export function WorkspaceProvider({
  children,
  initialProjects,
  initialRequests = [],
  demoMode = false,
}: {
  children: ReactNode;
  initialProjects: Project[];
  initialRequests?: GlobalRequest[];
  demoMode?: boolean;
}) {
  const [projects, setProjectsState] = useState<Project[]>(initialProjects);
  const [requests, setRequestsState] = useState<GlobalRequest[]>(initialRequests);

  const value = useMemo<WorkspaceValue>(
    () => ({
      projects,
      requests,
      demoMode,
      setProjects: setProjectsState,
      toggleRequestExpanded: (requestId) =>
        setRequestsState((prev) =>
          prev.map((request) =>
            request.id === requestId
              ? { ...request, expanded: !request.expanded }
              : request,
          ),
        ),
      setRequestStatus: (requestId, status) => {
        let decided: GlobalRequest | undefined;
        setRequestsState((prev) =>
          prev.map((request) => {
            if (request.id !== requestId) return request;
            decided = request;
            return { ...request, status };
          }),
        );
        if (!decided) return;
        const target = decided;
        const entry: ActivityEntry = {
          icon: "request",
          text: `${target.type} request marked ${status} — just now`,
          timestamp: new Date().toISOString(),
        };
        const nextStatus =
          status === "Approved" ? APPROVED_TASK_STATUS[target.type] : null;
        setProjectsState((prev) =>
          mapTask(prev, target.projectId, target.categoryId, target.taskId, (task) =>
            withActivity(nextStatus ? { ...task, status: nextStatus } : task, entry),
          ),
        );
      },
      applyDirectTaskAction: ({
        projectId,
        categoryId,
        taskId,
        nextStatus,
        actionLabel,
      }) => {
        const now = new Date().toISOString();
        const entries: ActivityEntry[] = [
          { icon: "request", text: `${actionLabel} — just now`, timestamp: now },
        ];
        // Any pending request on this task is superseded by the direct action.
        setRequestsState((prev) =>
          prev.map((request) => {
            if (request.taskId !== taskId || request.status !== "Pending") {
              return request;
            }
            entries.push({
              icon: "request",
              text: `${request.type} request marked Resolved via direct action — just now`,
              timestamp: now,
            });
            return { ...request, status: "Resolved via direct action" };
          }),
        );
        setProjectsState((prev) =>
          mapTask(prev, projectId, categoryId, taskId, (task) => ({
            ...task,
            status: nextStatus,
            activity: [...(task.activity ?? []), ...entries],
          })),
        );
      },
      deleteTask: (projectId, categoryId, taskId) =>
        setProjectsState((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  categories: project.categories.map((category) =>
                    category.id === categoryId
                      ? {
                          ...category,
                          tasks: category.tasks.filter((task) => task.id !== taskId),
                        }
                      : category,
                  ),
                }
              : project,
          ),
        ),
      addProject: (project) => setProjectsState((prev) => [...prev, project]),
      addCategory: (projectId, name) =>
        setProjectsState((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  categories: [
                    ...project.categories,
                    { id: newId(), name, tasks: [] } satisfies Category,
                  ],
                }
              : project,
          ),
        ),
      renameCategory: (projectId, categoryId, name) =>
        setProjectsState((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  categories: project.categories.map((category) =>
                    category.id === categoryId ? { ...category, name } : category,
                  ),
                }
              : project,
          ),
        ),
      removeCategory: (projectId, categoryId) =>
        setProjectsState((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  categories: project.categories.filter((c) => c.id !== categoryId),
                }
              : project,
          ),
        ),
      addTask: (projectId, categoryId, task) =>
        setProjectsState((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  categories: project.categories.map((category) =>
                    category.id === categoryId
                      ? { ...category, tasks: [...category.tasks, { ...task, id: newId() }] }
                      : category,
                  ),
                }
              : project,
          ),
        ),
      updateTaskStatus: (projectId, categoryId, taskId, status) =>
        setProjectsState((prev) =>
          mapTask(prev, projectId, categoryId, taskId, (task) => ({ ...task, status })),
        ),
      removeRisk: (projectId, riskId) =>
        setProjectsState((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? { ...project, risks: project.risks.filter((risk) => risk.id !== riskId) }
              : project,
          ),
        ),
    }),
    [projects, requests, demoMode],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
