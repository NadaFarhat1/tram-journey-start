import { useState, type FormEvent } from "react";
import { Modal } from "./modal";
import { Button, FormField, TextInput } from "./fields";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AddMemberModal({
  open,
  onClose,
  projectName,
  existingEmails,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  projectName: string;
  existingEmails: string[];
  onInvite: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  function close() {
    setEmail("");
    setError(undefined);
    onClose();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return setError("Email address is required.");
    if (!EMAIL_RE.test(value)) return setError("Enter a valid email address.");
    if (existingEmails.includes(value)) return setError("This person is already a member.");
    onInvite(value);
    close();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add member"
      subtitle={`Invite to ${projectName}`}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="add-member-form">
            Send invitation
          </Button>
        </>
      }
    >
      <form id="add-member-form" onSubmit={submit} noValidate>
        <FormField htmlFor="member-email" label="Email address" error={error}>
          <TextInput
            id="member-email"
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter member email"
            aria-invalid={error ? true : undefined}
          />
        </FormField>
      </form>
    </Modal>
  );
}
