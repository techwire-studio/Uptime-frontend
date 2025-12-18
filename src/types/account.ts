import type { authClient } from "@/lib/auth";
import type {
  accountInfoSchema,
  contactInfoSchema,
  loginSchema,
  passwordSchema,
  registerDetailsSchema,
  securitySchema,
} from "@/validations/account";
import type z from "zod";

export type RegisterFormType = z.infer<typeof registerDetailsSchema>;

export type LoginFormType = z.infer<typeof loginSchema>;

export type PasswordFormType = z.infer<typeof passwordSchema>;

export type ContactInfoType = z.infer<typeof contactInfoSchema>;

export type AccountInfoType = z.infer<typeof accountInfoSchema>;

export type SessionData = NonNullable<
  ReturnType<typeof authClient.useSession>["data"]
>;

export type UserType = SessionData["user"] & {
  workspaceId: string;
};

export type SessionType = SessionData["session"];

export type AuthContextType = {
  isAuthenticated: boolean;
  session?: SessionType;
  user?: UserType;
};

export type SecurityType = z.infer<typeof securitySchema>;

export type UserMetaDataType = {
  id: string;
  timezone: string;
  locale: string;
  sms_country_code: string | null;
  sms_phone_number: string | null;
  sms_verified: boolean;
  call_country_code: string | null;
  call_phone_number: string | null;
  call_verified: boolean;
  preferences: Record<string, string>;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};
