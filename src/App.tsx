import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateNewMonitorPage from "@/pages/monitor/create";
import MonitorDashboard from "@/pages/monitor/dashboard";
import MonitorDetailedView from "@/pages/monitor/detailedView";
import AppLayout from "@/components/layouts/appLayout";
import IncidentDashboard from "@/pages/incident/dashboard";
import IncidentDetailedView from "@/pages/incident/detailedView";
import StatusPage from "@/pages/status/dashboard";
import CreateStatusPage from "@/pages/status/create";
import PublicStatusPage from "@/pages/status/publicStatusDashboard";
import PublicMonitorStatusPage from "@/pages/status/publicMonitorStatusDashboard";
import Integrations from "@/pages/integrations/page";

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/monitors" element={<MonitorDashboard />} />
          <Route path="/monitor/create/*" element={<CreateNewMonitorPage />} />
          <Route path="/monitor/:id" element={<MonitorDetailedView />} />
          <Route path="/incidents" element={<IncidentDashboard />} />
          <Route path="/incident/:id" element={<IncidentDetailedView />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/status/create" element={<CreateStatusPage />} />
          <Route path="/status-page/:id" element={<PublicStatusPage />} />
          <Route
            path="/status-page/:id/:monitorId"
            element={<PublicMonitorStatusPage />}
          />
          <Route path="integrations" element={<Integrations />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
