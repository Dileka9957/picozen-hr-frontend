import api, { extractError } from "../api/api";
import type { ApiResponse } from "../types/auth-types";
import type { Employee } from "./employeeService";

export interface LocationRecord {
  id?: number;
  employee: Employee;
  latitude: number;
  longitude: number;
  address?: string;
  activityType?: string; // e.g. "CHECK_IN", "CHECK_OUT", "FIELD_VISIT"
  timestamp?: string;
}

export async function getAllLocations(): Promise<ApiResponse<LocationRecord[]>> {
  try {
    const { data } = await api.get<ApiResponse<LocationRecord[]>>("/api/locations");
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function trackLocation(
  employeeId: number,
  latitude: number,
  longitude: number,
  address: string,
  activityType: string,
): Promise<ApiResponse<LocationRecord>> {
  try {
    const { data } = await api.post<ApiResponse<LocationRecord>>("/api/locations/track", {
      employee: { id: employeeId },
      latitude,
      longitude,
      address,
      activityType,
    });
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function deleteLocation(id: number): Promise<ApiResponse<void>> {
  try {
    const { data } = await api.delete<ApiResponse<void>>(`/api/locations/${id}`);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}
