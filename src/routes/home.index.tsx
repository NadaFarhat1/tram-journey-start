import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/workspace/projects-page";

export const Route = createFileRoute("/home/")({
  head: () => ({
    meta: [
      { title: "Projects — TRAM" },
      { name: "description", content: "View and manage your TRAM projects." },
      { property: "og:title", content: "Projects — TRAM" },
      { property: "og:description", content: "View and manage your TRAM projects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProjectsPage,
});
