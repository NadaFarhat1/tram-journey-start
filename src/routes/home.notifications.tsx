import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/workspace/placeholder-page";

export const Route = createFileRoute("/home/notifications")({
  head: () => ({ meta: [
    { title: "Notifications — TRAM" },
    { name: "description", content: "View your TRAM notifications." },
    { property: "og:title", content: "Notifications — TRAM" },
    { property: "og:description", content: "View your TRAM notifications." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <PlaceholderPage title="Notifications" />,
});