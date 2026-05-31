import { useState } from "react";
import { Layout } from "./layouts/MainLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { RecruitmentPage } from "./pages/RecruitmentPage";
import { PayrollPage } from "./pages/PayrollPage";
import { PerformancePage } from "./pages/PerformancePage";
import { LeavePage } from "./pages/LeavePage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AttendancePage } from "./pages/AttendancePage";
import { LocationPage } from "./pages/LocationPage";
import type { RouteProps, RouterProps } from "./types/router-types";
import { useAuth } from "./hooks/useAuth";
import { AuthPage } from "./pages/AuthPage";

// Router Implementation
const Router = ({ children }: RouterProps) => {
  return children;
};

const Route = ({ path, element, currentPath }: RouteProps) => {
  const [hasMounted, setHasMounted] = useState(false);
  const isActive = path === currentPath;

  if (isActive && !hasMounted) {
    setHasMounted(true);
  }

  if (!hasMounted && !isActive) return null;

  return (
    <div
      className={isActive ? "animate-page-in" : ""}
      style={{ display: isActive ? "block" : "none" }}
    >
      {element}
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("overview");
  const { isAuthenticated } = useAuth();

  // Show auth page if not logged in
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <Router>
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <Route
          path="overview"
          currentPath={currentPage}
          element={<OverviewPage />}
        />
        <Route
          path="employees"
          currentPath={currentPage}
          element={<EmployeesPage />}
        />
        <Route
          path="attendance"
          currentPath={currentPage}
          element={<AttendancePage />}
        />
        <Route
          path="location"
          currentPath={currentPage}
          element={<LocationPage />}
        />
        <Route
          path="recruitment"
          currentPath={currentPage}
          element={<RecruitmentPage />}
        />
        <Route path="leave" currentPath={currentPage} element={<LeavePage />} />
        <Route
          path="payroll"
          currentPath={currentPage}
          element={<PayrollPage />}
        />
        <Route
          path="performance"
          currentPath={currentPage}
          element={<PerformancePage />}
        />
        <Route
          path="documents"
          currentPath={currentPage}
          element={<DocumentsPage />}
        />
        <Route
          path="settings"
          currentPath={currentPage}
          element={<SettingsPage />}
        />
      </Layout>
    </Router>
  );
}
