import api, { extractError } from "../api/api";
import type { ApiResponse } from "../types/auth-types";

export interface CompanyDashboardData {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  pendingLeaves: number;
  monthlyPayroll: number;
  monthlySales: number;
  openPositions: number;
  newApplicants: number;
}

export async function getCompanyDashboard(): Promise<ApiResponse<CompanyDashboardData>> {
  try {
    const { data } = await api.get<ApiResponse<CompanyDashboardData>>("/api/dashboard/company");
    return data;
  } catch (err) {
    throw extractError(err);
  }
}
