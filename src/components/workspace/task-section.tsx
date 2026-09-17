import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronRight, Pencil, Plus, Trash2, X } from "lucide-react";
import { TaskRow } from "./task-row";
import type { Category, TaskStatus } from "./types";

export function TaskSection({
  category,
  onRename,
  onDelete,
  onNewTask,
  onTaskStatusChange,
  onOpenTask,
  riskTaskIds,
  requestTaskIds,
}: {
  category: Category;
  onRename: (name: string) => void;
  onDelete: () => void;
  onNewTask: () => void;
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
  onOpenTask: (taskId: string) => void;
  riskTaskIds: Set<string>;
  requestTaskIds: Set<string>;
}) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(category.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEdit = () => {
    setDraft(category.name);
    setEditing(true);
  };

  const commit = () => {
    const name = draft.trim();
    if (name) onRename(name);
    setEditing(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${category.name}" and all of its tasks? This can't be undone.`,
      )
    ) {
      onDelete();
    }
  };

  return (
    <section className="rounded-md border border-border bg-background">
      <div className="flex items-center gap-2 px-5 py-3.5">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${category.name}` : `Expand ${category.name}`}
          className="text-warm-gray transition-colors hover:text-charcoal"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        {editing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") commit();
                if (event.key === "Escape") setEditing(false);
              }}
              aria-label="Category name"
              className="tram-field h-9 flex-1 px-3"
            />
            <button
              type="button"
              onClick={commit}
              aria-label="Save category name"
              className="text-warm-gray transition-colors hover:text-teal"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              aria-label="Cancel renaming category"
              className="text-warm-gray transition-colors hover:text-charcoal"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="flex-1 text-left"
            >
              <h3 className="font-medium text-charcoal">{category.name}</h3>
            </button>
            <button
              type="button"
              onClick={startEdit}
              aria-label={`Rename ${category.name}`}
              className="text-warm-gray transition-colors hover:text-teal"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              aria-label={`Delete ${category.name}`}
              className="text-warm-gray transition-colors hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {expanded ? (
        <div>
          {category.tasks.length === 0 ? (
            <p className="border-t border-border px-5 py-3 text-sm text-warm-gray">
              No tasks yet.
            </p>
          ) : (
            category.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onStatusChange={(status) => onTaskStatusChange(task.id, status)}
                onOpen={() => onOpenTask(task.id)}
                hasRisk={riskTaskIds.has(task.id)}
                hasRequest={requestTaskIds.has(task.id)}
              />
            ))
          )}
          <div className="border-t border-border px-5 py-3">
            <button
              type="button"
              onClick={onNewTask}
              className="inline-flex items-center gap-1.5 text-sm text-teal transition-colors hover:text-charcoal"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New task
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
