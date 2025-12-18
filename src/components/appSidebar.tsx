import {
  Target,
  ShieldAlert,
  Podcast,
  type LucideIcon,
  Workflow,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
  Sidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MenuDropup } from "@/components/ui/menu-dropup";
import { useLocation, matchPath, useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Routes } from "@/constants";
import type { UserMenuAction } from "@/types/core";
import { authClient } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

const routes = [
  {
    title: "Monitoring",
    icon: Target,
    match: [Routes.MONITORS, "/monitor/*"],
    url: Routes.MONITORS,
  },
  {
    title: "Incidents",
    icon: ShieldAlert,
    match: [Routes.INCIDENTS, "/incident/*"],
    url: Routes.INCIDENTS,
  },
  {
    title: "Status pages",
    icon: Podcast,
    match: [Routes.STATUS, "/status/*"],
    url: Routes.STATUS,
  },
  {
    title: "Integrations & API",
    icon: Workflow,
    match: [Routes.INTEGRATIONS],
    url: Routes.INTEGRATIONS,
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => await authClient.signOut();

  const handleUserMenuActions = (action: UserMenuAction) => {
    switch (action) {
      case "logout":
        handleLogout();
        break;
      case "account":
        navigate(Routes.ACCOUNT_DETAILS);
        break;
      case "billing":
        navigate(Routes.BILLING);
        break;
      case "invoices":
        navigate(Routes.INVOICES);
        break;
      case "notifications":
        navigate(Routes.NOTIFICATIONS);
        break;
      case "security":
        navigate(Routes.SECURITY);
        break;
        break;
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <Link to={Routes.ROOT}>
          <div className="flex items-end gap-1 group-data-[collapsible=icon]:hidden py-3 px-4 mt-2 font-semibold text-2xl">
            <span className="h-2 w-2 mb-2 rounded-full bg-green-500" />
            <span>UptimeRobot</span>
          </div>
          <div className="items-end gap-1 group-data-[collapsible=icon]:flex hidden mt-4 font-semibold">
            <span className="shrink-0 h-5 w-5 mb-2 rounded-full animate-pulse bg-green-500" />
          </div>
        </Link>

        <SidebarMenu>
          <NavMain items={routes} />
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mb-10">
        <div className="flex flex-col gap-3">
          <MenuDropup user={user} onAction={handleUserMenuActions} />
          <div className="flex gap-4 mx-auto items-center">
            <SidebarTrigger size={"icon-lg"} className="text-white" />
            <Button className="group-data-[collapsible=icon]:hidden p-6 rounded-3xl bg-[#3BD671] text-sm font-bold">
              Upgrade Now
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    match: string[];
  }[];
}) {
  const { pathname } = useLocation();

  const isActiveMatch = (patterns: string[]) =>
    patterns.some((pattern) => matchPath(pattern, pathname));

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = isActiveMatch(item.match);

        return (
          <SidebarMenuItem
            className="group-data-[collapsible=icon]:w-max group-data-[collapsible=icon]:shrink-0"
            key={item.title}
          >
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              asChild
              className={
                isActive
                  ? "bg-[#131A25]! text-white [&_svg]:text-[#3BD671]"
                  : "text-gray-300 hover:[&_svg]:text-[#3BD671]"
              }
            >
              <a
                className="group-data-[collapsible=icon]:ml-[-7px] h-10 group-data-[collapsible=icon]:p-0 pl-4"
                href={item.url}
              >
                {item.icon && (
                  <item.icon
                    className={isActive ? "text-[#3BD671]" : "text-gray-400"}
                  />
                )}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
