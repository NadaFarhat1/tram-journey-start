import { useState } from "react";
import { Folder, Plus, Video } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { createWorkspaceProject } from "@/lib/workspace.functions";
import { CreateProjectModal } from "./create-project-modal";
import { ProjectDetails } from "./project-details";
import { useWorkspace } from "./workspace-context";
import {
  countHeldTasks,
  nextMeetingLabel,
  requestsForProject,
  type Project,
} from "./types";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function EmptyState({ onNewProject }: { onNewProject: () => void }) {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-pale">
          <Folder className="h-5 w-5 text-teal" aria-hidden="true" />
        </div>
        <h1 className="mt-4 font-display text-2xl text-charcoal sm:text-3xl">
          No projects yet
        </h1>
        <p className="mt-2 text-sm text-warm-gray">
          Create your first project to start organizing tasks.
        </p>
        <button type="button" onClick={onNewProject} className="tram-btn mt-6">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New project
        </button>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (projectId: string) => void;
}) {
  const { requests } = useWorkspace();
  const requestCount = requestsForProject(requests, project.id).length;
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(project.id)}
        aria-label={`Open ${project.name}`}
        className="w-full rounded-md border border-border bg-background px-5 py-4 text-left transition-colors hover:border-teal-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
      <h2 className="font-display text-lg text-charcoal">{project.name}</h2>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-warm-gray">
        <span>
          Risks{" "}
          <span className="font-medium text-charcoal">{project.risks.length}</span>
        </span>
        <span>
          Requests{" "}
          <span className="font-medium text-charcoal">{requestCount}</span>
        </span>
        <span>
          Held tasks{" "}
          <span className="font-medium text-charcoal">{countHeldTasks(project)}</span>
        </span>
      </div>
      <div className="my-3 h-px bg-border" role="presentation" />
      <p className="flex items-center gap-2 text-sm text-warm-gray">
        <Video className="h-4 w-4 text-teal" aria-hidden="true" />
        {nextMeetingLabel(project) ?? "No upcoming meetings"}
      </p>
      </button>
    </li>
  );
}

function ProjectList({
  projects,
  onOpen,
}: {
  projects: Project[];
  onOpen: (projectId: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onOpen={onOpen} />
      ))}
    </ul>
  );
}

export function ProjectsPage() {
  const { projects, addProject, demoMode } = useWorkspace();
  const createRemoteProject = useServerFn(createWorkspaceProject);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const selectedProject = selectedProjectId
    ? projects.find((project) => project.id === selectedProjectId)
    : undefined;

  async function handleCreate(values: {
    name: string;
    startDate: string;
    deadline: string;
  }) {
    // Demo mode keeps everything local; real accounts persist the project.
    const row = demoMode
      ? null
      : await createRemoteProject({
          data: {
            name: values.name,
            startDate: values.startDate || undefined,
            deadline: values.deadline || undefined,
          },
        });

    const project: Project = {
      id: row?.id ?? newId(),
      name: values.name,
      projectId: row?.projectId ?? "",
      startDate: values.startDate || null,
      deadline: values.deadline || null,
      categories: [],
      members: [],
      risks: [],
      meetings: [],
    };
    addProject(project);
  }

  if (projects.length === 0) {
    return (
      <>
        <EmptyState onNewProject={() => setModalOpen(true)} />
        <CreateProjectModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
        />
      </>
    );
  }

  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={() => setSelectedProjectId(null)}
      />
    );
  }

  const filtered = projects.filter((project) =>
    project.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <>
      <section className="px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl text-charcoal sm:text-3xl">
            Projects
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-charcoal placeholder:text-warm-gray focus:border-teal focus:outline-none sm:w-56"
            />
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="tram-btn shrink-0"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New project
            </button>
          </div>
        </div>
        <div className="mt-8">
          {filtered.length > 0 ? (
            <ProjectList projects={filtered} onOpen={setSelectedProjectId} />
          ) : (
            <p className="py-10 text-center text-sm text-warm-gray">
              No projects match “{query.trim()}”.
            </p>
          )}
        </div>
      </section>
      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
