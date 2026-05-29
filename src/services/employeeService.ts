import api, { extractError } from "../api/api";
import type { ApiResponse } from "../types/auth-types";

export interface UserDetails {
  id?: number;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  role?: string;
}

export interface Employee {
  id?: number;
  employeeId: string;
  user: UserDetails;
  designation: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContact?: string;
  basicSalary?: number;
  bankName?: string;
  bankAccountNumber?: string;
  epfNumber?: string;
  etfNumber?: string;
  active?: boolean;
}

export async function getAllEmployees(): Promise<ApiResponse<Employee[]>> {
  try {
    const { data } = await api.get<ApiResponse<Employee[]>>("/api/employees");
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getEmployeeById(id: number): Promise<ApiResponse<Employee>> {
  try {
    const { data } = await api.get<ApiResponse<Employee>>(`/api/employees/${id}`);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function createEmployee(
  employee: Employee,
  email: string,
  password: string,
): Promise<ApiResponse<Employee>> {
  try {
    const { data } = await api.post<ApiResponse<Employee>>(
      `/api/employees?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      employee,
    );
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function updateEmployee(
  id: number,
  employee: Employee,
): Promise<ApiResponse<Employee>> {
  try {
    const { data } = await api.put<ApiResponse<Employee>>(`/api/employees/${id}`, employee);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function deleteEmployee(id: number): Promise<ApiResponse<void>> {
  try {
    const { data } = await api.delete<ApiResponse<void>>(`/api/employees/${id}`);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

