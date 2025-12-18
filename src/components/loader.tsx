import React from "react";
import { cn } from "@/lib/utils";

interface PulseLoaderProps {
  size?: number;
  color?: string;
  layers?: number;
  icon?: React.ReactNode;
  iconSize?: number;
  classes?: string;
}

const PulseLoader: React.FC<PulseLoaderProps> = ({
  size = 96,
  color = "bg-green-500",
  layers = 3,
  icon,
  iconSize = 32,
  classes = "min-h-screen",
}) => {
  return (
    <div
      className={cn(
        "relative h-full w-full flex items-center justify-center",
        classes
      )}
    >
      <span
        className={cn("absolute rounded-full", color)}
        style={{
          width: size,
          height: size,
        }}
      />

      {Array.from({ length: layers }).map((_, i) => (
        <span
          key={i}
          className={cn("absolute rounded-full", color, "pulse-loader")}
          style={{
            width: size,
            height: size,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {icon && (
        <span
          className="relative z-10 flex items-center justify-center"
          style={{
            width: iconSize,
            height: iconSize,
          }}
        >
          {icon}
        </span>
      )}
    </div>
  );
};

export default PulseLoader;
