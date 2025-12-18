import type { SidebarOptionsType } from "@/types/core";
import { OptionsSidebar } from "@/components/optionsSidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import AccountDetails from "@/pages/account/details";
import Security from "@/pages/account/security";
import Notifications from "@/pages/account/notifications";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Routes } from "@/constants";

const CATEGORIES: SidebarOptionsType[] = [
  { id: "details", label: "Account details" },
  { id: "notifications", label: "Notifications & reports" },
  { id: "billing", label: "Billing, plan & subscription" },
  { id: "invoices", label: "Invoices" },
  { id: "security", label: "Security" },
];

const Account = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const activeCategory =
    CATEGORIES.find((category) =>
      location.pathname.split("/").includes(category.id)
    ) ?? CATEGORIES[0];

  const renderContent = () => {
    switch (activeCategory.id) {
      case "details":
        return <AccountDetails user={user} />;
      case "notifications":
        return <Notifications user={user} />;
      // case "billing":
      //   return <Billing />;
      // case "invoices":
      //   return <Invoices />;
      case "security":
        return <Security />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen mt-4 bg-background text-white flex">
      <OptionsSidebar
        options={CATEGORIES}
        selected={activeCategory}
        onSelect={(category) =>
          navigate(
            category.id === "account" ? "/account" : `/account/${category.id}`
          )
        }
      />
      <div className="flex-1 p-8">
        <div className="flex items-center mb-4 justify-between">
          <h1 className="text-2xl font-bold">
            {activeCategory.label}
            <span className="text-green-500">.</span>
          </h1>

          {activeCategory.id === "notifications" && (
            <Link to={Routes.ACCOUNT_DETAILS}>
              <Button className="bg-[#2a22c7] hover:bg-blue-700 text-xs text-white">
                <Pencil />
                Edit phone number & email
              </Button>
            </Link>
          )}
        </div>

        <div className="space-y-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Account;
