import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AddMemberModal } from "./add-member-modal";
import {
  createInvitation,
  listProjectInvitations,
  listProjectMembers,
  type ProjectInvitationRow,
} from "@/lib/invitations.functions";
import { useCurrentUserName } from "./use-current-user";
import type { Project } from "./types";

type MemberStatus = "Active" | "Pending";
type MemberRow = { name: string; email: string; status: MemberStatus };

export function MembersTab({ project }: { project: Project }) {
  const [invites, setInvites] = useState<ProjectInvitationRow[]>([]);
  const [realMembers, setRealMembers] = useState<
    { userId: string; name: string; email: string }[]
  >([]);
  const [modalOpen, setModalOpen] = useState(false);
  const inviterName = useCurrentUserName() ?? "Your team leader";

  useEffect(() => {
    let active = true;
    listProjectMembers({ data: { projectRef: project.id } })
      .then((rows) => {
        if (active) setRealMembers(rows);
      })
      .catch(() => undefined);
    listProjectInvitations({ data: { projectRef: project.id } })
      .then((rows) => {
        if (active) setInvites(rows);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [project.id]);

  const memberEmails = new Set(realMembers.map((m) => m.email.toLowerCase()));
  const members: MemberRow[] = [
    // Real project members (project_members + profiles) are the source of truth.
    ...realMembers.map((m) => ({
      name: m.name,
      email: m.email,
      status: "Active" as MemberStatus,
    })),
    // Only still-pending invitations; accepted ones are excluded so a member
    // never appears twice.
    ...invites
      .filter(
        (invite) =>
          invite.status === "pending" && !memberEmails.has(invite.email.toLowerCase()),
      )
      .map((invite) => ({
        name: "Invited member",
        email: invite.email,
        status: "Pending" as MemberStatus,
      })),
  ];

  async function invite(email: string) {
    try {
      const { id } = await createInvitation({
        data: { projectRef: project.id, projectName: project.name, email, inviterName },
      });
      const link = `${window.location.origin}/invite/${id}`;
      setInvites((prev) =>
        prev.some((row) => row.id === id)
          ? prev
          : [...prev, { id, email, status: "pending", name: null }],
      );
      toast.success("Invitation sent", {
        description: link,
        duration: 15000,
        action: {
          label: "Copy link",
          onClick: () => void navigator.clipboard.writeText(link),
        },
      });
    } catch {
      toast.error("Could not send invitation. Please try again.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-lg text-charcoal">Members</h2>
        <button type="button" className="tram-btn" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add member
        </button>
      </div>

      {members.length === 0 ? (
        <p className="py-16 text-center text-sm text-warm-gray">No members yet</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {members.map((member) => (
            <li
              key={member.email}
              className="flex items-center justify-between gap-4 rounded-md border border-border bg-background px-5 py-4"
            >
              <div className="min-w-0">
                <p
                  className={`truncate text-sm font-medium ${
                    member.status === "Active" ? "text-charcoal" : "text-warm-gray"
                  }`}
                >
                  {member.name}
                </p>
                <p className="truncate text-sm text-warm-gray">{member.email}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  member.status === "Active"
                    ? "bg-teal-pale text-teal"
                    : "border border-dashed border-border text-warm-gray"
                }`}
              >
                {member.status}
              </span>
            </li>
          ))}
        </ul>
      )}

      <AddMemberModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        projectName={project.name}
        existingEmails={members.map((m) => m.email)}
        onInvite={(email) => void invite(email)}
      />
    </div>
  );
}
