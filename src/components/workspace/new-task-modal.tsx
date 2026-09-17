import { useState, type FormEvent } from "react";
import { Modal } from "./modal";
import { Button, DateInput, FormField, Select, TextArea, TextInput } from "./fields";
import { useCurrentUserName } from "./use-current-user";
import { OWNERS, type Task } from "./types";

export function NewTaskModal({
  open,
  onClose,
  categoryName,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  categoryName: string;
  onCreate: (task: Omit<Task, "id">) => void;
}) {
  const userName = useCurrentUserName();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  function reset() {
    setTitle("");
    setDescription("");
    setOwner("");
    setDeadline("");
    setError(undefined);
  }

  function close() {
    reset();
    onClose();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    const now = new Date();
    onCreate({
      title: title.trim(),
      description: description.trim(),
      owner,
      deadline,
      estTime: "Not set",
      status: "Not Started",
      activity: [
        {
          icon: "created",
          text: `Task created by ${userName ?? "you"} — ${now.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`,
          timestamp: now.toISOString(),
        },
      ],
    });
    close();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="New task"
      subtitle={`Adding to ${categoryName}`}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="new-task-form">
            Create task
          </Button>
        </>
      }
    >
      <form id="new-task-form" onSubmit={submit} noValidate className="space-y-4">
        <FormField htmlFor="task-title" label="Task title" error={error}>
          <TextInput
            id="task-title"
            autoFocus
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(undefined);
            }}
            placeholder="e.g. Landing page wireframe"
            aria-invalid={error ? true : undefined}
          />
        </FormField>

        <FormField htmlFor="task-description" label="Description">
          <TextArea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what needs to be done"
          />
        </FormField>

        <FormField
          htmlFor="task-owner"
          label="Owner"
          hint="⚠ Owner list is placeholder test data (Member 1-6)."
        >
          <Select id="task-owner" value={owner} onChange={(e) => setOwner(e.target.value)}>
            <option value="">Select a member</option>
            {OWNERS.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField htmlFor="task-deadline" label="Deadline">
          <DateInput
            id="task-deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="dd-mm-yyyy"
          />
        </FormField>
      </form>
    </Modal>
  );
}
