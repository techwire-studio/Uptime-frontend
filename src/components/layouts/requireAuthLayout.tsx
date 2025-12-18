import { Routes } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to={Routes.LOGIN} replace />;

  return children;
}
