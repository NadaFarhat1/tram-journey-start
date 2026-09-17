import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Display name of the signed-in user, or null while unknown. */
export function useCurrentUserName(): string | null {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const user = data.session?.user;
      const label =
        (user?.user_metadata?.["full_name"] as string | undefined) ??
        (user?.user_metadata?.["name"] as string | undefined) ??
        user?.email ??
        null;
      setName(label);
    });
    return () => {
      active = false;
    };
  }, []);

  return name;
}
