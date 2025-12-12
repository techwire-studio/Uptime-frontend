import type { RawMonitorsType } from "@/types/monitor";

export interface GlobalSettingsType {
  name: string;
  domain?: string | null;
  layout: {
    density: string;
    alignment: string;
  };
  seo: {
    robots: "index" | "noindex";
  };
  security: {
    passwordEnabled: boolean;
    password?: string | null;
  };
}

export type StatusPageMonitorsList = Pick<
  RawMonitorsType,
  | "id"
  | "name"
  | "type"
  | "url"
  | "next_run_at"
  | "checks"
  | "interval_seconds"
  | "last_checked_at"
>;

export enum StatusPageAccessLevelEnum {
  PUBLIC = "public",
  PRIVATE = "private",
}

export enum StatusPageStatusEnum {
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
}

export type RawStatusPagesType = {
  workspace_id: string;
  name: string;
  custom_domain: string | null;
  id: string;
  access_level: StatusPageAccessLevelEnum;
  status: StatusPageStatusEnum;
  updated_at: Date;
  created_at: Date;
};
