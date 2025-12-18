import { createContext } from "react";
import type { AuthContextType } from "@/types/account";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
