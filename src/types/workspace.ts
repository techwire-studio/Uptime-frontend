export type AlertRulesType = {
  id: string;
  workspace_id: string;
  created_at: Date;
  alert_type: string;
  enabled: boolean;
  events: string[];
  monitor_id: string;
};
