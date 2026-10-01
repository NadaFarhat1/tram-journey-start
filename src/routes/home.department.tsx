import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/workspace/placeholder-page";

export const Route = createFileRoute("/home/department")({
  head: () => ({ meta: [
    { title: "Department — TRAM" },
    { name: "description", content: "Your TRAM department." },
    { property: "og:title", content: "Department — TRAM" },
    { property: "og:description", content: "Your TRAM department." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <PlaceholderPage title="Department" />,
});