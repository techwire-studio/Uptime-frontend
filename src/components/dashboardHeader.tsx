import { Link } from "react-router-dom";
import type { ComponentType, ButtonHTMLAttributes, ReactNode } from "react";

type DashboardHeaderProps = {
  label?: string;
  showButton?: boolean;
  icon?: ComponentType<{ size?: number }>;
  buttonLabel?: string;
  routeTo?: string;
  buttonType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  buttonClassName?: string;
  children?: ReactNode;
};

const DashboardHeader = ({
  label = "",
  showButton = true,
  icon: Icon,
  buttonLabel = "New",
  routeTo = "",
  buttonType = "button",
  buttonClassName = "",
  children,
}: DashboardHeaderProps) => {
  return (
    <header className="mb-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        {label}
        <span className="text-green-500">.</span>
      </h1>

      {children
        ? children
        : showButton &&
          routeTo && (
            <Link to={routeTo}>
              <button
                type={buttonType}
                className={`bg-[#2a22c7] hover:bg-indigo-700 text-white px-3 py-2 text-xs rounded-md flex items-center gap-2 font-medium ${buttonClassName}`}
              >
                {Icon && <Icon size={14} />}
                {buttonLabel}
              </button>
            </Link>
          )}
    </header>
  );
};

export default DashboardHeader;
