import {
  Slack,
  Send,
  Webhook,
  MessageSquare,
  Circle,
  PanelsTopLeft,
  MessagesSquare,
  Zap,
  Bell,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { z, type ZodTypeAny } from "zod";

export type PlanAvailability = {
  solo: boolean;
  team: boolean;
  enterprise: boolean;
};

export type ProviderField = {
  label: string;
  key: string;
  type: "text" | "textarea";
  placeholder: string;
  schema: ZodTypeAny;
};

export type Provider = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  availability: PlanAvailability | null;
  upgradeText?: string;
  fields: ProviderField[];
  defaultEvents: string[];
  helpText?: string;
};

export const PROVIDERS: Record<string, Provider> = {
  slack: {
    id: "slack",
    name: "Slack",
    description:
      "Slack messages are a great way to inform the entire team of a downtime.",
    icon: Slack,
    category: "Chat platforms",
    availability: { solo: true, team: true, enterprise: true },
    upgradeText: "Available only in Solo, Team and Enterprise. Upgrade now",
    fields: [
      {
        label: "Webhook URL",
        key: "webhook_url",
        type: "text",
        placeholder: "https://hooks.slack.com/services/...",
        schema: z
          .string()
          .min(1, "Webhook URL is required")
          .startsWith("https://hooks.slack.com/services/", {
            message:
              'Invalid input: must start with "https://hooks.slack.com/services/"',
          }),
      },
    ],
    defaultEvents: ["UP", "DOWN", "SSL_EXPIRY", "DOMAIN_EXPIRY"],
  },

  telegram: {
    id: "telegram",
    name: "Telegram",
    description: "Telegram messages are a great way how to stay alerted.",
    icon: Send,
    category: "Chat platforms",
    availability: { solo: true, team: true, enterprise: true },
    upgradeText: "Available only in Solo, Team and Enterprise. Upgrade now",
    fields: [
      {
        label: "Bot Token",
        key: "bot_token",
        type: "text",
        placeholder: "Enter bot token",
        schema: z.string().min(1, "Bot token is required"),
      },
      {
        label: "Chat ID",
        key: "chat_id",
        type: "text",
        placeholder: "Enter chat ID",
        schema: z.string().min(1, "Chat ID is required"),
      },
    ],
    defaultEvents: ["UP", "DOWN", "SSL_EXPIRY", "DOMAIN_EXPIRY"],
  },

  webhook: {
    id: "webhook",
    name: "Webhook",
    description:
      "For advanced alerting you can setup webhooks to your own system or app.",
    icon: Webhook,
    category: "Webhooks",
    availability: { solo: false, team: true, enterprise: true },
    upgradeText: "Available only in Team and Enterprise. Upgrade now",
    fields: [
      {
        label: "Webhook URL",
        key: "webhook_url",
        type: "text",
        placeholder: "https://your-domain.com/webhook",
        schema: z.string().url("Invalid URL"),
      },
      {
        label: "Custom Headers (JSON)",
        key: "custom_headers",
        type: "textarea",
        placeholder: '{"Authorization":"Bearer token"}',
        schema: z
          .string()
          .optional()
          .refine((v) => {
            if (!v) return true;
            try {
              JSON.parse(v);
              return true;
            } catch {
              return false;
            }
          }, "Must be valid JSON"),
      },
    ],
    defaultEvents: ["UP", "DOWN", "SSL_EXPIRY", "DOMAIN_EXPIRY"],
  },

  discord: {
    id: "discord",
    name: "Discord",
    description:
      "Get important monitor status updates in your Discord messages.",
    icon: MessageSquare,
    category: "Chat platforms",
    availability: null,
    fields: [
      {
        label: "Discord Webhook URL",
        key: "webhook_url",
        type: "text",
        placeholder: "https://discord.com/api/webhooks/...",
        schema: z
          .string()
          .min(1, "Webhook URL is required")
          .refine(
            (v) =>
              v.startsWith("https://discord.com/api/webhooks/") ||
              v.startsWith("https://discordapp.com/api/webhooks/"),
            {
              message:
                'Invalid input: must start with "https://discord.com/api/webhooks/" or "https://discordapp.com/api/webhooks/"',
            }
          ),
      },
    ],
    defaultEvents: ["UP", "DOWN", "SSL_EXPIRY", "DOMAIN_EXPIRY"],
    helpText:
      "The Discord Webhook URL can be created from Discord Channel Settings > Integrations > Webhooks.",
  },

  mattermost: {
    id: "mattermost",
    name: "Mattermost",
    description: "Get status update on your Mattermost.",
    icon: Circle,
    category: "Chat platforms",
    availability: { solo: true, team: true, enterprise: true },
    upgradeText: "Available only in Solo, Team and Enterprise. Upgrade now",
    fields: [
      {
        label: "Webhook URL",
        key: "webhook_url",
        type: "text",
        placeholder: "https://your-mattermost.com/hooks/...",
        schema: z.string().url("Invalid URL"),
      },
    ],
    defaultEvents: ["UP", "DOWN", "SSL_EXPIRY", "DOMAIN_EXPIRY"],
  },

  msteams: {
    id: "msteams",
    name: "MS Teams",
    description:
      "Get notifications inside your MS Teams app to alert everyone in the group.",
    icon: PanelsTopLeft,
    category: "Chat platforms",
    availability: { solo: true, team: true, enterprise: true },
    upgradeText: "Available only in Solo, Team and Enterprise. Upgrade now",
    fields: [
      {
        label: "Webhook URL",
        key: "webhook_url",
        type: "text",
        placeholder: "https://outlook.office.com/webhook/...",
        schema: z.string().url("Invalid URL"),
      },
    ],
    defaultEvents: ["UP", "DOWN", "SSL_EXPIRY", "DOMAIN_EXPIRY"],
  },

  google_chat: {
    id: "google_chat",
    name: "Google Chat",
    description:
      "Get notifications into the Google Chat. Just copy the space URL to UptimeRobot.",
    icon: MessagesSquare,
    category: "Chat platforms",
    availability: null,
    fields: [
      {
        label: "Webhook URL",
        key: "webhook_url",
        type: "text",
        placeholder: "https://chat.googleapis.com/v1/spaces/...",
        schema: z.string().url("Invalid URL"),
      },
    ],
    defaultEvents: ["UP", "DOWN", "SSL_EXPIRY", "DOMAIN_EXPIRY"],
  },

  zapier: {
    id: "zapier",
    name: "Zapier",
    description: "Integrate your Zapier account to get alerted right away.",
    icon: Zap,
    category: "Automation",
    availability: { solo: false, team: true, enterprise: true },
    upgradeText: "Available only in Team and Enterprise. Upgrade now",
    fields: [],
    defaultEvents: ["UP", "DOWN"],
  },

  pagerduty: {
    id: "pagerduty",
    name: "PagerDuty",
    description:
      "Send up & down events and auto-resolve your incidents in PagerDuty.",
    icon: Bell,
    category: "Incident management",
    availability: null,
    fields: [
      {
        label: "Integration Key",
        key: "integration_key",
        type: "text",
        placeholder: "Enter integration key",
        schema: z.string().min(1, "Integration key is required"),
      },
    ],
    defaultEvents: ["UP", "DOWN"],
  },

  pushbullet: {
    id: "pushbullet",
    name: "Pushbullet",
    description:
      "Get instant notifications on your android phone, browser, or PC in Pushbullet app.",
    icon: Smartphone,
    category: "Push notifications",
    availability: null,
    fields: [
      {
        label: "Access Token",
        key: "access_token",
        type: "text",
        placeholder: "Enter access token",
        schema: z.string().min(1, "Access token is required"),
      },
    ],
    defaultEvents: ["UP", "DOWN"],
  },

  pushover: {
    id: "pushover",
    name: "Pushover",
    description:
      "Get notifications on your Android, iPhone, iPad, and Desktop.",
    icon: Smartphone,
    category: "Push notifications",
    availability: null,
    fields: [
      {
        label: "User Key",
        key: "user_key",
        type: "text",
        placeholder: "Enter user key",
        schema: z.string().min(1, "User key is required"),
      },
      {
        label: "API Token",
        key: "api_token",
        type: "text",
        placeholder: "Enter API token",
        schema: z.string().min(1, "API token is required"),
      },
    ],
    defaultEvents: ["UP", "DOWN"],
  },
};
