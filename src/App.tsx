import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layouts/appLayout";
import MonitorDashboard from "@/pages/monitor/dashboard";
import CreateNewMonitorPage from "@/pages/monitor/create";
import MonitorDetailedView from "@/pages/monitor/detailedView";
import IncidentDashboard from "@/pages/incident/dashboard";
import IncidentDetailedView from "@/pages/incident/detailedView";
import StatusPage from "@/pages/status/dashboard";
import CreateStatusPage from "@/pages/status/create";
import PublicStatusPage from "@/pages/status/publicStatusDashboard";
import PublicMonitorStatusPage from "@/pages/status/publicMonitorStatusDashboard";
import Integrations from "@/pages/integrations/page";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import { RequireAuth } from "@/components/layouts/requireAuthLayout";
import { AuthProvider } from "@/hooks/auth-provider";
import { PublicOnlyRoutes } from "@/components/layouts/publicOnlyLayout";
import Account from "@/pages/account/page";
import NotFound from "@/pages/notFound";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/monitors" element={<MonitorDashboard />} />
            <Route
              path="/monitor/create/*"
              element={<CreateNewMonitorPage />}
            />
            <Route path="/monitor/:id" element={<MonitorDetailedView />} />
            <Route path="/incidents" element={<IncidentDashboard />} />
            <Route path="/incident/:id" element={<IncidentDetailedView />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/status/create" element={<CreateStatusPage />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/account/*" element={<Account />} />
          </Route>
          <Route path="/status-page/:id" element={<PublicStatusPage />} />
          <Route
            path="/status-page/:id/:monitorId"
            element={<PublicMonitorStatusPage />}
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoutes>
                <Login />
              </PublicOnlyRoutes>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoutes>
                <Signup />
              </PublicOnlyRoutes>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
