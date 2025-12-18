import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Receipt,
  MoreHorizontal,
  type LucideIcon,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { UserMenuAction } from "@/types/core";
import type { UserType } from "@/types/account";

type MenuItem = {
  key: UserMenuAction;
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
};

const MAIN_MENU_ITEMS: MenuItem[] = [
  { key: "account", label: "Account details", icon: BadgeCheck },
  { key: "notifications", label: "Notifications & reports", icon: Bell },
  { key: "billing", label: "Billing, plan & subscription", icon: CreditCard },
  { key: "invoices", label: "Invoices", icon: Receipt },
  { key: "security", label: "Security", icon: Shield },
];

export function MenuDropup({
  user,
  onAction,
}: {
  user?: UserType | null;
  onAction: (action: UserMenuAction) => void;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="px-6 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-12 w-12 bg-background rounded-full">
                <AvatarImage src={user?.image || ""} alt={user?.name} />
                <AvatarFallback className="rounded-full bg-background">
                  {user?.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-base font-bold leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
              </div>

              <MoreHorizontal className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-none bg-[#1a2332] text-gray-200"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              {MAIN_MENU_ITEMS.map(({ key, label, icon: Icon }) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onAction(key)}
                  className="px-4 py-2 hover:bg-[#1f2838] cursor-pointer"
                >
                  <Icon className="mr-2 h-4 w-4 text-gray-400" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-[#232d3b]" />
            <DropdownMenuItem
              onClick={() => onAction("logout")}
              className="px-4 py-2 bg-[#742b33] text-red-200 hover:bg-[#873640] cursor-pointer rounded-none"
            >
              <LogOut className="mr-2 h-4 w-4 text-red-300" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
