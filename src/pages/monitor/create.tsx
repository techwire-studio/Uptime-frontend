import CreateNewMonitor from "@/components/createNewMonitor";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import type { CreateNewMonitorType } from "@/validations/monitor";
import { toast } from "sonner";
import { Routes } from "@/constants";
import {
  MonitorCreationEnum,
  type RawMonitorChecksType,
  type RawMonitorsType,
} from "@/types/monitor";
import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import PulseLoader from "@/components/loader";
import { useAuth } from "@/hooks/use-auth";
import BackButton from "@/components/backButton";

export default function CreateMonitorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const action = searchParams.get("action") as MonitorCreationEnum;
  const id = searchParams.get("id") as string;

  const [monitor, setMonitor] = useState<
    | (Omit<RawMonitorsType, "checks"> & {
        checks: RawMonitorChecksType[];
      })
    | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [apiCallLoader, setApiCallLoader] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMonitorById = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`monitors/${id}`);
        setMonitor(data.data);
      } catch {
        toast.error("Failed to load monitor.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonitorById();
  }, [id]);

  const createNewMonitor = async (payload: CreateNewMonitorType) => {
    setApiCallLoader(true);

    try {
      const { data } = await axiosInstance.post("/monitors/new", {
        name: payload.url,
        url: payload.url,
        interval_seconds: payload.interval,
        alert_channels: payload.notifications,
        tags: payload.tags,
        type: "https",
        workspace_id: user?.workspaceId,
      });

      if (data.success) {
        toast.success("Monitor created successfully!");
        navigate(`/monitor/${data.data.id}`);
      }
    } catch (err) {
      const error = err as unknown as AxiosError;
      toast.error(error?.response?.statusText || "Failed to create monitor.");
    } finally {
      setApiCallLoader(false);
    }
  };

  const editMonitor = async (payload: CreateNewMonitorType) => {
    setApiCallLoader(true);

    try {
      const { data } = await axiosInstance.patch(`monitors/${id}`, {
        name: payload.url,
        url: payload.url,
        interval_seconds: payload.interval,
        tags: payload.tags,
      });

      if (data.success) {
        toast.success("Monitor edited successfully!");
        navigate(Routes.MONITORS);
      }
    } catch (err) {
      const error = err as AxiosError;
      toast.error(error?.response?.statusText || "Failed to edit monitor.");
    } finally {
      setApiCallLoader(false);
    }
  };

  const handleFormSubmit = async (data: CreateNewMonitorType) => {
    if (action === MonitorCreationEnum.EDIT) {
      editMonitor(data);
    } else createNewMonitor(data);
  };

  if (
    (action === MonitorCreationEnum.EDIT ||
      action === MonitorCreationEnum.CLONE) &&
    loading
  ) {
    return <PulseLoader />;
  }

  if (action === MonitorCreationEnum.EDIT && !loading && !monitor) {
    return <div className="text-red-500">Monitor not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex flex-col gap-4 mb-6">
        <BackButton label="Monitoring" />
        <h1 className="text-2xl font-bold">
          {action === "edit" ? "Edit" : "Add Single"} Monitor
        </h1>
      </div>
      <CreateNewMonitor
        monitor={monitor}
        showLoader={apiCallLoader}
        action={action}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
