import { Plus } from "lucide-react";
import type { Project } from "./types";

type MemberStatus = "Active" | "Pending";

function toMember(name: string, index: number) {
  const email = `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`;
  const status: MemberStatus = index % 3 === 2 ? "Pending" : "Active";
  return { name, email, status };
}

export function MembersTab({ project }: { project: Project }) {
  const members = project.members.map(toMember);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-lg text-charcoal">Members</h2>
        <button type="button" className="tram-btn">
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
                <p className="truncate text-sm font-medium text-charcoal">{member.name}</p>
                <p className="truncate text-sm text-warm-gray">{member.email}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  member.status === "Active"
                    ? "bg-teal-pale text-teal"
                    : "bg-muted text-warm-gray"
                }`}
              >
                {member.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
