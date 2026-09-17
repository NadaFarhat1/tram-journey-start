import { createFileRoute } from "@tanstack/react-router";
import { RiskAlertsPage } from "@/components/workspace/project-detail-lists";

export const Route = createFileRoute("/home/risk-alerts")({
  head: () => ({ meta: [
    { title: "Risk alerts — TRAM" },
    { name: "description", content: "Review project risk alerts in TRAM." },
    { property: "og:title", content: "Risk alerts — TRAM" },
    { property: "og:description", content: "Review project risk alerts in TRAM." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: RiskAlertsPage,
});