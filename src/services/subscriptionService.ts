import api, { extractError } from "../api/api";
import type { ApiResponse } from "../types/auth-types";

export interface SubscriptionPlan {
  id?: number;
  planType: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
  name: string;
  description?: string;
  price: number;
  maxEmployees: number;
  durationInDays: number;
  dashboardAccess: boolean;
  attendanceModule: boolean;
  leaveModule: boolean;
  payrollModule: boolean;
  performanceModule: boolean;
  assetModule: boolean;
  messageModule: boolean;
  salesModule: boolean;
  locationTrackerModule: boolean;
  recruitmentModule: boolean;
}

export interface Subscription {
  id?: number;
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  active: boolean;
}

export async function getPublicPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
  try {
    const { data } = await api.get<ApiResponse<SubscriptionPlan[]>>("/api/subscription-plans/public");
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getMySubscription(): Promise<ApiResponse<Subscription>> {
  try {
    const { data } = await api.get<ApiResponse<Subscription>>("/api/subscription");
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function checkModuleAccess(moduleName: string): Promise<ApiResponse<boolean>> {
  try {
    const { data } = await api.get<ApiResponse<boolean>>(`/api/subscription/check-access/${moduleName}`);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}
