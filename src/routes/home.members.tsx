import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/workspace/placeholder-page";

export const Route = createFileRoute("/home/members")({
  head: () => ({ meta: [
    { title: "Members — TRAM" },
    { name: "description", content: "View project members in TRAM." },
    { property: "og:title", content: "Members — TRAM" },
    { property: "og:description", content: "View project members in TRAM." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <PlaceholderPage title="Members" />,
});