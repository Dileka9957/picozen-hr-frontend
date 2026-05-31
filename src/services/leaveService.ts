import api, { extractError } from "../api/api";
import type { ApiResponse } from "../types/auth-types";
import type { Employee } from "./employeeService";

export interface LeaveRequest {
  id?: number;
  employee: Employee;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason: string;
  approvalRemarks?: string;
  appliedAt?: string;
}

export async function getPendingLeaves(): Promise<ApiResponse<LeaveRequest[]>> {
  try {
    const { data } = await api.get<ApiResponse<LeaveRequest[]>>("/api/leaves/pending");
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function applyLeave(
  leave: Partial<LeaveRequest>,
): Promise<ApiResponse<LeaveRequest>> {
  try {
    const { data } = await api.post<ApiResponse<LeaveRequest>>("/api/leaves", leave);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function approveLeave(
  id: number,
  remarks: string,
): Promise<ApiResponse<LeaveRequest>> {
  try {
    const { data } = await api.put<ApiResponse<LeaveRequest>>(
      `/api/leaves/${id}/approve?remarks=${encodeURIComponent(remarks)}`,
    );
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function rejectLeave(
  id: number,
  remarks: string,
): Promise<ApiResponse<LeaveRequest>> {
  try {
    const { data } = await api.put<ApiResponse<LeaveRequest>>(
      `/api/leaves/${id}/reject?remarks=${encodeURIComponent(remarks)}`,
    );
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

