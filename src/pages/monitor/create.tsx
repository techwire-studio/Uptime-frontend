import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import CreateNewMonitor from "@/components/createNewMonitor";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

export default function CreateMonitorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const action = searchParams.get("action") as MonitorCreationEnum;
  const id = searchParams.get("id") as string;

  const [monitor, setMonitor] = useState<
    | (Omit<RawMonitorsType, "checks"> & {
        checks: RawMonitorChecksType[];
      })
    | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);

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
    const { data } = await axiosInstance.post("/monitors/new", {
      name: payload.url,
      url: payload.url,
      interval_seconds: payload.interval,
      alert_channels: payload.notifications,
      tags: payload.tags,
      type: "https",
      workspace_id: "1",
    });

    if (data.success) {
      toast.success("Monitor created successfully!");
      navigate(Routes.MONITORS);
    } else {
      toast.error("Failed to create monitor.");
    }
  };

  const editMonitor = async (payload: CreateNewMonitorType) => {
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
    return <div className="text-white">Loading monitor...</div>;
  }

  if (action === MonitorCreationEnum.EDIT && !loading && !monitor) {
    return <div className="text-red-500">Monitor not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex flex-col gap-4 mb-6">
        <Link to={Routes.MONITORS}>
          <Button
            variant="ghost"
            size="sm"
            className="w-max flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Monitoring
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {action === "edit" ? "Edit" : "Add Single"} Monitor
        </h1>
      </div>
      <CreateNewMonitor
        monitor={monitor}
        action={action}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
