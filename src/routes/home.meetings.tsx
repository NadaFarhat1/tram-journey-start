import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/workspace/placeholder-page";

export const Route = createFileRoute("/home/meetings")({
  head: () => ({ meta: [
    { title: "Meetings — TRAM" },
    { name: "description", content: "View project meetings in TRAM." },
    { property: "og:title", content: "Meetings — TRAM" },
    { property: "og:description", content: "View project meetings in TRAM." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <PlaceholderPage title="Meetings" />,
});