import { useState, type FormEvent } from "react";
import { Modal } from "./modal";
import { Button, FormField, TextInput } from "./fields";

export function NewCategoryModal({
  open,
  onClose,
  projectName,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  projectName: string;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  function close() {
    setName("");
    setError(undefined);
    onClose();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Module name is required.");
      return;
    }
    onCreate(name.trim());
    close();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="New module"
      subtitle={`Adding to ${projectName}`}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="new-category-form">
            Create module
          </Button>
        </>
      }
    >
      <form id="new-category-form" onSubmit={submit} noValidate>
        <FormField htmlFor="category-name" label="Module name" error={error}>
          <TextInput
            id="category-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Design"
            aria-invalid={error ? true : undefined}
          />
        </FormField>
      </form>
    </Modal>
  );
}
