import * as z from "zod";

export const createNewMonitorSchema = z.object({
  url: z.string().url("Invalid URL").min(1, "URL is required"),
  group: z.string(),
  tags: z.array(z.string()),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    voice: z.boolean(),
    push: z.boolean(),
  }),
  interval: z
    .number()
    .min(30, "Interval must be at least 30s")
    .max(86400, "Interval cannot exceed 24h"),
});

export type CreateNewMonitorType = z.infer<typeof createNewMonitorSchema>;
