import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/workspace/placeholder-page";

export const Route = createFileRoute("/home/reports")({
  head: () => ({ meta: [
    { title: "Reports — TRAM" },
    { name: "description", content: "View project reports in TRAM." },
    { property: "og:title", content: "Reports — TRAM" },
    { property: "og:description", content: "View project reports in TRAM." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <PlaceholderPage title="Reports" />,
});