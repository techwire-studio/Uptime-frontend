import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import PulseLoader from "@/components/loader";
import type { JSX } from "react";
import { Routes } from "@/constants";

export function PublicOnlyRoutes({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PulseLoader />;

  if (isAuthenticated) return <Navigate to={Routes.MONITORS} replace />;

  return children;
}
