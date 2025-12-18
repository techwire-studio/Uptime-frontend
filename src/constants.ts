export const Routes = {
  ROOT: "/",
  MONITORS: "/monitors",
  MONITOR: "/monitor",
  CREATE_MONITOR: "/monitor/create",
  INCIDENTS: "/incidents",
  STATUS: "/status",
  PUBLIC_STATUS: "/status-page",
  CREATE_STATUS: "/status/create",
  INTEGRATIONS: "integrations",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ACCOUNT_DETAILS: "/account/details",
  NOTIFICATIONS: "/account/notifications",
  BILLING: "/account/billing",
  INVOICES: "/account/invoices",
  SECURITY: "/account/security",
};

export const DAY_MS = 24 * 60 * 60 * 1000;

export const TIMEZONES = [
  { value: "Etc/UTC", label: "GMT/UTC (GMT+00:00)" },
  { value: "Etc/GMT+12", label: "Yankee Timezone (GMT-12:00)" },
  { value: "Pacific/Midway", label: "Midway Island, Samoa (GMT-11:00)" },
  { value: "Pacific/Honolulu", label: "Hawaii (GMT-10:00)" },
  { value: "America/Anchorage", label: "Alaska (GMT-09:00)" },
  {
    value: "America/Los_Angeles",
    label: "Pacific Time (US & Canada) (GMT-08:00)",
  },
  { value: "America/Denver", label: "Mountain Time (US & Canada) (GMT-07:00)" },
  { value: "America/Phoenix", label: "Arizona (GMT-07:00)" },
  {
    value: "America/Chicago",
    label: "Central Time (US & Canada), Mexico City (GMT-06:00)",
  },
  { value: "America/Regina", label: "Saskatchewan (GMT-06:00)" },
  {
    value: "America/New_York",
    label: "Eastern Time (US & Canada) (GMT-05:00)",
  },
  { value: "America/Lima", label: "Lima (GMT-05:00)" },
  { value: "America/Bogota", label: "Bogota (GMT-05:00)" },
  {
    value: "America/Halifax",
    label: "Atlantic Time (Canada), La Paz (GMT-04:00)",
  },
  { value: "America/Caracas", label: "Caracas-Venezuela (GMT-04:00)" },
  { value: "America/St_Johns", label: "Newfoundland (GMT-03:30)" },
  {
    value: "America/Argentina/Buenos_Aires",
    label: "Buenos Aires, Georgetown (GMT-03:00)",
  },
  { value: "America/Sao_Paulo", label: "Sao Paulo (GMT-03:00)" },
  { value: "Atlantic/South_Georgia", label: "Mid-Atlantic (GMT-02:00)" },
  { value: "Atlantic/Azores", label: "Azores, Cape Verde Islands (GMT-01:00)" },
  {
    value: "Europe/London",
    label: "Western Europe Time, London, Lisbon, Casablanca (GMT+00:00)",
  },
  {
    value: "Europe/Brussels",
    label: "Brussels, Copenhagen, Madrid, Paris (GMT+01:00)",
  },
  { value: "Africa/Lagos", label: "West Africa Time (GMT+01:00)" },
  {
    value: "Europe/Athens",
    label: "Kaliningrad, Athens, Helsinki (GMT+02:00)",
  },
  {
    value: "Africa/Johannesburg",
    label: "South African Standard Time (GMT+02:00)",
  },
  { value: "Asia/Jerusalem", label: "Jerusalem (GMT+02:00)" },
  { value: "Asia/Baghdad", label: "Baghdad, Riyadh (GMT+03:00)" },
  { value: "Europe/Moscow", label: "Moscow, St. Petersburg (GMT+03:00)" },
  { value: "Europe/Istanbul", label: "Istanbul (GMT+03:00)" },
  { value: "Asia/Tehran", label: "Tehran (GMT+03:30)" },
  {
    value: "Asia/Dubai",
    label: "Abu Dhabi, Muscat, Baku, Tbilisi (GMT+04:00)",
  },
  { value: "Europe/Samara", label: "Samara (GMT+04:00)" },
  { value: "Asia/Kabul", label: "Kabul (GMT+04:30)" },
  {
    value: "Asia/Yekaterinburg",
    label: "Ekaterinburg, Islamabad, Karachi, Tashkent (GMT+05:00)",
  },
  { value: "Asia/Almaty", label: "Almaty (GMT+05:00)" },
  {
    value: "Asia/Kolkata",
    label: "Bombay, Colombo, Calcutta, Madras, New Delhi (GMT+05:30)",
  },
  { value: "Asia/Kathmandu", label: "Kathmandu (GMT+05:45)" },
  { value: "Asia/Dhaka", label: "Dhaka (GMT+06:00)" },
  { value: "Asia/Yangon", label: "Yangon (Myanmar) (GMT+06:30)" },
  { value: "Asia/Bangkok", label: "Bangkok, Hanoi, Jakarta (GMT+07:00)" },
  {
    value: "Asia/Shanghai",
    label: "Beijing, Perth, Singapore, Hong Kong (GMT+08:00)",
  },
  {
    value: "Asia/Tokyo",
    label: "Tokyo, Seoul, Osaka, Sapporo, Yakutsk (GMT+09:00)",
  },
  { value: "Pacific/Guam", label: "Guam, Vladivostok (GMT+10:00)" },
  {
    value: "Australia/Brisbane",
    label: "Australian Eastern Time Zone (Brisbane) (GMT+10:00)",
  },
  { value: "Australia/Adelaide", label: "Adelaide, Darwin (GMT+10:30)" },
  {
    value: "Pacific/Magadan",
    label: "Magadan, Solomon Islands, New Caledonia (GMT+11:00)",
  },
  { value: "Australia/Sydney", label: "Sydney, Melbourne (GMT+11:00)" },
  { value: "Pacific/Noumea", label: "Nouméa, Solomon Islands (GMT+11:00)" },
  { value: "Pacific/Enderbury", label: "Eniwetok, Kwajalein (GMT+12:00)" },
  {
    value: "Pacific/Auckland",
    label: "Auckland, Wellington, Fiji, Kamchatka (GMT+13:00)",
  },
  {
    value: "Pacific/Tongatapu",
    label: "New Zealand Daylight Time, Tonga (GMT+13:00)",
  },
  { value: "Pacific/Chatham", label: "Chatham Islands (GMT+13:45)" },
];

export const WORKSPACE_ID = "98492814-9fea-44b3-8df2-957cce66c76f"; // TODO : REMOVE
