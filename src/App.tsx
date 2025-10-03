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
import type { RouteProps, RouterProps } from "./types/router-types";

// Router Implementation
const Router = ({ children }: RouterProps) => {
  return children;
};

const Route = ({ path, element, currentPath }: RouteProps) => {
  return path === currentPath ? element : null;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("overview");

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
