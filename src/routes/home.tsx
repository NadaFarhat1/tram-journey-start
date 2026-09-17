import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/workspace/dashboard";

export const Route = createFileRoute("/home")({
  component: Dashboard,
});
