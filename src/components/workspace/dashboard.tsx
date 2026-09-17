import { useEffect, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { Sidebar } from "./sidebar";
import { WorkspaceProvider, projectFromRow } from "./workspace-context";
import { demoProjects, demoRequests } from "./types";
import { listProjects } from "@/lib/workspace.functions";
import { supabase } from "@/integrations/supabase/client";

export function Dashboard() {
  const fetchProjects = useServerFn(listProjects);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.session));
    });
    return () => {
      active = false;
    };
  }, []);

  const { data, isPending: projectsPending } = useQuery({
    queryKey: ["workspace-projects"],
    enabled: signedIn === true,
    queryFn: async () => {
      try {
        return await fetchProjects();
      } catch {
        // Session expired or rejected: fall back to demo data.
        return [];
      }
    },
    retry: false,
  });

  const isPending = signedIn === null || (signedIn === true && projectsPending);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-teal" aria-label="Loading projects" />
      </div>
    );
  }

  const realProjects = (data ?? []).map(projectFromRow);
  const usingDemoData = realProjects.length === 0;

  return (
    <WorkspaceProvider
      key={usingDemoData ? "tram-demo-linked-tasks-v1" : "tram-real-projects"}
      initialProjects={usingDemoData ? demoProjects() : realProjects}
      initialRequests={usingDemoData ? demoRequests() : []}
      demoMode={usingDemoData}
    >
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-16 sm:pb-0">
          <Outlet />
        </main>
      </div>
    </WorkspaceProvider>
  );
}