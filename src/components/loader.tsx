import React from "react";
import { cn } from "@/lib/utils";

interface PulseLoaderProps {
  size?: number;
  color?: string;
  layers?: number;
}

const PulseLoader: React.FC<PulseLoaderProps> = ({
  size = 48,
  color = "bg-green-500",
  layers = 3,
}) => {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {Array.from({ length: layers }).map((_, i) => {
        const delay = i * 50;

        return (
          <div
            key={i}
            className={cn(
              "absolute rounded-full opacity-75",
              color,
              "animate-pulse"
            )}
            style={{
              width: `${size + i * 16}px`,
              height: `${size + i * 16}px`,
              animationDelay: `${delay}ms`,
              animationDuration: "0.6s",
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default PulseLoader;
