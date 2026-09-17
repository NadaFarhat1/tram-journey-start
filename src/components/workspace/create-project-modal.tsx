import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "./modal";
import { Button, DateInput, FormField, TextInput } from "./fields";

export function CreateProjectModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (values: { name: string; startDate: string; deadline: string }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  function close() {
    if (saving) return;
    setName("");
    setStartDate("");
    setDeadline("");
    setError(undefined);
    onClose();
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await onCreate({ name: name.trim(), startDate, deadline });
      setName("");
      setStartDate("");
      setDeadline("");
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Create project"
      footer={
        <>
          <Button variant="ghost" onClick={close} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="create-project-form" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Creating project...
              </>
            ) : (
              "Create project"
            )}
          </Button>
        </>
      }
    >
      <form id="create-project-form" onSubmit={submit} noValidate className="space-y-4">
        <FormField htmlFor="project-name" label="Project name" error={error}>
          <TextInput
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Project 1"
            aria-invalid={error ? true : undefined}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField htmlFor="project-start" label="Start date">
            <DateInput
              id="project-start"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormField>
          <FormField htmlFor="project-deadline" label="Deadline">
            <DateInput
              id="project-deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  );
}
