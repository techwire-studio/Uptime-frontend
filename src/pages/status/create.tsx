import PulseLoader from "@/components/loader";
import GlobalSettingsStep from "@/components/statusPageGlobalSettings";
import MonitorSelectionStep from "@/components/statusPageMonitorSelection";
import { Routes } from "@/constants";
import axiosInstance from "@/lib/axios";
import { MonitorCreationEnum } from "@/types/monitor";
import {
  type GlobalSettingsType,
  type RawStatusPagesType,
  type StatusPageMonitorsList,
} from "@/types/status";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const getMonitorsList = async () => {
  const { data } = await axiosInstance.get("/monitors/select", {
    params: {
      select: "id,name,type,url",
    },
  });

  return data;
};

const CreateStatusPage = () => {
  const [selectedMonitors, setSelectedMonitors] = useState<
    StatusPageMonitorsList[]
  >([]);
  const [statusPage, setStatusPage] = useState<
    (RawStatusPagesType & { monitors: StatusPageMonitorsList[] }) | null
  >(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const action = searchParams.get("action") as MonitorCreationEnum;
  const id = searchParams.get("id") as string;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchStatusPageById = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`status/${id}`);
        setStatusPage(data.data);
        setSelectedMonitors(data.data.monitors || []);
      } catch {
        toast.error("Failed to load status page.");
        setSelectedMonitors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusPageById();
  }, [id]);

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const handleNext = () => setCurrentStep(2);

  const handleBack = () => setCurrentStep(1);

  const { data: response, isLoading } = useQuery<{
    data: StatusPageMonitorsList[];
    success: boolean;
  }>({
    queryKey: ["monitors"],
    queryFn: getMonitorsList,
  });

  if (isLoading) return <PulseLoader />;

  if (!response?.success) return <div>Error loading monitors.</div>;

  const createStatusPage = async (settings: GlobalSettingsType) => {
    const { data } = await axiosInstance.post("/status", {
      monitor_ids: selectedMonitors.map((monitor) => monitor.id),
      name: settings.name,
      workspace_id: "69ab2717-c9a7-4359-a254-91bcb0d12e12",
      custom_domain: settings.domain || null,
    });

    if (data.success) {
      toast.success("Status Page created successfully!");
      navigate(Routes.STATUS);
    } else {
      toast.error("Failed to create status page.");
    }
  };

  const editStatusPage = async (settings: GlobalSettingsType) => {
    const { data } = await axiosInstance.patch(`status/${id}`, {
      monitor_ids: selectedMonitors.map((monitor) => monitor.id),
      name: settings.name,
      custom_domain: settings.domain || null,
    });

    if (data.success) {
      toast.success("Status Page created successfully!");
      navigate(Routes.STATUS);
    } else {
      toast.error("Failed to create status page.");
    }
  };

  const handleFormSubmit = (settings: GlobalSettingsType) => {
    if (action === MonitorCreationEnum.EDIT) {
      editStatusPage(settings);
    } else createStatusPage(settings);
  };

  const monitors = response.data;

  if (action === MonitorCreationEnum.EDIT && loading) {
    return <div className="text-white">Loading status page...</div>;
  }

  return (
    <>
      <div className="min-h-screen p-6 text-gray-100">
        {currentStep === 1 && (
          <MonitorSelectionStep
            selectedMonitors={selectedMonitors}
            onMonitorsChange={setSelectedMonitors}
            onNext={handleNext}
            monitors={monitors}
            statusPage={statusPage}
          />
        )}

        {currentStep === 2 && (
          <GlobalSettingsStep
            onBack={handleBack}
            selectedMonitors={selectedMonitors}
            onFinish={handleFormSubmit}
            statusPage={statusPage}
          />
        )}
      </div>
    </>
  );
};
export default CreateStatusPage;
