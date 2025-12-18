export type UserMenuAction =
  | "account"
  | "notifications"
  | "billing"
  | "invoices"
  | "security"
  | "logout";

export type SidebarOptionsType = {
  id: string;
  label: string;
};
