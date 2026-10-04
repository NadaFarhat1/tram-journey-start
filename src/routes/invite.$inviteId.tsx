import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, AuthHeading } from "@/components/tram/auth-shell";
import { getInvitation } from "@/lib/invitations.functions";

export const Route = createFileRoute("/invite/$inviteId")({
  head: () => ({
    meta: [
      { title: "You're invited — TRAM" },
      { name: "description", content: "Join your team's project on TRAM." },
      { property: "og:title", content: "You're invited — TRAM" },
      { property: "og:description", content: "Join your team's project on TRAM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ params }) => {
    try {
      return await getInvitation({ data: { id: params.inviteId } });
    } catch {
      return null;
    }
  },
  component: InvitePage,
});

function InvitePage() {
  const invite = Route.useLoaderData();

  if (!invite) {
    return (
      <AuthShell visualLeft>
        <AuthHeading
          title="Invitation not found"
          subtitle="This invitation link is invalid or no longer available."
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell visualLeft>
      <AuthHeading
        title={`You've been invited to join ${invite.projectName}`}
        subtitle={`${invite.inviterName} invited you to join the project.`}
      />
      <p className="mb-6 text-sm text-warm-gray">
        Invitation for <span className="font-medium text-charcoal">{invite.email}</span>
      </p>
      <Link
        to="/signup"
        search={{ invite: invite.id }}
        className="tram-btn w-full justify-center"
      >
        Join Team
      </Link>
    </AuthShell>
  );
}
