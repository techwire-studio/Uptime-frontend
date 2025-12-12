import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Receipt,
  Shield,
  Users,
  Gift,
  MoreHorizontal,
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

export function MenuDropup({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
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
            {/* MAIN MENU */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="px-4 py-2 hover:bg-[#1f2838] cursor-pointer">
                <BadgeCheck className="mr-2 h-4 w-4 text-gray-400" />
                Account details
              </DropdownMenuItem>

              <DropdownMenuItem className="px-4 py-2 hover:bg-[#1f2838] cursor-pointer">
                <Bell className="mr-2 h-4 w-4 text-gray-400" />
                Notifications & reports
              </DropdownMenuItem>

              <DropdownMenuItem className="px-4 py-2 hover:bg-[#1f2838] cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                Billing, plan & subscription
              </DropdownMenuItem>

              <DropdownMenuItem className="px-4 py-2 hover:bg-[#1f2838] cursor-pointer">
                <Receipt className="mr-2 h-4 w-4 text-gray-400" />
                Invoices
              </DropdownMenuItem>

              <DropdownMenuItem className="px-4 py-2 hover:bg-[#1f2838] cursor-pointer">
                <Shield className="mr-2 h-4 w-4 text-gray-400" />
                Security
              </DropdownMenuItem>

              <DropdownMenuItem className="px-4 py-2 hover:bg-[#1f2838] cursor-pointer">
                <Users className="mr-2 h-4 w-4 text-gray-400" />
                Affiliate
              </DropdownMenuItem>

              <DropdownMenuItem className="px-4 py-2 hover:bg-[#1f2838] cursor-pointer">
                <Gift className="mr-2 h-4 w-4 text-gray-400" />
                Referral
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-[#232d3b]" />

            {/* LOG OUT */}
            <DropdownMenuItem className="px-4 py-2 bg-[#742b33] text-red-200 hover:bg-[#873640] cursor-pointer rounded-none">
              <LogOut className="mr-2 h-4 w-4 text-red-300" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
