import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Mail, MessageSquare, Plus } from "lucide-react";
import type { UserType } from "@/types/account";
import axiosInstance from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PulseLoader from "@/components/loader";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "@/components/multiSelectDropdown";
import { ALERT_EVENT_OPTIONS } from "@/types/monitor";
import type { AlertRulesType } from "@/types/workspace";
import { toast } from "sonner";

type FormValues = {
  email_enabled: boolean;
  sms_enabled: boolean;
  email_events: string[];
  sms_events: string[];
};

const NotificationsAndReportsPage = ({ user }: { user: UserType }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [updatingRuleId, setUpdatingRuleId] = useState<string | null>(null);

  const { control, watch, reset } = useForm<FormValues>({
    defaultValues: {
      email_enabled: false,
      sms_enabled: false,
      email_events: [],
      sms_events: [],
    },
  });

  const emailEnabled = watch("email_enabled");
  const smsEnabled = watch("sms_enabled");

  const getUserMetadata = async () => {
    const { data } = await axiosInstance.get(`/users/${user.id}`);
    return data;
  };

  const getAlertChannel = async () => {
    const { data } = await axiosInstance.get(
      `/workspaces/${user.workspaceId}/rules`
    );
    return data.data as AlertRulesType[];
  };

  const { data: metadataResponse, isLoading } = useQuery({
    queryKey: ["metadata"],
    queryFn: getUserMetadata,
  });

  const { data: alertRules, isLoading: rulesLoading } = useQuery({
    queryKey: ["rules"],
    queryFn: getAlertChannel,
  });

  useEffect(() => {
    if (!alertRules) return;

    const emailRule = alertRules.find((r) => r.alert_type === "email");
    const smsRule = alertRules.find((r) => r.alert_type === "sms");

    reset({
      email_enabled: emailRule?.enabled ?? false,
      sms_enabled: smsRule?.enabled ?? false,
      email_events: emailRule?.events ?? [],
      sms_events: smsRule?.events ?? [],
    });
  }, [alertRules, reset]);

  if (isLoading || rulesLoading) return <PulseLoader />;

  const metadata = metadataResponse?.data;

  const hasPhoneNumber = Boolean(
    metadata?.sms_country_code && metadata?.sms_phone_number
  );

  const updateAlertRule = async (
    ruleId: string,
    payload: { enabled?: boolean; events?: string[] }
  ) => {
    setUpdatingRuleId(ruleId);

    try {
      await axiosInstance.patch(`/workspaces/alert-rules/${ruleId}`, payload);
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Alert rule updated");
    } catch {
      toast.error("Failed to update alert rule");
    } finally {
      setUpdatingRuleId(null);
    }
  };

  const handleToggleChange = (channelId: "email" | "sms", checked: boolean) => {
    const rule = alertRules?.find((r) => r.alert_type === channelId);
    if (!rule) return;

    updateAlertRule(rule.id, { enabled: checked });
  };

  const handleEventChange = (channelId: "email" | "sms", values: string[]) => {
    const rule = alertRules?.find((r) => r.alert_type === channelId);
    if (!rule) return;

    updateAlertRule(rule.id, { events: values });
  };

  const handleAddPhoneClick = () => navigate("/account/details");

  const channels = [
    {
      id: "email" as const,
      label: "E-mail",
      icon: Mail,
      value: user.email,
      enabled: emailEnabled,
    },
    {
      id: "sms" as const,
      label: "SMS",
      icon: MessageSquare,
      value: hasPhoneNumber
        ? `${metadata?.sms_country_code} ${metadata?.sms_phone_number}`
        : null,
      enabled: smsEnabled,
    },
  ];

  return (
    <div className="bg-primary rounded-lg">
      <h2 className="px-6 py-4 text-sm font-semibold text-white">
        Alert notification channels.
      </h2>

      {channels.map((channel) => {
        const Icon = channel.icon;
        const isSms = channel.id === "sms";
        const rule = alertRules?.find((r) => r.alert_type === channel.id);

        return (
          <div
            key={channel.id}
            className="flex items-center justify-between px-6 py-5 border-b border-[#2a3441] last:border-b-0"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-[#2a3441] rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-200" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold text-white text-left">
                  {channel.label}
                </div>

                {channel.value ? (
                  <span className="text-xs text-gray-400">{channel.value}</span>
                ) : (
                  <span
                    onClick={
                      isSms && !hasPhoneNumber ? handleAddPhoneClick : undefined
                    }
                    className="text-xs cursor-pointer text-green-400 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add phone number
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Controller
                name={`${channel.id}_events`}
                control={control}
                render={({ field }) => (
                  <MultiSelectDropdown
                    options={ALERT_EVENT_OPTIONS}
                    value={field.value}
                    disabled={
                      !channel.enabled ||
                      (isSms && !hasPhoneNumber) ||
                      updatingRuleId === rule?.id
                    }
                    onChange={(values) => {
                      field.onChange(values);
                      handleEventChange(channel.id, values);
                    }}
                  />
                )}
              />

              <Controller
                name={`${channel.id}_enabled`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    disabled={
                      (isSms && !hasPhoneNumber) || updatingRuleId === rule?.id
                    }
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      handleToggleChange(channel.id, checked);
                    }}
                  />
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationsAndReportsPage;
