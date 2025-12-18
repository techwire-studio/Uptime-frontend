import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ButtonWithLoaderProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  showLoader?: boolean;
  loaderSize?: number;
}

const ButtonWithLoader: React.FC<ButtonWithLoaderProps> = ({
  label,
  icon,
  showLoader = false,
  className = "",
  loaderSize = 16,
  disabled,
  ...rest
}) => {
  return (
    <Button
      className={`flex items-center gap-2 justify-center ${className}`}
      disabled={showLoader || disabled}
      {...rest}
    >
      {showLoader && <Loader2 size={loaderSize} className="animate-spin" />}
      {!showLoader && icon}
      <span>{label}</span>
    </Button>
  );
};

export default ButtonWithLoader;
