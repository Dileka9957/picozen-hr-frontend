import api, { extractError } from "../api/api";
import type { ApiResponse } from "../types/auth-types";
import type { Employee } from "./employeeService";

export interface AttendanceRecord {
  id?: number;
  employee: Employee;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "ON_LEAVE";
  overtimeMinutes?: number;
  remarks?: string;
}

export async function getTodayAttendance(): Promise<ApiResponse<AttendanceRecord[]>> {
  try {
    const { data } = await api.get<ApiResponse<AttendanceRecord[]>>("/api/attendance/company/today");
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function checkIn(remarks?: string): Promise<ApiResponse<AttendanceRecord>> {
  try {
    const { data } = await api.post<ApiResponse<AttendanceRecord>>("/api/attendance/check-in", {
      remarks: remarks || "",
    });
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function checkOut(attendanceId: number): Promise<ApiResponse<AttendanceRecord>> {
  try {
    const { data } = await api.put<ApiResponse<AttendanceRecord>>(
      `/api/attendance/check-out/${attendanceId}`,
    );
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getEmployeeAttendance(empId: number): Promise<ApiResponse<AttendanceRecord[]>> {
  try {
    const { data } = await api.get<ApiResponse<AttendanceRecord[]>>(`/api/attendance/employee/${empId}`);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getEmployeeAttendanceRange(
  empId: number,
  startDate: string,
  endDate: string,
): Promise<ApiResponse<AttendanceRecord[]>> {
  try {
    const { data } = await api.get<ApiResponse<AttendanceRecord[]>>(
      `/api/attendance/employee/${empId}/range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
    );
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function markAttendance(
  employeeId: number,
  date: string,
  checkIn: string,
  checkOut: string,
  status: string,
  remarks?: string,
): Promise<ApiResponse<AttendanceRecord>> {
  try {
    const { data } = await api.post<ApiResponse<AttendanceRecord>>("/api/attendance", {
      employee: { id: employeeId },
      date,
      checkInTime: checkIn,
      checkOutTime: checkOut,
      status,
      remarks: remarks || "",
    });
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

