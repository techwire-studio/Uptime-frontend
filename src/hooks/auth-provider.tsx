import { authClient } from "@/lib/auth";
import { AuthContext } from "@/hooks/auth-context";
import type { AuthContextType, UserType } from "@/types/account";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import PulseLoader from "@/components/loader";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data;
    },
    refetchInterval: 30 * 1000,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const user = sessionData?.user as UserType | undefined;

  const { data: workspaces, isLoading: isWorkspaceLoading } = useQuery({
    queryKey: ["workspace", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await axiosInstance.get(`/workspaces/${user.id}`);
      return response.data.data;
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

  if (isSessionLoading || (user && isWorkspaceLoading)) return <PulseLoader />;

  const value: AuthContextType = user
    ? {
        session: sessionData?.session,

        isAuthenticated: true,
        user: {
          ...user,
          workspaceId: workspaces?.[0]?.id,
        },
      }
    : {
        session: undefined,
        isAuthenticated: false,
        user: undefined,
      };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
