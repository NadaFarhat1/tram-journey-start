import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2,
  BarChart3,
  Bell,
  FileText,
  Flame,
  Folder,
  Settings,
  Users,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItemDefinition = {
  label: string;
  to:
    | "/home"
    | "/home/risk-alerts"
    | "/home/requests"
    | "/home/meetings"
    | "/home/reports"
    | "/home/members"
    | "/home/department"
    | "/home/notifications"
    | "/home/settings";
  icon: typeof Folder;
};

const MAIN_ITEMS: SidebarItemDefinition[] = [
  { label: "Projects", to: "/home", icon: Folder },
  { label: "Risk alerts", to: "/home/risk-alerts", icon: Flame },
  { label: "Requests", to: "/home/requests", icon: FileText },
  { label: "Meetings", to: "/home/meetings", icon: Video },
  { label: "Reports", to: "/home/reports", icon: BarChart3 },
  { label: "Members", to: "/home/members", icon: Users },
  { label: "Department", to: "/home/department", icon: Building2 },
];

const BOTTOM_ITEMS: SidebarItemDefinition[] = [
  { label: "Notifications", to: "/home/notifications", icon: Bell },
  { label: "Settings", to: "/home/settings", icon: Settings },
];

export function SidebarItem({
  item,
  active,
}: {
  item: SidebarItemDefinition;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: true }}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={cn(
        "flex h-10 items-center justify-center gap-3 rounded-md px-3 text-sm transition-colors md:justify-start",
        active
          ? "bg-teal-pale font-medium text-charcoal"
          : "text-warm-gray hover:bg-ivory hover:text-charcoal",
      )}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1.8}
        className={cn("h-[18px] w-[18px] shrink-0", active ? "text-teal" : "text-warm-gray")}
      />
      <span className="hidden md:inline">{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => pathname === to;

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[4.5rem] shrink-0 border-r border-border bg-ivory/60 sm:block md:w-60">
      <nav aria-label="Workspace navigation" className="flex h-full flex-col gap-1 px-2 py-5 md:px-3">
      <div className="flex h-9 items-center justify-center pb-5 md:justify-start md:px-3">
        <span className="font-display text-lg text-charcoal md:text-xl">TRAM</span>
      </div>
      {MAIN_ITEMS.map((item) => (
        <SidebarItem
          key={item.to}
          item={item}
          active={isActive(item.to)}
        />
      ))}
      <div className="mt-auto flex flex-col gap-1 border-t border-border pt-3">
        {BOTTOM_ITEMS.map((item) => (
          <SidebarItem
            key={item.to}
            item={item}
            active={isActive(item.to)}
          />
        ))}
      </div>
      </nav>
      </aside>
      <nav
        aria-label="Workspace navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-9 gap-0.5 border-t border-border bg-ivory/95 px-1 py-1.5 backdrop-blur-none sm:hidden"
      >
        {[...MAIN_ITEMS, ...BOTTOM_ITEMS].map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              title={item.label}
              className={cn(
                "flex h-11 items-center justify-center rounded-md transition-colors",
                active ? "bg-teal-pale text-teal" : "text-warm-gray",
              )}
            >
              <Icon aria-hidden="true" strokeWidth={1.8} className="h-[18px] w-[18px]" />
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export const WorkspaceSidebar = Sidebar;
