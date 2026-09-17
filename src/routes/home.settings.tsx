import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/workspace/placeholder-page";

export const Route = createFileRoute("/home/settings")({
  head: () => ({ meta: [
    { title: "Settings — TRAM" },
    { name: "description", content: "Manage your TRAM settings." },
    { property: "og:title", content: "Settings — TRAM" },
    { property: "og:description", content: "Manage your TRAM settings." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <PlaceholderPage title="Settings" />,
});