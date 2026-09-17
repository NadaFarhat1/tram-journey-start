import { createFileRoute } from "@tanstack/react-router";
import { GlobalRequestsPage } from "@/components/workspace/requests-view";

export const Route = createFileRoute("/home/requests")({
  head: () => ({ meta: [
    { title: "Requests — TRAM" },
    { name: "description", content: "View project requests in TRAM." },
    { property: "og:title", content: "Requests — TRAM" },
    { property: "og:description", content: "View project requests in TRAM." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: GlobalRequestsPage,
});